const { Server } = require("socket.io");
import { transferFunds } from './adminTransfer'
const SocketHandler = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method == "POST") {
    //console.log(req.body);
   // transferFunds(req.body);
    if (req.body && req.body.isSocketConn)
    { 
      console.log('connected....')
    }else{
      if (res.socket.server.io)
      {
        //console.log("Socket is already running");
        res.socket.server.io.emit("alert", req.body);
      }
    }
     
    res.status(200).json(req.body);
  }
  if (res.socket.server.io) {
    //console.log("Socket is already running");
  } else {
    //console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      transports: ["websocket"],
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("ping", (msg) => {
        io.emit("pong", 'pong...');
      });
    });
  }
  res.end();
};

export default SocketHandler;
