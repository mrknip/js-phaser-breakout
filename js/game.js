function debugOn () {
 if (location.href.match(/debug/)) {return true};
 return false;
}
if (debugOn()) {console.log('debug mode')}

console.log(debugOn())

var mainState = function(game) {
  this.paddleSprite;

  this.paddleLeftKey;
  this.paddleRightKey;

  this.paddleHitSound;

  this.blockGroup;

  this.score;
  this.lives;
  this.blockCount;

  this.scoreDisplay;
  this.livesDisplay;
  this.messageDisplay;

  this.ballCountdown;
}

mainState.prototype = {

  // ========================
  // Game setup and loop
  // =======================
  preload: function () {
    game.load.image(imageAssets.paddleName, imageAssets.paddleURL);
    game.load.image(imageAssets.ballName, imageAssets.ballURL);
    
    game.load.audio(audioAssets.paddleHitName, audioAssets.paddleHitURL);
    game.load.audio(audioAssets.smashOneName, audioAssets.smashOneURL);
    game.load.audio(audioAssets.smashTwoName, audioAssets.smashTwoURL);
    game.load.audio(audioAssets.smashThreeName, audioAssets.smashThreeURL);

    gameProperties.blockRows.forEach(function(colour){
      game.load.image(imageAssets.blockName[colour], imageAssets.blockURL[colour])
    });
  },

  create: function () {
    this.initGraphics();
    this.initControls();
    this.initPhysics();
    this.initAudio();
    this.initText();
    this.initEvents();

    this.startWaitScreen();
  },

  update: function () {
    this.movePaddle();

    this.checkCollisions();


    if (this.ballCountdown.running) {
      this.messageDisplay.setText(Math.ceil(3 - this.ballCountdown.seconds));
    }
  },

  checkCollisions: function () {
    game.physics.arcade.collide(this.ball, this.paddleSprite, this.ballPaddleCollide, null, this);
    game.physics.arcade.collide(this.ball, this.blockGroup, this.ballblockCollide, this.checkOrange, this);

    if (this.ball.top == 0 && this.ball.topped == false) {
      this.hitTop.dispatch();
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
  },

  initText: function () {
    this.scoreDisplay = game.add.text(gameProperties.scoreDisplayX, gameProperties.scoreDisplayY, "0", gameProperties.numberDisplayStyle);
    this.scoreDisplay.anchor.set(0, 0.5);

    this.livesDisplay = game.add.text(gameProperties.livesDisplayX, gameProperties.livesDisplayY, gameProperties.lives, gameProperties.numberDisplayStyle);
    this.livesDisplay.anchor.set(1, 0.5);

    this.messageDisplay = game.add.text(game.world.centerX, game.world.centerY, "Click to start", gameProperties.numberDisplayStyle);
    this.messageDisplay.anchor.set(0.5, 0);

    this.ballCountdown = game.time.create(false);
  },

  initAudio: function () {
    this.paddleHitSound = game.add.audio(audioAssets.paddleHitName);
    this.smashOne = game.add.audio(audioAssets.smashOneName);
    this.smashTwo = game.add.audio(audioAssets.smashTwoName);
    this.smashThree = game.add.audio(audioAssets.smashThreeName);

    this.smashes = [this.smashOne, this.smashTwo, this.smashThree];
  },

  initPhysics: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.physics.arcade.enable(this.paddleSprite);

    this.paddleSprite.body.immovable = true;
    this.paddleSprite.body.collideWorldBounds = true;

    game.physics.arcade.enable(this.ball);

    this.ball.body.bounce.set(1, 1);
    this.ball.body.collideWorldBounds = true;
    this.ball.body.enable = false;
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

  initEvents: function () {
    this.hitOrange = new Phaser.Signal()
    this.hitOrange.add(this.onHitOrange, this)

    this.reachBounceLevel = new Phaser.Signal()
    this.reachBounceLevel.add(this.onBounceLevel, this)

    this.hitTop = new Phaser.Signal()
    this.hitTop.add(this.onHitTop, this)
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

  startWaitScreen: function () {
    this.messageDisplay.visible = true;
    this.enablePit(false);
    this.enablePaddle(false);
    
    this.game.input.onDown.add(this.startGame, this);
  },

  startGame: function () {
    this.game.input.onDown.remove(this.startGame, this);
    this.messageDisplay.visible = false;
    
    this.enablePaddle(true);
    this.enablePit(true);

    this.addBlocks();
    
    this.resetScore();
    this.resetBall();

    this.startBallCountdown();
  },

  startNextRound: function () {
    this.addBlocks();

    this.enableBall(false);
    this.resetBall();

    game.time.events.add(Phaser.Timer.SECOND, this.startBallCountdown, this);
  },

  showGameOver: function () {
    this.ball.kill();

    this.messageDisplay.setText("Game over");
    this.messageDisplay.visible = true;
    
    setTimeout(function(){
      game.state.start('menu');
    }, 3000);
  },

  // ==========================
  // Setup functions
  // ==========================

  loadLevelFromSchema: function (schema, key) {
    for (var i = 0; i < schema.length; i++) {
      for (var j = 0; j < schema[0].length; j++) {
        if (schema[i][j] === " " || null ) {continue;}
        this.addBlock({
          x: gameProperties.gridPosX + (j * gameProperties.blockWidth),
          y: gameProperties.gridPosY + (i * gameProperties.blockHeight),
          colour: key[schema[i][j]]
        })
      }
    }
  },

  addBlocks: function () {
    if (this.blockCount) {
      this.blockGroup.callAll('kill');
    }
    this.blockCount = 0;

    debugOn() ? this.loadLevelFromSchema(levels.dev, levels.key) :
                this.loadLevelFromSchema(levels.default, levels.key);
  },

  addBlock: function (options) {
    var b = game.add.sprite(options.x, options.y, imageAssets.blockName[options.colour]);
    b.colour = options.colour;

    this.blockCount++;
    this.blockGroup.add(b)
    b.body.immovable = true;
    return b;
  },

  resetScore: function () {
    this.score = 0;
    this.lives = gameProperties.lives;
    this.updateScore();
    this.updateLives();
  },

  resetBall: function () {
    this.ball.oranged = false;
    this.ball.topped = false;
    this.ball.speed = gameProperties.ballSpeed;
    this.ball.bounces = 0;
    this.paddleSprite.scale.x = 1;
  },

  // =======================
  // Countdown between turns
  // =======================
  startBallCountdown: function () {
    game.time.events.add(Phaser.Timer.SECOND * 3, this.startBall, this)
    this.ballCountdown.start();
    this.messageDisplay.visible = true;
    this.ballCountdown.add(Phaser.Timer.SECOND * 3, this.endBallCountdown, this);
  },

  endBallCountdown: function () {
    this.messageDisplay.visible = false;
    this.ballCountdown.stop();
  },

  startBall: function () {  
    this.ball.reset(game.rnd.between(50, 350), 250);
    this.enableBall(true);

    game.physics.arcade.velocityFromAngle(game.rnd.pick(gameProperties.ballAngles), 
                                          this.ball.speed,
                                          this.ball.body.velocity);
  },

  
  // ==========================
  // Switches
  // ==========================

  enableBall: function (bool) {
    this.ball.visible = bool;
    this.ball.body.enable = bool;
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
    this.updateBounces();
    this.paddleHitSound.play();
    
    var contactSegment = Math.floor((ball.x - paddle.x)/gameProperties.paddleSegWidth)
    game.physics.arcade.velocityFromAngle(this.calcReturnAngle(contactSegment), 
                                          this.ball.speed,
                                          this.ball.body.velocity);
  },

  calcReturnAngle: function (contactSegment) {
    var returnAngle;

    if (contactSegment > (gameProperties.paddleSegments/2)) {
      contactSegment = (gameProperties.paddleSegments/2)
    } else if (contactSegment < -(gameProperties.paddleSegments/2)) {
      contactSegment = -(gameProperties.paddleSegments/2)
    } else if (contactSegment == 0) {
      contactSegment = 1;
    }

    returnAngle = (Math.abs(contactSegment) * gameProperties.paddleAngleMultiplier);
    
    if (contactSegment < 0) {
      returnAngle -= 110;
    } else if (contactSegment > 0) {
      returnAngle = -(70 - Math.abs(returnAngle));
    }

    return returnAngle;
  },

  ballOutOfBounds: function () {
    this.lives--
    this.updateLives();

    if (this.lives == 0) {
      this.showGameOver();
    } else { 
      this.resetBall()
      this.startBallCountdown();
    }
  },

  ballblockCollide: function (ball, block) {
    game.rnd.pick(this.smashes).play();

    block.kill();
    this.updateScore(block.colour);

    if (this.blockCount-- == 0) {
      game.time.events.add(Phaser.Timer.SECOND * 0.5, this.startNextRound, this)
    }
  },

  checkOrange: function (ball, block) {
    if (block.colour == 'orange' && !this.ball.oranged) {
      this.hitOrange.dispatch()
    }
  },

  // ==========================
  // Game status update functions
  // ==========================
  
  updateBounces: function () {
    this.ball.bounces++
    if (this.ball.bounces == 4 || this.ball.bounces == 12) { 
      this.reachBounceLevel.dispatch();
    }
  },

  updateScore: function (colour = null) {
    if (colour) {
      this.score += gameProperties.scores[colour];
    }
    this.scoreDisplay.setText(this.score);
  },

  updateLives: function () {
    this.livesDisplay.setText(this.lives);
  },

  onHitOrange: function () { 
    this.ball.oranged = true;
    this.ball.speed += 100

    game.physics.arcade.velocityFromAngle(Phaser.Math.radToDeg(this.ball.body.angle), 
                                          this.ball.speed,
                                          this.ball.body.velocity);
  },

  onBounceLevel: function () {
    this.ball.speed += 100;
    console.log('bounce ' + this.ball.bounces);
    console.log(this.ball.speed)
  },

  onHitTop: function () {
    this.ball.topped = true;
    this.ball.speed += 25;
    this.paddleSprite.scale.x = 0.6;
    console.log(this.ball.speed)
  }
};

// Runner
// Includes Webfont loader to give it the jump on the game loader

var game = new Phaser.Game(gameProperties.gameWidth, gameProperties.gameHeight, Phaser.AUTO, 'gameDiv')
    
WebFont.load({
  active: function () { 
    game.state.add('main', mainState)
    game.state.add('menu', Menu)
    game.state.start('menu') 
  },
  google: {
    families: ['Orbitron:700']
  }
});

