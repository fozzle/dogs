(function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var spawnChance = 0.05;
  var imageCount = 66;
  var dogs = [];
  var dancer = new Dancer();
  var audio = new Audio();
  audio.src = 'mario.mp3';
  dancer.load(audio);

  function initialize() {
    // Register an event listener to
    // call the resizeCanvas() function each time
    // the window is resized.
    window.addEventListener('resize', resizeCanvas, false);

    // Draw canvas border for the first time.
    resizeCanvas();
    window.addEventListener('keypress', pause, false);
    setInterval(tick, 1000/ 70);
    dancer.createKick({
      frequency: [0, 10],
      threshold: 0.1,
      onKick: function() {
        dogs.push(dog());
      }
    }).on();
    dancer.play();
  }

  function pause() {
    if (dancer.isPlaying()) {
      dancer.pause();
    } else {
      dancer.play();
    }

  }

  function redraw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for (var i in dogs) {
      dogs[i].draw();
    }
  }

  function update() {
    // if (Math.random() < spawnChance) {
    //
    // }

    for (var i in dogs) {
      dogs[i].update();
    }

    dogs = dogs.filter(function(dog) {
      return dog.y < window.innerHeight + dog.image.height;
    });
  }

  function tick() {
    update();
    redraw();
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw();
  }

  function roundedImage(x,y,width,height,radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Make a new dog
  function dog() {
    console.log("woof");
    var newDog = {
      x: Math.random() * canvas.width,
      y: 0,
      loaded: false,
      draw: function() {
        if (this.loaded) {
          var minDimension = Math.min(this.image.height, this.image.width);
          var destinationX = this.x - this.image.width/2;
          var destinationY = this.y - this.image.height;
          ctx.save();
          ctx.beginPath();
          ctx.arc(this.x, this.y - this.image.height/2, minDimension/2, 0, Math.PI * 2, true); // Clip circle
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(this.image, destinationX, destinationY);
          ctx.restore();
        }
      },
      update: function() {
        if (this.loaded) {
          this.y+=2;
        }
      }
    };

    // Setup image
    var img = new Image();
    img.src = 'images/' + Math.floor(Math.random() * (imageCount) + 1) + '.jpg';
    img.addEventListener("load", (function() {
      this.loaded = true;
    }).bind(newDog));

    newDog.image = img;
    return newDog;
  }

  initialize();
})();
