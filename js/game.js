var gameProperties = {
  paddleHeight: 50,
  paddleSpeed: 300
}

var imageAssets = {
  paddleURL: 'assets/paddle.png',
  paddleName: 'paddle' 
}


var mainState = function(game) {
  this.paddleSprite;

  this.paddleLeftKey;
  this.paddleRightKey;
}

mainState.prototype = {
  preload: function () {
    game.load.image(imageAssets.paddleName, imageAssets.paddleURL);
  },

  create: function () {
    this.initGraphics();
    this.initControls();
    this.initPhysics();
  },

  update: function () {
    this.movePaddle();
  },

  movePaddle: function () {
    if (this.paddleLeftKey.isDown) 
    {
      this.paddleSprite.body.velocity.x = -300;
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
  },

  initPhysics: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this.paddleSprite);

    this.paddleSprite.body.enable = true;
    this.paddleSprite.body.immovable = true;
    this.paddleSprite.body.collideWorldBounds = true;
  },

  initControls: function () {
    this.paddleLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.paddleRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  }

};


var game = new Phaser.Game(400, 600, Phaser.AUTO, 'gameDiv')
game.state.add('main', mainState);
game.state.start('main');