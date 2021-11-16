import { post } from './fetch';

export function emitMsg(socket, customData, payload, sessionId) {
    post(customData.authUrl, {
        userId: customData.user.id,
        userFullName: customData.user.name,
    }).then((response) => {
        customData['accessToken'] = response.accessToken;
        sessionStorage.setItem('ACCESS_TOKEN', customData['accessToken']);
        socket.emit('user_uttered', {
            message: payload,
            customData,
            session_id: sessionId,
        });
    });
}
