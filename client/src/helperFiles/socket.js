const { io } = require("socket.io-client");
import { getCookie, setCookies } from './cookies.js';


const URL = "http://localhost:99";
const socket = io(URL, { autoConnect: false });

socket.on('connect', () => {
  console.log('socket.id: ', socket.id); // an alphanumeric id...

  //!getCookie('uid') && setCookies([{ name: 'uid', value: socket.id }]);
  setCookies([{ name: 'playerId', value: socket.id }]);
});

export default socket;