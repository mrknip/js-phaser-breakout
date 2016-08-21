(function(exports){

  var levels = {
    default: [
      "rrrrrrrr",
      "rrrrrrrr",
      "oooooooo",
      "oooooooo",
      "gggggggg",
      "gggggggg",
      "yyyyyyyy",
      "yyyyyyyy"
    ],

    diamond: [
      "   rr   ",
      "  roor  ",
      " roggor ",
      "rogyygor",
      " roggor ",
      "  roor  ",
      "   rr   "
    ],

    smiley: [
      "rrrrrrrr",
      "r  rr  r",
      "o  oo  o",
      "oooooooo",
      "g gggg g",
      "gg gg gg",
      "yyy  yyy",
      "yyyyyyyy"
    ],

    dev: [
  "oooooooo"
    ],
    
    key: {
      y: 'yellow',
      r: 'red',
      o: 'orange',
      g: 'green'
    }
  }

  exports.levels = levels;

})(this.Config || (this.Config = {}));
