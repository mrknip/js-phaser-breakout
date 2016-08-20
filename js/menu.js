var Menu = function(game) {
  
}

Menu.prototype = {
  preload: function() {
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    game.load.image(imageAssets.menuBGName, imageAssets.menuBGUrl);
  
  },

  create: function () {
    game.stage.disableVisibilityChange = true;

    // this.initGraphics();
    this.initText();

  },

  initGraphics: function () {
    game.add.sprite(0, 0, imageAssets.menuBGName);

  },

  initText: function () {
    this.title = game.add.text(200, 100, "BREAKOUT",{
      font: '50px Orbitron',
      fontWeight: 'bold',
      fill: '#FF0000',
      align: 'center'
    });

    this.playButton = game.add.text(200, 300, "Play",{
      font: '35px Orbitron',
      fontWeight: 'bold',
      fill: '#FFFFFF',
      align: 'center'
    });
    this.playButton.inputEnabled = true;
    this.playButton.events.onInputOver.add(function(){
      this.addColor('#FF0000', 0);
    }, this.playButton)
    this.playButton.events.onInputOut.add(function(){
      this.addColor('#FFFFFF', 0);
    }, this.playButton)
    this.playButton.events.onInputDown.add(function(){
      game.state.start('main');
    })

    this.helpButton = game.add.text(200, 370, "Help",{
      font: '35px Orbitron',
      fontWeight: 'bold',
      fill: '#FFFFFF',
      align: 'center'
    });
    this.helpButton.inputEnabled = true;
    this.helpButton.events.onInputOver.add(function(){
      this.addColor('#FF0000', 0);
    }, this.helpButton)
    this.helpButton.events.onInputOut.add(function(){
      this.addColor('#FFFFFF', 0);
    }, this.helpButton)
    this.helpButton.events.onInputDown.add(function(){
      game.state.start('help');
    })

    this.title.anchor.set(0.5, 0.5);
    this.playButton.anchor.set(0.5, 0.5);
    this.helpButton.anchor.set(0.5, 0.5);




  }
}