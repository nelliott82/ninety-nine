const { io } = require("socket.io-client");

const URL = "http://localhost:99";
const socket = io(URL, { autoConnect: false });

socket.on('connect', () => {
  console.log('socket.id: ', socket.id); // an alphanumeric id...
});

export default socket;