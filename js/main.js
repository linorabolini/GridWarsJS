// define("io", [], function (config) {
//     try {
//         return io;
//     } catch (e) {
//         return false;
//     }
// });

// define("config", [], function () {
//     return {
//         server: {
//             name: "server",
//             host: "http://localhost:3000",
//             options: {
//                 reconnection: false,
//             },
//         },
//         debug: true,
//     };
// });

const App = require("./src/App");
const app = new App();
// component setup
//==============================================
app.setup();

// main loop config
//==============================================
var last = 0;
var dt = 0;
function step(now) {
    dt = Math.min(now - last, 100) * 0.001;
    app.update(dt);
    app.lateUpdate(dt);
    app.render();
    last = now;
    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
