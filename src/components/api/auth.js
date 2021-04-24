import axios from 'axios';
import AuthProgress from 'screens/Login/authProgress';
import { BASE_URL, DEBUGGING } from 'constants.js';

const errorStatuses = [301, 422, 500];

axios.interceptors.response.use(
  (response) => {
    if (errorStatuses.includes(response.status))
      return Promise.reject(response);
    return response;
  },
  (error) => {
    if (DEBUGGING) console.log(error);
    return Promise.reject(error);
  }
);

export const submitIdentity = (usernameOrEmail, onProgress) => {
  // Submit username or email and change auth progress according to whether
  // it exists.
  axios
    .post(`${BASE_URL}/auth/check`, { usernameOrEmail })
    .then((response) => {
      if (response.status === 200) {
        onProgress(AuthProgress.LOGIN);
      } else throw new Error(`Unexpected response: ${response.status}!`);
    })
    .catch((error) => {
      if (error.response?.status === 500) {
        console.log('got response with status 500');
        onProgress(AuthProgress.SIGNUP);
      }
    });
};

export const submitLogin = (
  usernameOrEmail,
  password,
  onSuccess,
  onFailure
) => {
  axios
    // Submit username and password
    .post(`${BASE_URL}/auth/login`, { usernameOrEmail, password })
    // If correct, redirect using onSuccess
    .then((response) => {
      if (response.status === 200) onSuccess();
      else throw new Error(`Unexpected response: ${response.status}!`);
    })
    // Report error
    .catch((error) => {
      if (error.response?.status === 401) onFailure();
      else throw error;
    });
};

export const submitSignup = (newUser, onSuccess, onFailure) => {
  axios
    // Submit new user data
    .post(`${BASE_URL}/auth/signup`, {
      email: newUser.email,
      username: newUser.username,
      password: newUser.password,
    })
    // If successfully signed up, redirect using onSuccess
    .then((response) => {
      if (response.status === 200) onSuccess();
      else throw new Error(`Unexpected response: ${response.status}!`);
    })
    // Report error
    .catch((error) => {
      if (error.response?.status === 401) onFailure();
      else throw error;
    });
};
