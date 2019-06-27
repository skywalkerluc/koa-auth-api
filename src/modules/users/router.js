import { ensureUser } from '../../middleware/validators';
import * as user from './controller';

export const baseUrl = '/users';

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [user.createUser]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [ensureUser, user.getUser]
  }
];
