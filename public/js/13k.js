var canvas,
surface,
myScr;

var mouse; // simple helper for capturing the mouse's state

function beginLoop() {
  var frameId = 0;
  var lastFrame = Date.now();

  function loop() {
    var thisFrame = Date.now();

    var interval = thisFrame - lastFrame;

    frameId = window.requestAnimationFrame(loop);

    myScr.update(interval);
    myScr.draw(surface);

    lastFrame = thisFrame;
  }

  loop();
}


canvas = document.querySelector('#board');
canvas.setAttribute('width', 600);
canvas.setAttribute('height', 300);

surface = canvas.getContext('2d');

mouse = (function (target) {
  var isButtonDown = false;

  target.addEventListener('mousedown', function () {
    isButtonDown = true;
  });
  target.addEventListener('mouseup', function () {
    isButtonDown = false;
  });

  return {
    isButtonDown: function () {
      return isButtonDown;
    }
  };
}(document));

// define the start screen
myScr = (function (input) {

  var hue = 0;
  var direction = 1;
  var transitioning = false;
  var wasButtonDown = false;
  var title = 'Tula';

  function centerText(ctx, text, y) {
    var textSize = ctx.measureText(text);
    var x = (ctx.canvas.width - textSize.width) / 2;
    ctx.fillText(text, x, y);
  }

  function draw(ctx, elapsed) {

    var y = ctx.canvas.height / 2;
    var color = 'rgb(' + hue + ',0,0)';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px monospace';
    centerText(ctx, title, y);

    ctx.fillStyle = color;
    ctx.font = '24px monospace';
    centerText(ctx, "Let's the adventure begin", y + 30);
  }

  function update() {

    hue += 1 * direction;
    if (hue > 255) direction = -1;
    if (hue < 1) direction = 1;

    var isButtonDown = input.isButtonDown();
    var mouseJustClicked = !isButtonDown && wasButtonDown;
    if (mouseJustClicked && !transitioning) {
      transitioning = true;
      // do something here to transition to the actual game
      title = 'A SCOR Game';
    }

    wasButtonDown = isButtonDown;
  }

  return {
    draw: draw,
    update: update
  };
}(mouse));


beginLoop();