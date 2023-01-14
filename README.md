# W10k Challenge (Deno)

This is a simple web server to see if we can handle 10k concurrent websocket connections, and what limits the server
would have in different situations. 

## Broadcast

The server only does a couple things:

* Prints messages it receives
* Sends the current time to all websockets at the interval defined by `PING_INTERVAL`

## Client2Client

This server forwards messages from client to another using a uuid in the message text.


[k6](https://k6.io/docs/) is a good tool for load testing servers with virtual users. See
[w10k-k6-clients](https://github.com/david-wiles/w10k-k6-clients) for the test files.

The project can be deployed to a DigitalOcean droplet using `terraform apply` in the tf/ directory.
