import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from '../controllers/user.controller';

export const userRouter = Router();

userRouter.route('/').get(listUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
