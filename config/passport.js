import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import UserModel from '../src/models/user';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id, '-senha');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  'local',
  new Strategy(
    {
      emailField: 'email',
      senhaField: 'senha'
    },
    async (email, senha, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false);
        }

        try {
          const isMatch = await user.validatePassword(senha);

          if (!isMatch) {
            return done(null, false);
          }

          done(null, user);
        } catch (err) {
          done(err);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
