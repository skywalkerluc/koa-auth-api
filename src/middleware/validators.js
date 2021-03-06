import { verify } from 'jsonwebtoken';
import User from '../models/user';
import config from '../../config';
import { getToken } from '../utils/auth';

export async function ensureUser(ctx, next) {
  const token = getToken(ctx);

  if (!token) {
    ctx.throw(401);
  }

  let decoded = null;
  try {
    decoded = verify(token, config.token);
  } catch (err) {
    ctx.throw(401);
  }

  ctx.state.user = await User.findById(decoded.id, '-senha');
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  return next();
}
