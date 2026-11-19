import { endpoint } from "./configs";
import { io } from 'socket.io-client';

const socket = io(endpoint, {
    transports: ['websocket'],
    jsonp: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 700,
    reconnectionDelayMax: 700,
    timeout: 2000,
    autoConnect: true
});

export const webSocket = socket