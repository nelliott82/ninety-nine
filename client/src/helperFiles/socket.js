const { io } = require("socket.io-client");

const URL = "http://localhost:99";
const socket = io(URL, { autoConnect: false });

export default socket;