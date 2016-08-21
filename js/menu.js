var Menu = function(game) {
  this.title;

  this.menuItemCount;

  this.playButton;
  this.settingsButton;
}

Menu.prototype = {
  preload: function () {
    game.load.image('background', 'assets/spacebg.png');
  },


  create: function () {
    game.stage.disableVisibilityChange = true;
    this.background = game.add.tileSprite(0,0,400,500,'background');
    this.initMenu();
  },

  update: function () {
    this.background.tilePosition.y += 2;
  },

  initMenu: function () {
    this.title = game.add.text(200, 100, "BREAKOUT",Config.Styles.title);
    this.title.anchor.set(0.5, 0.5);
    
    this.menuItemCount = 0;

    this.playButton = this.addMenuItem('Play', function() {
      game.state.start('main');
    })

    this.settingsButton = this.addMenuItem('Settings', function () {
      console.log('Settings to be impl  emented');
    })

    this.creditsButton = this.addMenuItem('Credits', function () {
      console.log('To be implemented');
    })
  },

  addMenuItem: function (text, callback) {
    var menuItem = game.add.text(200, 250 + (this.menuItemCount * 70), text, 
                                  Config.Styles.menuItem)
    menuItem.anchor.set(0.5, 0.5);
    menuItem.inputEnabled = true;
    menuItem.events.onInputDown.add(callback)
    menuItem.events.onInputOver.add(function(){
      menuItem.addColor(Config.Styles.menuItemHoverColour, 0);
    })
    menuItem.events.onInputOut.add(function(){
      menuItem.addColor(Config.Styles.menuItem.fill, 0);
    })
    this.menuItemCount++;

    return menuItem;
  }
}
