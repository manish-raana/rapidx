const { Server } = require("socket.io");
//socket import update
const webhookHandler = (req, res) => {
  if (req.method == "POST") {
    //console.log(req.body);
    //console.log(req);
    try {
      
        if (res.socket.server.io) {
          //console.log("Socket is already running");
          res.socket.server.io.emit("alert", req.body);
          res.status(200).json(req.body);
          res.end();
        }   
    } catch (error) {
      res.status(400).json(error);
    }
    
  }
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {

      console.log("connected");
      var count = 0;
      setInterval(() => {
        console.log("connected");
        socket.broadcast.emit("update-input", count);
        count = count + 1;
      }, 2000);
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg);
      });
    });
  } 
};

export default webhookHandler;
