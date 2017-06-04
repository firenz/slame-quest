'use_strict';

//Enum with the different directions the player can face
var direction = {
  up: 1,
  down: 2,
  left: 3,
  right: 4
};

class Character extends Phaser.Sprite {
  constructor(game, x = 0, y = 0, key = '', frame = '', width = 16, height = 16, startDirection = direction.down, speed = 50, tileSize = 16) {
    //Setup Phaser.Sprite
    super(game, x, y, key, frame);

    //Var setup
    this.speed = speed;
    this.tileSize = tileSize;

    this._initAnimations();
    this._initBody(game, width, height);
    this._initStartingPosition(startDirection);
    //this.direction = ["up","down","left","right"];

    game.stage.addChild(this);
  }

  _initAnimations() {
    this.animations.add('idle-up', [8], 5, true);
    this.animations.add('idle-down', [0], 5, true);
    this.animations.add('idle-left', [4], 5, true);
    this.animations.add('idle-right', [4], 5, true);
    this.animations.add('up', [8, 9, 10, 11], 5, true);
    this.animations.add('down', [0, 1, 2, 3], 5, true);
    this.animations.add('right', [12, 13, 14, 15], 5, true);
    this.animations.add('left', [4, 5, 6, 7], 5, true);
  }

  _initBody(game, width = this.tileSize, height = this.tileSize) {
    this.body.setSize(width, height);
  }

  _initStartingPosition(newdirection = direction.down) {
    this.currentDirection = newdirection;
    this.changeDirection(this.currentDirection);
  }

  changeDirection(newdirection) {
    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      switch (newdirection) {
        case direction.up:
          this.animations.play('up');
          this.currentDirection = direction.up;
          break;
        case direction.down:
          this.animations.play('down');
          this.currentDirection = direction.down;
          break;
        case direction.right:
          this.animations.play('right');
          this.currentDirection = direction.right;
          break;
        case this.direction.left:
          this.animations.play('left');
          this.currentDirection = direction.left;
          break;
      }
    } else {
      switch (newdirection) {
        case direction.up:
          this.animations.play('idle-up');
          this.currentDirection = direction.up;
          break;
        case direction.down:
          this.animations.play('idle-down');
          this.currentDirection = direction.down;
          break;
        case direction.right:
          this.animations.play('idle-right');
          this.currentDirection = direction.right;
          break;
        case direction.left:
          this.animations.play('idle-left');
          this.currentDirection = direction.left;
          break;
      }
    }

  }

  moveTile(game, direction, speed = this.speed, maxTime = 2000) {

    var nextPosition = {
      x: 0,
      y: 0
    };

    switch (direction) {
      case direction.up:
        nextPosition.y = -1 * this.tileSize;
        break;
      case direction.down:
        nextPosition.y = this.tileSize;
        break;
      case direction.right:
        nextPosition.x = this.tileSize;
        break;
      case direction.left:
        nextPosition.x = -1 * this.tileSize;
        break;
    }

    game.physics.arcade.moveToXY(this, this.worldPosition.x + nextPosition.x, this.worldPosition.y + nextPosition.y, speed, maxTime);
    game.time.events.add(maxTime, function() {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      //NOTE: Add recursivity here, so multiple movements can be chained to make a path
    }, this);
  }

}

class Player extends Character {
  constructor(game, cursors, x = 0, y = 0, key = '', frame = '', width = '16', height = '16', startDirection = direction.down, speed = 50, tileSize = 16) {
    super(game, x, y, key, frame, width, height, startDirection, speed, tileSize);

    //Controls setup
    this.cursors = cursors || this.game.input.keyboard.addKeys({
      'up': Phaser.Keyboard.UP,
      'down': Phaser.Keyboard.DOWN,
      'left': Phaser.Keyboard.LEFT,
      'right': Phaser.Keyboard.RIGHT,
      'accept': Phaser.Keyboard.Z,
      'cancel': Phaser.Keyboard.X
    });

    // Shortcut to current state object
    this.state = this.game.state.states[this.game.state.current];

    //TODO: make an enum with all the possible states for this and assign the current one
    this.isTalking = false;

    //Camera
    game.camera.follow(this);
  }

  _initAnimations() {
    this.animations.add('idle-up', [20, 24], 5, true);
    this.animations.add('idle-down', [0, 4], 5, true);
    this.animations.add('idle-left', [30, 34], 5, true);
    this.animations.add('idle-right', [10, 14], 5, true);
    this.animations.add('up', [20, 21, 22, 23], 5, true);
    this.animations.add('down', [0, 1, 2, 3], 5, true);
    this.animations.add('right', [10, 11, 12, 13], 5, true);
    this.animations.add('left', [30, 31, 32, 33], 5, true);
  }

  _initBody(game, width = this.tileSize, height = this.tileSize) {
    //Body and physics
    this.game.physics.arcade.enable(this);
    this.body.colliderWorldBounds = true;
    this.body.bounce.x = 1;
    this.body.bounce.y = 1;
    //resizing collider of player from sprite
    this.body.setSize(width - (width / 2), height / 2 - 2, width / 4, height / 2 + 1);
  }

  update() {
    //Reset velocity in each update
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;

    if (!this.isTalking) {
      this._updatePlayerMovement();
    } else {
      if (this.cursors.accept.isDown) {

      }
    }
  }

