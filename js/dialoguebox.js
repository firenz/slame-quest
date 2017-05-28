'use_strict';

Dialogue = function(game, font, speech = '', colorBackground = 0x000000, colorText = 0xFFFFFF, marginX = 4, marginY = 6, tileSize = 16) {
  Phaser.Graphics.call(this, game, game.camera.view.width - 9 * tileSize, game.camera.view.height - 4 * tileSize);
  //Phaser.Graphics.call(this, game, 0, 0);

  //var setup
  this.font = font || game.add.retroFont('mono-retrofont', 6, 9, Phaser.RetroFont.TEXT_SET1);
  this.speech = speech || '';
  this.colorBackground = colorBackground || 0x000000;
  this.colorText = colorText;
  this.marginX = marginX || 4;
  this.marginY = marginY || 6;
  this.tileSize = tileSize || 16;

  //Fixed to camera so the dialogue position is relative to camera, not world position
  this.fixedToCamera = true;

  //Anchor so the children initial position goes to the pos 0,0 of dialogue
  this.anchor.setTo(0, 0);

  //Dialogue background setup
  this.background = this.addChild(game.add.graphics(0, 0));
  this.background.beginFill(this.colorBackground);
  this.background.drawRect(0, 0, 8 * 16, 3 * 16);

  //Dialogue text setup
  this.text = this.addChild(game.add.image(this.marginX, this.marginY, this.font));
  this.text.tint = this.colorText;
  this.font.setText("", true, -1, 0, Phaser.RetroFont.ALIGN_LEFT, true);

  //IMPORTANT
  game.add.existing(this);
}

Dialogue.prototype = Object.create(Phaser.Graphics.prototype);
Dialogue.prototype.constructor = Dialogue;
Dialogue.prototype.write = function(game, player, string, mode = "bottom") {

  if (mode === "bottom") {
    this.cameraOffset.y = game.camera.height - (4 * this.tileSize - this.tileSize * 0.5);
  } else if (mode === "up") {
    this.cameraOffset.y = (1 * this.tileSize - this.tileSize * 0.5);
  } else {
    return;
  }

  player.isTalking = true;
  this.font.text = string;
  console.log("speech: " + this.font.text);
  this.background.alpha = 1;
};
Dialogue.prototype.clear = function(player) {
  this.background.alpha = 0;
  this.font.text = "";
  player.isTalking = false;
};
Dialogue.prototype.changeBackgroundColor = function(newColor = 0x000000) {
  this.colorBackground = newColor;
  this.background.beginFill(this.colorBackground);
};
Dialogue.prototype.changeTextColor = function(newColor = 0xFFFFFF) {
  this.colorText = newColor;
  this.text.tint = this.colorText;
};
