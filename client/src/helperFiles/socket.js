const { io } = require("socket.io-client");
import { getCookie, setCookies } from './cookies.js';


const URL = `http://${window.location.host}`;
const socket = io(URL, { autoConnect: false });

socket.on('connect', () => {
  //!getCookie('uid') && setCookies([{ name: 'uid', value: socket.id }]);
  setCookies([{ name: 'playerId', value: socket.id }], false);
});

export default socket;