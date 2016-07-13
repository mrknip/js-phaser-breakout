var gameProperties = {
  gameHeight: 600,
  gameWidth: 400,

  paddleHeight: 50,
  paddleSpeed: 400,
  paddleSegments: 6,
  paddleSegWidth: 10, // Make this un-magic
  paddleAngleMultiplier: -15,

  ballSpeed: 500
}

var imageAssets = {
  paddleURL: 'assets/paddle.png',
  paddleName: 'paddle',

  ballURL: 'assets/ball.png',
  ballName: 'ball',

  blockURL: 'assets/block_blue.png',
  blockName: 'blockBlue'
}


var mainState = function(game) {
  this.paddleSprite;

  this.paddleLeftKey;
  this.paddleRightKey;

  this.blockGroup;
  this.blockBlue;
}

mainState.prototype = {
  preload: function () {
    game.load.image(imageAssets.paddleName, imageAssets.paddleURL);
    game.load.image(imageAssets.ballName, imageAssets.ballURL);
    game.load.image(imageAssets.blockName, imageAssets.blockURL);
  },

  create: function () {
    this.initGraphics();
    this.initControls();
    this.initPhysics();

    this.startLevel();
  },

  update: function () {
    this.movePaddle();

    game.physics.arcade.overlap(this.ball, this.paddleSprite, this.ballPaddleCollide);
    game.physics.arcade.collide(this.ball, this.blockGroup, this.blockHit);
  },

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

  initPhysics: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.physics.arcade.enable(this.paddleSprite);

    this.paddleSprite.body.immovable = true;
    this.paddleSprite.body.collideWorldBounds = true;

    game.physics.arcade.enable(this.ball);

    this.ball.body.bounce.set(1, 1);
    this.ball.body.collideWorldBounds = true;

    this.blockGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.blockGroup.enableBody = true; 


    console.log(this.blockGroup);

  },

  initControls: function () {
    this.paddleLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.paddleRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  },

  startLevel: function () {
    for (var i = 0; i < 12; i++) {
      this.blockGroup.create((i * 50), 300, imageAssets.blockName)
    }

    this.blockGroup.setAll('body.immovable', true);

    this.resetBall();
  },

  resetBall: function () {
    this.ball.reset(game.rnd.between(50, 350), 400);

    this.ball.body.velocity.x = gameProperties.ballSpeed;
    this.ball.body.velocity.y = gameProperties.ballSpeed;
  },

  ballPaddleCollide: function (ball, paddle) {
    var returnAngle;
    var contactSegment = Math.floor((ball.x - paddle.x)/gameProperties.paddleSegWidth)

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

    game.physics.arcade.velocityFromAngle(returnAngle, gameProperties.ballSpeed, ball.body.velocity);
  },

  blockHit: function (ball, block) {
    console.log('hit')
    block.kill();
  }

};


var game = new Phaser.Game(gameProperties.gameWidth, gameProperties.gameHeight, Phaser.AUTO, 'gameDiv')
game.state.add('main', mainState);
game.state.start('main');