import { post } from './fetch';
import { ACCESS_TOKEN_NAME } from 'constants';

function authenticate(customData) {
  if ('authRequired' in customData && !customData.authRequired) {
    return Promise.resolve();
  }
  if ('username' in customData && 'password' in customData) {
    return new Promise((resolve, reject) => {
      post(customData.authUrl, {
        username: customData.username,
        password: customData.password,
      })
        .then((response) => {
          sessionStorage.setItem(ACCESS_TOKEN_NAME, response.accessToken);
          resolve();
        })
        .catch((error) => {
          if (sessionStorage.getItem(ACCESS_TOKEN_NAME))
            sessionStorage.removeItem(ACCESS_TOKEN_NAME);
          reject();
        });
    });
  }
  if ('token' in customData) {
    return new Promise((resolve, reject) => {
      post(customData.authUrl, {
        token: customData.token,
        dev: true,
      })
        .then((response) => {
          sessionStorage.setItem(ACCESS_TOKEN_NAME, response.accessToken);
          resolve();
        })
        .catch((error) => {
          if (sessionStorage.getItem(ACCESS_TOKEN_NAME))
            sessionStorage.removeItem(ACCESS_TOKEN_NAME);
          reject();
        });
    });
  }
  return new Promise((resolve, reject) => {
    window.getChatbotAuthenticationToken((data) => {
      if (!data.error) {
        post(customData.authUrl, {
          token: data.results,
        })
          .then((response) => {
            sessionStorage.setItem(ACCESS_TOKEN_NAME, response.accessToken);
            resolve();
          })
          .catch((error) => {
            if (sessionStorage.getItem(ACCESS_TOKEN_NAME))
              sessionStorage.removeItem(ACCESS_TOKEN_NAME);
            reject();
          });
      } else {
        if (sessionStorage.getItem(ACCESS_TOKEN_NAME)) sessionStorage.removeItem(ACCESS_TOKEN_NAME);
        reject();
      }
    });
  });
}

export { authenticate };
