/* eslint-disable consistent-return */
import Joi from 'joi';
import UserModel from '../../models/user';
import * as geocode from '../../utils/geocode';

const userSchema = require('../../schemas/user');

export async function createUser(ctx) {
  let userPayload;
  try {
    await Joi.validate(ctx.request.body, userSchema, { abortEarly: false });

    userPayload = new UserModel(ctx.request.body);
    const { lat, lng } = await geocode.obtainCoordinates(userPayload.CEP);
    userPayload.geolocation.coordinates = [lat, lng];

    userPayload.token = userPayload.generateToken();
    await userPayload.save();
  } catch (err) {
    ctx.throw(422, err.message);
  }

  const response = userPayload.toJSON();

  delete response.senha;

  ctx.body = {
    response
  };
}

export async function getUser(ctx, next) {
  try {
    const usuarioBusca = await UserModel.findById(ctx.params.id, '-senha');
    if (!usuarioBusca) {
      ctx.throw(404);
    }

    ctx.body = {
      usuarioBusca
    };
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404);
    }

    ctx.throw(500);
  }

  if (next) {
    return next();
  }
}
