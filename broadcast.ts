// Create map to store websocket connections
const connections = new Map<string, WebSocket>();

// Broadcast to connections at a pre-defined interval
setInterval(() => {
  const now = new Date();
  connections.forEach((socket) => socket.send("the current time is: " + now));
}, parseInt(Deno.env.get("PING_INTERVAL") || "10000"));

for await (const conn of Deno.listen({port: 8080})) {
  // Handle websocket upgrade asynchronously, don't do anything with the result here
  upgradeWebsocket(conn)
}

async function upgradeWebsocket(conn: Deno.Conn) {
  for await (const ev of Deno.serveHttp(conn)) {
    const {socket, response} = Deno.upgradeWebSocket(ev.request);
    const uuid = crypto.randomUUID();

    socket.onopen = () => {
      console.log("adding connection ", uuid);
      connections.set(uuid, socket);
    };

    socket.onclose = () => {
      console.log("removing connection ", uuid);
      connections.delete(uuid);
    };

    socket.onmessage = (msg) => {
      console.log("new message", uuid, msg.data);
    };

    ev.respondWith(response);
  }
}
