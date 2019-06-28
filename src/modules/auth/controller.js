/* eslint-disable import/prefer-default-export */
import passport from 'koa-passport';

export async function authUser(ctx, next) {
  return passport.authenticate('local', async user => {
    if (!user) {
      ctx.throw(401);
    }

    const token = user.generateToken();

    const response = user.toJSON();

    delete response.senha;

    ctx.body = {
      token,
      user: response
    };
  })(ctx, next);
}
