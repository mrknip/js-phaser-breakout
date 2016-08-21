(function(exports){
  
  exports.Game = {
    gameHeight: 500,
    gameWidth: 400,

    lives: 3,

    paddleHeight: 50,
    paddleSpeed: 450,
    paddleSegments: 6,
    paddleSegWidth: 10, // Make this un-magic
    paddleAngleMultiplier: -15,

    ballRestartDelay: 2,
    ballSpeed: 300,
    ballAngles: [45, 60, 120, 135],

    blockBase: 180,
    blockWidth: 50,
    blockHeight: 15,
    gridPosX: 0,
    gridPosY: 75,
    blockRows: ['red', 'orange', 'green', 'yellow'],

    scores: {
      'yellow': 1,
      'green' : 3,
      'orange': 5,
         'red': 7
    },

    scoreDisplayX: 50,
    scoreDisplayY: 45,
    livesDisplayX: 350,
    livesDisplayY: 45,


  }

  exports.Styles = {
    title: {
      font: '50px Orbitron',
      fontWeight: 'bold',
      fill: '#FF0000',
      align: 'center'
    },

    menuItemHoverColour: "#FF0000",
    menuItem: {
      font: '35px Orbitron',
      fontWeight: 'bold',
      fill: '#FFFFFF',
      align: 'center'
    },

    numberDisplay: {
      font: '40px Orbitron',
      fontWeight: 'bold',
      fill: '#FFFFFF',
      align: 'center'
    }
  }

  exports.Assets = {
    images: {
      paddleURL: 'assets/paddle.png',
      paddleName: 'paddle',

      ballURL: 'assets/ball.png',
      ballName: 'ball',

      blockURL: {
        'yellow': 'assets/block_yellow.png',
        'green': 'assets/block_green.png',
        'orange': 'assets/block_orange.png',
        'red': 'assets/block_red.png'
      },

      blockName: {
        'yellow': 'blockYellow',
        'green': 'blockGreen',
        'orange': 'blockOrange',
        'red': 'blockRed'
      },

      menuBGUrl: 'assets/menubackground.png',
      menuBGName: 'MenuBackground'
    },

    sounds: {
      paddleHitURL: 'assets/paddle_hit.ogg',
      paddleHitName: 'paddleHit',

      blockHitURL: 'assets/block_hit.ogg',
      blockHitName: 'blockHit',

      smashOneURL: 'assets/smash1.ogg',
      smashOneName: 'smashOne',  
      smashTwoURL: 'assets/smash2.ogg',
      smashTwoName: 'smashTwo',  
      smashThreeURL: 'assets/smash3.ogg',
      smashThreeName: 'smashThree',
    }
  }
})(this.Config || (this.Config = {}));