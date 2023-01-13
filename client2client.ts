// Create map to store websocket connections
const connections = new Map<string, WebSocket>();

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

    // When the websocket receives a message, attempt to parse it and send to another
    // websocket with the corresponding uuid
    socket.onmessage = (msg) => {
      if (typeof msg.data === 'string') {
        if (msg.data.length > 36) {
          const dest = connections.get(msg.data.substring(0, 36));
          if (dest) {
            dest.send(msg.data.substring(36));
          }
        }
      }
    };

    ev.respondWith(response);
  }
}
