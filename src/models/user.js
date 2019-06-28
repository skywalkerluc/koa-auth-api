/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: { type: String, required: true },
  telefones: [
    {
      ddd: { type: String, required: true },
      numero: { type: String, required: true }
    }
  ],
  CEP: { type: String, required: true },
  geolocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] }
  },
  data_criacao: { type: Date, default: Date.now },
  data_atualizacao: { type: Date, default: Date.now },
  ultimo_login: { type: Date, default: Date.now },
  token: { type: String }
});

userSchema.pre('save', function preSave(next) {
  const user = this;

  if (!user.isModified('senha')) {
    return next();
  }

  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      resolve(salt);
    });
  })
    .then(salt => {
      bcrypt.hash(user.senha, salt, (err, hash) => {
        if (err) {
          throw new Error(err);
        }

        user.senha = hash;

        next(null);
      });
    })
    .catch(err => next(err));
});

userSchema.methods.validatePassword = function validatePassword(senha) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(senha, user.senha, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      resolve(isMatch);
    });
  });
};

userSchema.methods.generateToken = function generateToken() {
  const user = this;

  return jwt.sign({ id: user.id }, config.token);
};

const User = mongoose.model('User', userSchema);

export default User;
