
class Boot extends Phaser.State {

  create() {
    //  Unless you specifically need to support multitouch I would recommend setting this to 1
    this.input.maxPointers = 1;

    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    //this.stage.disableVisibilityChange = true;

    //if (this.game.device.desktop) {
      //  If you have any desktop specific settings, they can go in here
      //this.stage.scale.pageAlignHorizontally = true;
    //} else {
      //  Same goes for mobile settings.
    //}

    this._initSetup();

    this.game.state.start('Preloader', true, false);
  }

  _initSetup(){
    this._setupCanvas();
    this._setupPhysics();
    this._setupControls();
  }

  _setupCanvas(){
    // enable crisp rendering for pixel art
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // scale the game 5x always
    //game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    //game.scale.setUserScale(5, 5);

    //scaling options
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.scale.minWidth = 160;
    this.game.scale.minHeight = 144;
    //scaled up to 5x
    this.game.scale.maxWidth = 800;
    this.game.scale.maxHeight = 720;

    //game centered horizontally
    this.game.scale.pageAlignHorizontally = true;
    //game centered vertically
    this.game.scale.pageAlignVertically = true;

    //screen size will be set automatically
    //NOTE: change every setScreenSize (deprecated) that appears in a tutorial with updateLayout
    this.game.scale.updateLayout(true);
  }

  _setupPhysics() {
      //physics system for movement
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  _setupControls () {
      //controls
      cursors = this.game.input.keyboard.addKeys({
          'up': Phaser.Keyboard.UP,
          'down': Phaser.Keyboard.DOWN,
          'left': Phaser.Keyboard.LEFT,
          'right': Phaser.Keyboard.RIGHT,
          'accept': Phaser.Keyboard.Z,
          'cancel': Phaser.Keyboard.X
      });
  }

}
