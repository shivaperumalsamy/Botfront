import { post } from './fetch';

const AUTH_URL = 'http://localhost:8080/api/authenticate';

export function emitMsg(socket, customData, payload, sessionId) {
    post(AUTH_URL, {
        userId: customData.user.id,
        userFullName: customData.user.name,
    }).then((response) => {
        customData['token'] = response.token;
        sessionStorage.setItem('TOKEN', response.token);
        socket.emit('user_uttered', {
            message: payload,
            customData,
            session_id: sessionId,
        });
    });
}
