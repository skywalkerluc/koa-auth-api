import Joi from 'joi';

module.exports = Joi.object().keys({
  nome: Joi.string()
    .max(254)
    .required()
    .label('Nome'),
  email: Joi.string()
    .email()
    .required()
    .label('Email'),
  senha: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/)
    .options({
      language: {
        string: {
          regex: {
            base:
              'must have at least one lowercase letter, one uppercase letter, one digit and one special character.'
          }
        }
      }
    })
    .label('Senha'),
  telefones: Joi.array().items({
    ddd: Joi.string()
      .length(2)
      .required(),
    numero: Joi.string()
      .regex(/^[0-9]{7,10}$/)
      .options({
        language: {
          string: {
            regex: {
              base: 'must have a valid format'
            }
          }
        }
      })
      .required()
  }),
  CEP: Joi.string()
    .regex(/^[0-9]{8}$/)
    .required()
    .options({
      language: {
        string: {
          regex: {
            base: 'must have the format XXXXXXXX'
          }
        }
      }
    })
});
