import { post } from './fetch';

function authenticate(customData) {
    if ('token' in customData) {
        return new Promise((resolve, reject) => {
            window.getChatbotAuthenticationToken((data) => {
                if (!data.error) {
                    post(customData.authUrl, {
                        token: data.results,
                    })
                        .then((response) => {
                            customData['accessToken'] = response.accessToken;
                            sessionStorage.setItem('ACCESS_TOKEN', customData['accessToken']);
                            resolve();
                        })
                        .catch((error) => {
                            if ('accessToken' in customData) delete customData['accessToken'];
                            reject();
                        });
                } else {
                    if ('accessToken' in customData) delete customData['accessToken'];
                    reject();
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            post(customData.authUrl, {
                token: customData.token,
            })
                .then((response) => {
                    customData['accessToken'] = response.accessToken;
                    sessionStorage.setItem('ACCESS_TOKEN', customData['accessToken']);
                    resolve();
                })
                .catch((error) => {
                    if ('accessToken' in customData) delete customData['accessToken'];
                    reject();
                });
        });
    }
}
export { authenticate };
