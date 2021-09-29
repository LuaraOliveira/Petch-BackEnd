import 'express';
import { User } from '../user/user.model';

declare module 'express' {
  interface Request {
    user: User;
  }
}