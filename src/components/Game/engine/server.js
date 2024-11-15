import io from "./io";
import input from "./input";
import debug from "./debug";
import MobileController from "./inputs/mobile";

var config = {
    name: "server",
    host: "http://localhost:3000",
    options: {
        reconnection: false,
    },
};

class Server {
    constructor() {
        this.socket = null;
    }

    setup() {
        // if io is undefined then the server is
        // not configured or unavailable
        if (!io) {
            return;
        }

        // we configure the socket and conect it
        // to the host that was setup in the
        // config
        var socket = io(config.host, config.options);
        socket.on("connection", function () {
            // we request to register this socket as a server
            socket.emit("register as server", config.name);

            // if the request was successful, we handle the
            // registration as a server here and configure the
            // callbacks
            socket.on("registered as server", function () {
                // we handle the client connection and create a
                // new input source
                socket.on("client connection", function (source) {
                    debug("client " + source.id + " connected");
                    input.addSource(new MobileController(source));
                });

                // we also listen to messages from the server
                // the message id is the socket id that sent
                // the message to the server
                socket.on("message", function (msg) {
                    debug("message from " + msg.id);
                    input.getSource(msg.id).emit(msg);
                });
            });
        });

        // we store the socket
        this.socket = socket;
    }
}

export default new Server();
