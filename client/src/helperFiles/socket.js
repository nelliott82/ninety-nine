const { io } = require("socket.io-client");
import { getCookie, setCookies } from './cookies.js';


const URL = `${window.location.protocol}//${window.location.host}`;
const socket = io(URL, { autoConnect: false });
console.log('location host: ', window.location.host)

socket.on('connect', () => {
  //!getCookie('uid') && setCookies([{ name: 'uid', value: socket.id }]);
  console.log(window.location.host)
  setCookies([{ name: 'playerId', value: socket.id }], false);
});

export default socket;