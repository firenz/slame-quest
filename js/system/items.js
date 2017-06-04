class Item extends Phaser.Sprite {
  constructor(game, x, y, key, frame, width, height) {
    //Setup Phaser.Sprite
    super(game, x || 0, y || 0, key || '', frame || '');
    game.add.existing(this);
  }
}

class Collectable extends Item {
  collect(player, collectable) {
    dialogue.write(game, player, "Yummy!");

    //remove sprite
    this.destroy();
  }
}

class Stair extends Item {
  preload() {
    this.isCollidingStairs = false;
  }

  enter(player, stairs) {
    dialogue.write(game, player,"Entering stairs that\nwill take you to\n" + this.targetTilemap + "\non x:" + this.targetX + "and y:" + this.targetY);
  }

  callbackEnterStairs() {
    if(!this.isCollidingStairs && checkOverlapStairs(this.player)) {
      this.isCollidingStairs = true;
      return true;
    }
    else{
      return false;
    }
  }

  checkOverlap(player) {
    var boundsA = player.getBounds();
    var boundsB = this.stairs.getBounds();

    if(Phaser.Rectangle.intersects(boundsA, boundsB)) {
      return true;
    }
    else{
      this.isCollidingStairs = false;
      return false;
    }
  }
}
