/* eslint-disable consistent-return */
import * as axios from 'axios';
import config from '../../config';

const geolocatioUrl = [config.geolocation_url][0];
const apiKey = [config.geolocation_apikey][0];

const getCoordinatesByPostalCode = cep => {
  try {
    return axios.get(geolocatioUrl, {
      params: {
        address: cep,
        key: apiKey
      }
    });
  } catch (error) {
    throw new { message: 'Erro na API de Geolocalização' }();
  }
};

export default async function obtainCoordinates(cep) {
  return getCoordinatesByPostalCode(cep)
    .then(response => {
      const data = response.data.results[0];
      return {
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng
      };
    })
    .catch(() => {
      throw new { message: 'CEP inválido!' }();
    });
}
