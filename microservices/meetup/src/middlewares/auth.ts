import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { IUserInfo } from '../interfaces/userInfo';



const getUser = async (req: Request, next: NextFunction): Promise<IUserInfo> => {
  const host = process.env.USER_CHECK_HOST;
  const port = process.env.USER_CHECK_PORT;
  const user: IUserInfo = await axios.post(`http://${host}:${port}/auth/verify-user`,
    { token: req.headers.authorization }
  ).then(user => user.data);

  return user;
};


export const isUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {


  const validationInfo: IUserInfo | null = await getUser(req, next);
  Object.defineProperty(req, 'userId', { value: validationInfo?.id });
  if (!validationInfo?.isValid) {
    return res.status(403).json({
      message: 'Forbbiden',
    });
  }

  next();
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationInfo: IUserInfo | null = await getUser(req, next);
  Object.defineProperty(req, 'userId', { value: validationInfo?.id });
  if (!validationInfo?.isValid || !validationInfo.roles.includes('admin')) {
    return res.status(403).json({
      message: 'Forbbiden',
    });
  }

  next();
};

