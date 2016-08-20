var Menu = function(game) {
  this.title;

  this.menuItemCount;

  this.playButton;
  this.helpButton;
}

Menu.prototype = {
  create: function () {
    game.stage.disableVisibilityChange = true;
    this.initMenu();
  },

  initMenu: function () {
    this.title = game.add.text(200, 100, "BREAKOUT",menuProperties.titleStyle);
    this.title.anchor.set(0.5, 0.5);
    
    this.menuItemCount = 0;

    this.playButton = this.addMenuItem('Play', function() {
      game.state.start('main');
    })

    this.settingsButton = this.addMenuItem('Settings', function () {
      console.log('To be implemented');
    })

    this.creditsButton = this.addMenuItem('Credits', function () {
      console.log('To be implemented');
    })
  },

  addMenuItem: function (text, callback) {
    var menuItem = game.add.text(200, 250 + (this.menuItemCount * 70), text, 
                                  menuProperties.menuItemStyle)
    menuItem.anchor.set(0.5, 0.5);
    menuItem.inputEnabled = true;
    menuItem.events.onInputDown.add(callback)
    menuItem.events.onInputOver.add(function(){
      menuItem.addColor(menuProperties.menuItemHoverColour, 0);
    })
    menuItem.events.onInputOut.add(function(){
      menuItem.addColor(menuProperties.menuItemStyle.fill, 0);
    })
    this.menuItemCount++;

    return menuItem;
  }
}
