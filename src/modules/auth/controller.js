import bcrypt from 'bcrypt';
import UserModel from '../../models/user';

export default async function authUser(ctx) {
  const loginData = ctx.request.body;
  const user = await UserModel.findOne({ email: loginData.email });
  if (!user) {
    ctx.throw(401);
  }

  const token = user.generateToken();
  const response = user.toJSON();

  delete response.senha;

  const isPasswordMatch = await bcrypt.compare(loginData.senha, user.senha);
  if (isPasswordMatch) {
    await UserModel.findOneAndUpdate({ email: user.email }, { ultimo_login: new Date(), token });

    ctx.body = {
      user: { ...response, token }
    };
  }
}
