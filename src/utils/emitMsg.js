import { post } from './fetch';

const testToken =
    'QBqa5nInszTruDUQayoEokoF08jW%2FnK6YhM55BahiyQRO2NkM6oSlvIBC%2Bio6iCznxH11lucohTirWN4FbU6PeYqOIRd4PNeDXuhk%2FXNDpN4C1o9p88saGEu%2BctB%2Bhh6Fjdgw60AyudMD8Kl45JUNR%2BCOMIfyyJ4yIOBqCcuGtlSXyw2kjM2NfH48TIEQVEh05POk7Z3IMHaDOHiSWs05pqVJxPVL2Sq5FX4jZ97hZ3XFwzEd9gHJn5d0v3nfFShZPqCcIk6grKmr%2Bbc8f6M8rtwflpptJ9OhIZS6%2BpycNpSqfmDom4VhlE0xAQrpFdW';

export function emitMsg(socket, customData, payload, sessionId) {
    if (customData.auth.url.length > 0) {
        post(customData.auth.url, {
            userId: customData.auth.parameters.userId,
            userName: customData.auth.parameters.userName,
        }).then((response) => {
            customData.auth['token'] = response.token || testToken;
            socket.emit('user_uttered', {
                message: payload,
                customData,
                session_id: sessionId,
            });
        });
    } else {
        customData.auth['token'] = testToken;
        socket.emit('user_uttered', {
            message: payload,
            customData,
            session_id: sessionId,
        });
    }
}
