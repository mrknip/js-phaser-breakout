var mainState = function(game) {
  this.paddleSprite;

  this.paddleLeftKey;
  this.paddleRightKey;

  this.blockGroup;

  this.score;
  this.lives;
  this.brickCount;

  this.scoreDisplay;
  this.livesDisplay;
}



mainState.prototype = {
  // ========================
  // Game loop
  // =======================
  preload: function () {
    game.load.image(imageAssets.paddleName, imageAssets.paddleURL);
    game.load.image(imageAssets.ballName, imageAssets.ballURL);
    
    gameProperties.blockRows.forEach(function(colour){
      game.load.image(imageAssets.blockName[colour], imageAssets.blockURL[colour])
    });
  },

  create: function () {
    this.initGraphics();
    this.initControls();
    this.initPhysics();

    this.startDemo();
  },

  update: function () {
    this.movePaddle();

    game.physics.arcade.collide(this.ball, this.paddleSprite, this.ballPaddleCollide, null, this);
    game.physics.arcade.collide(this.ball, this.blockGroup, this.ballblockCollide, this.checkOrange, this);

    if (this.ball.y < 50 && this.ball.topped == false) {
      this.updateModifiers('top');
    }
  },

  // ==========================
  // Init functions
  // ==========================

  initGraphics: function () {
    this.paddleSprite = game.add.sprite(game.world.centerX, game.world.height - gameProperties.paddleHeight, imageAssets.paddleName);
    this.paddleSprite.anchor.set(0.5, 0.5);

    this.ball = game.add.sprite(game.world.centerX, 400, imageAssets.ballName);
    this.ball.anchor.set(0.5, 0.5);

    this.blockGroup = game.add.group();

    this.scoreDisplay = game.add.text(gameProperties.scoreDisplayX, gameProperties.scoreDisplayY, "0", gameProperties.numberDisplayStyle);
    this.scoreDisplay.anchor.set(0, 0.5);

    this.livesDisplay = game.add.text(gameProperties.livesDisplayX, gameProperties.livesDisplayY, "5", gameProperties.numberDisplayStyle);
    this.livesDisplay.anchor.set(1, 0.5);
  },

  initPhysics: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.physics.arcade.enable(this.paddleSprite);

    this.paddleSprite.body.immovable = true;
    this.paddleSprite.body.collideWorldBounds = true;

    game.physics.arcade.enable(this.ball);

    this.ball.body.bounce.set(1, 1);
    this.ball.body.collideWorldBounds = true;
    this.ball.checkWorldBounds = true;
    this.ball.visible = false;
    this.ball.events.onOutOfBounds.add(this.ballOutOfBounds, this);

    this.blockGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.blockGroup.enableBody = true; 
  },

  initControls: function () {
    this.paddleLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.paddleRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  },

  // =========================
  // Controller functions
  // =========================

  movePaddle: function () {
    if (this.paddleLeftKey.isDown) 
    {
      this.paddleSprite.body.velocity.x = -gameProperties.paddleSpeed;
    } 
    else if (this.paddleRightKey.isDown) 
    {
      this.paddleSprite.body.velocity.x = gameProperties.paddleSpeed;
    } else {
      this.paddleSprite.body.velocity.x = 0;
    }
  },

  // ===========================
  // Setup coordinator functions
  // ===========================

  startDemo: function () {
    this.enablePit(false);
    this.enablePaddle(false);
    this.game.input.onDown.add(this.startGame, this);
  },

  startGame: function () {
    this.game.input.onDown.remove(this.startGame, this);

    this.enablePaddle(true);
    this.enablePit(true);

    this.addBlocks();
    
    this.resetScore();
    this.reset();
  },

  startNextRound: function () {
    this.addBlocks();

    this.ball.visible = false;
    this.ball.body.enable = false;
    game.time.events.add(Phaser.Timer.SECOND, this.startBall, this);
  },

  // ==========================
  // Setup functions
  // ==========================

  addBlocks: function () {
    this.brickCount = 0;
    var rowHeight = gameProperties.blockBase,
        numBlocks = Math.floor(gameProperties.gameWidth / gameProperties.blockWidth);

    for (var i = gameProperties.blockRows.length - 1; i >= 0; i--) {
      for (var j = 0; j < numBlocks; j++) {
        var b = game.add.sprite((j * gameProperties.blockWidth), rowHeight, imageAssets.blockName[gameProperties.blockRows[i]])
        this.blockGroup.add(b);
        b.body.immovable = true;
        b.colour = gameProperties.blockRows[i];
        this.brickCount++
      }
      rowHeight -=15;

        for (var j = 0; j < numBlocks; j++) {
          var b = game.add.sprite((j * gameProperties.blockWidth), rowHeight, imageAssets.blockName[gameProperties.blockRows[i]])
          this.blockGroup.add(b);
          b.body.immovable = true;
          b.colour = gameProperties.blockRows[i];
          this.brickCount++
        }
        rowHeight -=15;
    }

    this.blockGroup.setAll('body.immovable', true);
  },


  resetScore: function () {
    this.score = 0;
    this.lives = 5;
  },

  reset: function () {
    this.ball.oranged = false;
    this.ball.topped = false;
    this.ball.speed = gameProperties.ballSpeed;
    this.ball.bounces = 0;

    this.paddleSprite.scale.x = 1;

    game.time.events.add(Phaser.Timer.SECOND * 1.5, this.startBall, this)
  },

  startBall: function () {  
    this.ball.reset(game.rnd.between(50, 350), 300);
    this.ball.visible = true;
    this.ball.body.enable = true;

    game.physics.arcade.velocityFromAngle(game.rnd.pick(gameProperties.ballAngles), 
                                          this.ball.speed,
                                          this.ball.body.velocity);
  },

  enablePit: function(bool) {
    game.physics.arcade.checkCollision.down = !bool;
  },

  enablePaddle: function (bool) {
    this.paddleSprite.visible = bool;
    this.paddleSprite.body.enable = bool;
  },

  // ==========================
  // Collision logic
  // ==========================
  

  ballPaddleCollide: function (ball, paddle) {
    var returnAngle;
    var contactSegment = Math.floor((ball.x - paddle.x)/gameProperties.paddleSegWidth)
    
    this.updateBounces();
    
    if (contactSegment > (gameProperties.paddleSegments/2)) {
      contactSegment = (gameProperties.paddleSegments/2)
    } else if (contactSegment < -(gameProperties.paddleSegments/2)) {
      contactSegment = -(gameProperties.paddleSegments/2)
    } else if (contactSegment == 0) {
      contactSegment = 1;
    }

    returnAngle = (Math.abs(contactSegment) * gameProperties.paddleAngleMultiplier)

    if (contactSegment < 0) {
      returnAngle -= 110;
    } else if (contactSegment > 0) {
      returnAngle = -(70 - Math.abs(returnAngle));
    }

    game.physics.arcade.velocityFromAngle(returnAngle, this.ball.speed, this.ball.body.velocity);
  },

  ballOutOfBounds: function () {
    console.log('out!')
    this.lives--
    this.updateLives();

    if (this.lives == 0) {
      this.ball.kill();
      this.startDemo();
    } else { 
      this.reset();
    }
  },

  ballblockCollide: function (ball, block) {
    block.kill();
    this.brickCount--
    this.updateScore(block.colour);
    if (block.colour == 'orange') {
      this.ball.body.bounce.set(1);
    }

    if (this.brickCount == 0) {
      game.time.events.add(Phaser.Timer.SECOND * 0.5, this.startNextRound, this)    }
  },

  checkOrange: function (ball, block) {
    if (block.colour == 'orange' && !this.ball.oranged) {
      this.updateModifiers('orange');
    }
  },

  // ==========================
  // Game status update functions
  // ==========================
  
  updateBounces: function () {
    this.ball.bounces++
    if (this.ball.bounces == 4 || this.ball.bounces == 12) { 
      this.updateModifiers('bounce');
    }
  },

  updateScore: function (colour) {
    this.score += gameProperties.scores[colour];
    this.scoreDisplay.setText(this.score);
  },

  updateLives: function () {
    this.livesDisplay.setText(this.lives);
  },

  updateModifiers: function (modifier) {
    switch (modifier) {
      case 'bounce':
        this.ball.speed += 100;
        break;
      case 'orange':
        this.ball.oranged = true;
        this.ball.body.bounce.set(1.25, 1.25); // Hacky to try and get in before the arcade physics engine calculates velocity - setting speed directly doesn't work.
        break;
      case 'top':
        this.ball.topped = true;
        this.ball.speed += 25;
        this.paddleSprite.scale.x = 0.6;
        break;
    }
  }

};

// Runner
var game = new Phaser.Game(gameProperties.gameWidth, gameProperties.gameHeight, Phaser.AUTO, 'gameDiv')
game.state.add('main', mainState);
game.state.start('main');