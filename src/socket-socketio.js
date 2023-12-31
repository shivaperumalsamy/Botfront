import io from 'socket.io-client';
import { getAnalyticsData } from './utils/analytics';
import { authenticate } from './utils/authentication';

export default function (socketUrl, customData, path) {
    const options = path ? { path } : {};
    const socket = io(socketUrl, options);
    socket.on('connect', () => {});

    socket.on('connect_error', (error) => {
        console.log(error);
    });

    socket.on('disconnect', (reason) => {
        console.log(reason);
    });

    return socket;
}
