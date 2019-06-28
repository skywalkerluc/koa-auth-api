/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcrypt';
import UserModel from '../../models/user';

/**
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X POST -d '{ "username": "johndoe@gmail.com", "password": "foo" }' localhost:5000/auth
 */
export async function authUser(ctx) {
  const loginData = ctx.request.body;
  const user = await UserModel.findOne({ email: loginData.email });
  if (!user) {
    ctx.throw(401);
  }
  const isPasswordMatch = await bcrypt.compare(loginData.senha, user.senha);
  if (isPasswordMatch) {
    const token = '043934034';
    await UserModel.findOneAndUpdate({ email: user.email }, { ultimo_login: new Date(), token });

    ctx.body = {
      user
    };
  }
}
