import passport from 'koa-passport';

/**
 * @api {post} /auth Authenticate user
 * @apiVersion 1.0.0
 * @apiName AuthUser
 * @apiGroup Auth
 *
 * @apiParam {String} username  User username.
 * @apiParam {String} password  User password.
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "username": "johndoe@gmail.com", "password": "foo" }' localhost:5000/auth
 */

export async function authUser(ctx, next) {
  return passport.authenticate('local', user => {
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
