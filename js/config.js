var gameProperties = {
  gameHeight: 500,
  gameWidth: 400,

  paddleHeight: 50,
  paddleSpeed: 400,
  paddleSegments: 6,
  paddleSegWidth: 10, // Make this un-magic
  paddleAngleMultiplier: -15,

  ballRestartDelay: 2,
  ballSpeed: 300,
  ballAngles: [45, 60, 120, 135],

  blockBase: 180,
  blockWidth: 50,
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

  numberDisplayStyle: {
    font: '40px Orbitron',
    fontWeight: 'bold',
    fill: '#FFFFFF',
    align: 'center'
  },
}

var imageAssets = {
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
  }
}
