import { io } from 'socket.io-client';

// Make sure to use the correct URL for your environment
const URL = 'http://localhost:3001';

export const socket = io(URL);
