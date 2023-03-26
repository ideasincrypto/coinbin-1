const { WebSocketServer } = require("ws");
const http = require("http");
const { app } = require("./app");
const {
  eventEmmiter,
  intervalFunc
} = require("./component/priceController");

const server = http.createServer(app);

const wss = new WebSocketServer({
  noServer: true,
  path: "/diff",
  clientTracking: false,
});

const clients = new Set();

function diffListener(rowsInfo) {
  clients.forEach(function (client) {
    client.send(rowsInfo);
  });
}
let getOrderInterval
server.on("upgrade", function (req, socket, head) {
  if (clients.size == 0) {
    getOrderInterval = intervalFunc() // This function will be execute once 
  }
  wss.handleUpgrade(req, socket, head, async function (ws) {
    clients.add(ws);
    const clientSize = Object.assign({},{size:clients.size})
    diffListener(JSON.stringify(clientSize))
    console.log("clients:", clientSize);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", async function connection(ws, req) {

  eventEmmiter.on("diff", diffListener);

  ws.on("close", () => {
    clients.delete(ws);
    eventEmmiter.removeListener("diff", diffListener);
    console.log("clients.size;",clients.size);
    if (clients.size == 0) {
      clearInterval(getOrderInterval)
    }
 
    console.log("Client disconnected")
  });
  ws.on("error", function () {
    console.log("Some Error occurred");
  });
});

module.exports = { server };
