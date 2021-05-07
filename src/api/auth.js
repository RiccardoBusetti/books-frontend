import axios from 'axios';
import { BASE_URL, failureWith, successWith } from './base';

export const checkIdentity = (
  onSuccess,
  onFailure,
  cancelToken,
  usernameOrEmail
) => {
  axios
    .post(`${BASE_URL}/auth/check`, { usernameOrEmail })
    .then(successWith(onSuccess, onFailure, 200))
    .catch(failureWith(onFailure, 422));
};

export const signup = (onSuccess, onFailure, cancelToken, newUser) => {
  axios
    .post(`${BASE_URL}/auth/signup`, {
      email: newUser.email,
      username: newUser.username,
      password: newUser.password,
    })
    .then(successWith(onSuccess, onFailure, 200))
    .catch(failureWith(onFailure, 422));
};

export const login = (
  onSuccess,
  onFailure,
  cancelToken,
  usernameOrEmail,
  password
) => {
  axios
    .post(`${BASE_URL}/auth/login`, {
      usernameOrEmail,
      password,
    })
    .then(successWith(onSuccess, onFailure, 200))
    .catch(failureWith(onFailure, 401, 422));
};
