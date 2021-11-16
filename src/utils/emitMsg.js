import { post } from './fetch';

export function emitMsg(socket, customData, payload, sessionId) {
    post(process.env.AUTH_URL, {
        userId: customData.user.id,
        userFullName: customData.user.name,
    }).then((response) => {
        customData['token'] = response.accessToken;
        sessionStorage.setItem('TOKEN', response.accessToken);
        socket.emit('user_uttered', {
            message: payload,
            customData,
            session_id: sessionId,
        });
    });
}