  _updatePlayerMovement() {

    //this movement
    var velocity = {
      x: 0,
      y: 0
    };

    switch (this.animations.currentAnim.name) {
      case 'up':
        if (this.cursors.up.isDown) {
          velocity.y = -1 * this.speed;
          if (this.cursors.right.isDown) {
            velocity.x = this.speed;
          } else if (this.cursors.left.isDown) {
            velocity.x = -1 * this.speed;
          }
        } else if (this.cursors.down.isDown) {
          velocity.y = this.speed;
          this.currentDirection = direction.down;
          this.animations.play('down');
        } else {
          if (this.cursors.right.isDown) {
            velocity.x = this.speed;
            this.currentDirection = direction.right;
            this.animations.play('right');
          } else if (this.cursors.left.isDown) {
            velocity.x = -1 * this.speed;
            this.currentDirection = direction.left;
            this.animations.play('left');
          }
        }
        break;
      case 'down':
        if (this.cursors.down.isDown) {
          velocity.y = this.speed;
          if (this.cursors.right.isDown) {
            velocity.x = this.speed;
          } else if (this.cursors.left.isDown) {
            velocity.x = -1 * this.speed;
          }
        } else if (this.cursors.up.isDown) {
          velocity.y = -1 * this.speed;
          this.currentDirection = direction.up;
          this.animations.play('up');
        } else {
          if (this.cursors.right.isDown) {
            velocity.x = this.speed;
            this.currentDirection = direction.right;
            this.animations.play('right');
          } else if (this.cursors.left.isDown) {
            velocity.x = -1 * this.speed;
            this.currentDirection = direction.left;
            this.animations.play('left');
          }
        }
        break;
      case 'right':
        if (this.cursors.right.isDown) {
          velocity.x = this.speed;
          if (this.cursors.up.isDown) {
            velocity.y = -1 * this.speed;
          } else if (this.cursors.down.isDown) {
            velocity.y = this.speed;
          }
        } else if (this.cursors.left.isDown) {
          velocity.x = -1 * this.speed;
          this.currentDirection = direction.left;
          this.animations.play('left');
        } else {
          if (this.cursors.up.isDown) {
            velocity.y = -1 * this.speed;
            this.currentDirection = direction.up;
            this.animations.play('up');
          } else if (this.cursors.down.isDown) {
            velocity.y = this.speed;
            this.currentDirection = direction.down;
            this.animations.play('down');
          }
        }
        break;
      case 'left':
        if (this.cursors.left.isDown) {
          velocity.x = -1 * this.speed;
          if (this.cursors.up.isDown) {
            velocity.y = -1 * this.speed;
          } else if (this.cursors.down.isDown) {
            velocity.y = this.speed;
          }
        } else if (this.cursors.right.isDown) {
          velocity.x = this.speed;
          this.currentDirection = direction.right;
          this.animations.play('right');
        } else {
          if (this.cursors.up.isDown) {
            velocity.y = -1 * this.speed;
            this.currentDirection = direction.up;
            this.animations.play('up');
          } else if (this.cursors.down.isDown) {
            velocity.y = this.speed;
            this.currentDirection = direction.down;
            this.animations.play('down');
          }
        }
        break;
      case 'idle-up':
      case 'idle-down':
      case 'idle-right':
      case 'idle-left':
        if (this.cursors.up.isDown) {
          velocity.y = -1 * this.speed;
          this.currentDirection = direction.up;
          this.animations.play('up');
        }

        if (this.cursors.down.isDown) {
          velocity.y = this.speed;
          this.currentDirection = direction.down;
          this.animations.play('down');
        }

        if (this.cursors.right.isDown) {
          velocity.x = this.speed;
          this.currentDirection = direction.right;
          this.animations.play('right');
        }

        if (this.cursors.left.isDown) {
          velocity.x = -1 * this.speed;
          this.currentDirection = direction.left;
          this.animations.play('left');
        }
        break;
      default:

    }

    if (velocity.x === 0 && velocity.y === 0) {
      switch (this.animations.currentAnim.name) {
        case 'up':
          this.currentDirection = direction.up;
          this.animations.play('idle-up');
          break;
        case 'down':
          this.currentDirection = direction.down;
          this.animations.play('idle-down');
          break;
        case 'right':
          this.currentDirection = direction.right;
          this.animations.play('idle-right');
          break;
        case 'left':
          this.currentDirection = direction.left;
          this.animations.play('idle-left');
          break;
        default:
      }
    }

    this.body.velocity.x = velocity.x;
    this.body.velocity.y = velocity.y;
  }

}

class NPC extends Character {
  constructor(game, speech, x = 0, y = 0, key = '', frame = '', width = '16', height = '16', startDirection = direction.down, speed = 50, tileSize = 16) {
    super(game, x, y, key, frame, width, height, startDirection, speed, tileSize);

    this.speech = speech;
  }
  _initBody(width = this.tileSize, height = this.tileSize) {
    //Body and physics
    this.body.setSize(width, height);
    this.game.physics.arcade.enable(this);
  }

  _facePlayerWhenTalking(playerFacingDirection) {
    switch (playerFacingDirection) {
      case direction.up:
        changeDirection(direction.down);
        break;
      case direction.down:
        changeDirection(direction.up);
        break;
      case direction.right:
        changeDirection(direction.left);
        break;
      case direction.left:
        changeDirection(direction.right);
        break;
    }
  }

  talk(game, dialogue, player) {
    _facePlayerWhenTalking(player.currentDirection);
    dialogue.write(game, player, this.speech);
  }

}
