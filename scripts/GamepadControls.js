(async function() {
  let shifterOpen = false;
  await import("https://cdn.jsdelivr.net/gh/alvaromontoro/gamecontroller.js@latest/dist/gamecontroller.min.js");
  gameControl.on("connect", function(gamepad) {
    function animate() {
      requestAnimationFrame(animate);
      pollGamepad();
    }
    function rotateCamera(dx, dy) {
      let x = camera.rotation.x;
      camera.rotateX(-x);
      camera.rotateY(dy);
      if (Math.abs(dx + x) > Math.PI / 2 - 0.05) {
        camera.rotateX(x);
      } else {
        camera.rotateX(x + dx);
      }
      camera.rotation.z = 0;
    }
    function pollGamepad() {
      camera.rotation.order = "YXZ";
      let sensitivity = .04;
      if (!navigator.getGamepads()[0]) return;
      let gamepadIndex = ((new URLSearchParams(location.search).get("gp") || "1") - 0) - 1;
      gamepad = navigator.getGamepads()[gamepadIndex];
      if (!gamepad) return;
      if (gamepad.axes[3] > 0.20) {
        rotateCamera(-gamepad.axes[3] * sensitivity, 0);
      }
      if (gamepad.axes[3] < -0.20) {
        rotateCamera(-gamepad.axes[3] * sensitivity, 0);
      }
      if (gamepad.axes[2] < -0.20) {
        rotateCamera(0, -gamepad.axes[2] * sensitivity);
      }
      if (gamepad.axes[2] > 0.20) {
        rotateCamera(0, -gamepad.axes[2] * sensitivity);
      }
      if (gamepad.axes[1] > 0.20) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      } else {
        document.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowDown" }));
      }
      if (gamepad.axes[0] < -0.20) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      } else {
        document.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowLeft" }));
      }
      if (gamepad.axes[0] > 0.20) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
      } else {
        document.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight" }));
      }
    }
    gamepad.on("button0", () => {}).before("button0", () => {
      if (swal.getState().isOpen) {
        swal.close();
      } else {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
        document.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
      }
    });
    gamepad.on("button2", () => {}).before("button2", () => {
      Object.values(document.querySelector(".shifter").children).forEach(x => {
        if (!x.selected) return;
        shift((!x.nextElementSibling ? document.querySelector(".shifter").children[0] : x.nextElementSibling).textContent.trim().replace('D', 'drive').replace('N', 'neutral').replace('R', 'reverse').replace('S', 'sport').replace('A', 'autopilot'));
        transmission = ((!x.nextElementSibling ? document.querySelector(".shifter").children[0] : x.nextElementSibling).textContent.trim().replace('D', 'drive').replace('N', 'neutral').replace('R', 'reverse').replace('S', 'sport').replace('A', 'autopilot'));
      });
    });
    gamepad.on("button7", () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    }).before("button7", () => {}).after("button7", () => {
      document.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowUp" }));
    });
    gamepad.on("button6", () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
      document.dispatchEvent(new KeyboardEvent("keyup", { key: "b" }));
    });
    gamepad.on("button3", () => {}).before("button3", () => {
      currentCamera == 3 ? (currentCamera = 0, camera.rotation.set(0, 0, 0)) : currentCamera++;
    });
    animate();
  });
})();