import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { IUserInfo } from '../interfaces/userInfo';



const getUser = async (req: Request, next: NextFunction): Promise<IUserInfo> => {
  const user: IUserInfo = await axios.post(`${process.env.USER_CHECK_URL}`,
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

