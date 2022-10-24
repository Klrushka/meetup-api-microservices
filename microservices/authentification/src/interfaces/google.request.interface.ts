import { Request } from 'express';

type User = {
  _id: string;
  roles: [string];
};

export interface RequestInterface extends Request {
  user?: User;
}
