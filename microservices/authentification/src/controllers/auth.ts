import crypto from 'crypto';
import { Response, Request, NextFunction } from 'express';
import jwtDecode from 'jwt-decode';
import passport from 'passport';
import { strategies } from '../enums/strategies';
import { RequestInterface } from '../interfaces/google.request.interface';
import { UserInterface } from '../interfaces/user.interface';
import { googleUser } from '../models/db/google.user';
import { user } from '../models/db/user';
import { isUserExist } from '../services/authentification/auth';
import { encrypt } from '../services/encryption/password';
import { generateJwt } from '../services/jwt';
import { sendMail } from '../services/mail.sendler';

class AuthentificationController {
  async registration(req: Request, res: Response, next: NextFunction) {
    if (await isUserExist(req.body.email)) {
      res.status(409).json({ message: 'User already exist' });
      return;
    }

    const emailToken = crypto.randomBytes(60).toString('hex');

    const userPayload = {
      ...req.body,
      emailToken,
      ...encrypt(req.body.password),
    };

    const newUser = await user.create(userPayload);

    const msg = {
      from: process.env.MAIL_USER ?? 'unknown',
      to: newUser.email,
      subject: 'Veryfying',
      text: `http://${req.headers.host}/auth/verify-email/${newUser.emailToken}`,
      html: undefined,
    };
    await sendMail(msg);
    res.status(200).json({ message: 'check your email and verify it' });
  }

  async login(req: any, res: Response, next: NextFunction) {
    passport.authenticate(
      strategies.local,
      (err: Error, user: UserInterface) => {
        if (err) {
          res.status(404).json(err);
        }
        if (!user) {
          res.status(401).json({
            message: 'Invalid password or email',
          });
        } else if (!user.isVerified) {
          res.status(403).json({
            message: 'Please check your email to confirm it',
          });
        } else {
          res.status(200).json(generateJwt(user._id, user.roles));
        }
      }
    )(req, res, next);
  }

  async googleAuth(req: RequestInterface, res: Response, next: NextFunction) {
    if (typeof req.user === 'undefined') {
      res.status(500).json();
    } else {
      res.json(generateJwt(req.user._id, req.user.roles));
    }
  }

  async emailVerification(req: Request, res: Response, next: NextFunction) {
    const nonVerifyUser = await user.findOne({ emailToken: req.params.token });
    if (!nonVerifyUser) {
      res.status(404).json({
        message: 'User verified or doesn\'t exist',
      });
    } else {
      await user.updateOne(
        { _id: nonVerifyUser._id },
        { $set: { emailToken: null, isVerified: true } }
      );
      res.redirect(`${process.env.AFTER_VERIFYING_EMAIL_REDIRECT_URL}#/login`);
    }
  }

  async isUserValid(req: Request, res: Response, next: NextFunction) {
    if (!req.body.token) {
      return res.status(500).json({
        message: 'invalid Token',
        isValid: false,
      });
    }

    const userData: any = jwtDecode(req.body.token);

    let isUser = await user.findOne({ _id: userData.id });

    if (!isUser) {
      isUser = await googleUser.findOne({ _id: userData.id });
    }

    res.status(200).json({
      isValid: !!isUser,
      id: userData.id,
      roles: userData.roles,
    });
  }
}

export const authController = new AuthentificationController();
