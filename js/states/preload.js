
var font;

class Preload extends Phaser.State {

  preload() {

    //  Set-up our preloader sprite
    // this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
    // this.load.setPreloadSprite(this.preloadBar);
    //
    // //  Load our actual games assets
    // this.load.image('titlepage', 'assets/titlepage.jpg');
    // this.load.image('logo', 'assets/logo.png');
    // this.load.audio('music', 'assets/title.mp3', true);
    // this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
    // this.load.image('level1', 'assets/level1.png');

    //load game assets
  this._setupAssets();
  }

  create() {
    // var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    // tween.onComplete.add(this.startMainMenu, this);

    this.startMainMenu();
  }

  startMainMenu() {
    this.game.state.start('MainMenu', true, false);
  }

  _setupAssets(){
    this._setupFonts();
    this._setupImages();
    this._setupTilesets();
    this._setupSprites();
    this._setupAudio();
  }

  _setupFonts(){
    game.load.image('mono-retrofont', 'assets/fonts/5x8mono-transparent.png');
    font = game.add.retroFont('mono-retrofont', 6, 9, Phaser.RetroFont.TEXT_SET1);
  }

  _setupImages(){
    //...
  }

  _setupSprites(){
    game.load.spritesheet('player', 'assets/sprites/char_slime.png', 16, 16);
  }

  _setupTilesets(){
    game.load.spritesheet('testTiles', 'assets/tilesets/color_tileset_16x16_Eiyeron_CC-BY-SA-3.0_8.png', 16, 16);
  }

  _setupTilemaps(){
    game.load.tilemap('testlevel1', 'assets/tilemaps/leveltest.json', null, Phaser.Tilemap.TILED_JSON);
  }

  _setupAudio(){
    //...
  }

}
