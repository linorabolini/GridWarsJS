const Entity = require("entity"),
    input = require("input"),
    KeyboardController = require("keyboard"),
    server = require("server"),
    LevelScreen = require("levelScreen");

class App extends Entity {
    constructor() {
        this.screen = null;
        super();
    }

    setup() {
        server.setup();
        this.startApp();

        // add keyboard source
        // input.addSource(new KeyboardController({
        //     '74': 'ARROW_LEFT',
        //     '76': 'ARROW_RIGHT',
        //     '75': 'ARROW_DOWN',
        //     '73': 'ARROW_UP',
        //     '80': 'BUTTON_A'
        // }));

        // add keyboard source
        input.addSource(
            new KeyboardController({
                65: "ARROW_LEFT",
                68: "ARROW_RIGHT",
                83: "ARROW_DOWN",
                87: "ARROW_UP",
                71: "ARROW_2_DOWN",
                70: "ARROW_2_LEFT",
                72: "ARROW_2_RIGHT",
                84: "ARROW_2_UP",
            })
        );
    }

    startApp() {
        var screen = new LevelScreen();
        this.setScreen(screen);
    }

    setScreen(newScreen) {
        if (this.screen) {
            this.removeChild(this.screen).dispose();
        }

        this.screen = newScreen;
        this.addChild(this.screen);
    }
}

export default App;
