import React from "react";
import App from "./src/App";

const Game = (props) => {
  React.useEffect(() => {
    const app = new App();
    // component setup
    //==============================================
    app.setup();

    // main loop config
    //==============================================
    var last = 0;
    var dt = 0;
    let ended = false;

    window.requestAnimationFrame(function step(now) {
      if (ended) return;
      dt = Math.min(now - last, 100) * 0.001;
      app.update(dt);
      app.lateUpdate(dt);
      app.render();
      last = now;
      window.requestAnimationFrame(step);
    });

    return () => {
      ended = true;
      app.dispose();
    };
  }, []);
  return null;
};

export default Game;
