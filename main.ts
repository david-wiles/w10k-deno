const server = Deno.listen({port: 8080});

const connections = new Map<String, WebSocket>();

setInterval(() => {
  const now = new Date();
  connections.forEach((socket) => socket.send("the current time is: " + now));
}, parseInt(Deno.env.get("PING_INTERVAL") || "10000"));

for await (const conn of server) {
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
