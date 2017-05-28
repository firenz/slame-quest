'use_strict';

//Enum with the different directions the player can face
var facingDirection = {
  up: 1,
  down: 2,
  left: 3,
  right: 4
};

class Character extends Phaser.Sprite {
  constructor(game, x = 0, y = 0, key = '', frame = '', width = '16', height = '16', startFacingDirection = facingDirection.down, speed = 50, tileSize = 16) {
    //Setup Phaser.Sprite
    super(game, x || 0, y || 0, key || '', frame || '');

    //Var setup
    this.speed = speed || 50;
    this.tileSize = tileSize || 16;

    this._initAnimations();
    this._initBody(width, height);
    this._initStartingPosition(startFacingDirection);

    game.add.existing(this);
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

  _initBody(width, height) {
    this.body.setSize(width || this.tileSize || 16, height || this.tileSize || 16);
  }

  _initStartingPosition(newFacingDirection) {
    this.currentFacingDirection = newFacingDirection || facingDirection.down;
    this.changeFacingDirection(this.currentFacingDirection);
  }

  changeFacingDirection(newFacingDirection) {
    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      switch (newFacingDirection) {
        case facingDirection.up:
          this.animations.play('up');
          break;
        case facingDirection.down:
          this.animations.play('down');
          break;
        case facingDirection.right:
          this.animations.play('right');
          break;
        case this.facingDirection.left:
          this.animations.play('left');
          break;
      }
    } else {
      switch (newFacingDirection) {
        case facingDirection.up:
          this.animations.play('idle-up');
          break;
        case facingDirection.down:
          this.animations.play('idle-down');
          break;
        case facingDirection.right:
          this.animations.play('idle-right');
          break;
        case facingDirection.left:
          this.animations.play('idle-left');
          break;
      }
    }

  }

}

class Player extends Character {
  constructor(game, cursors, x = 0, y = 0, key = '', frame = '', width = '16', height = '16', startFacingDirection = facingDirection.down, speed = 50, tileSize = 16) {
    super(game, x, y, key, frame, width, height, startFacingDirection, speed, tileSize);

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

    // Shortcut to inverse of Pythagorean constant
    // (used to make diagonal speed match straight speed)
    // source: https://github.com/SaFrMo/phaser-link/blob/master/index.js
    this.pythInverse = 1 / Math.SQRT2;

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

  _initBody(width, height) {
    //Body and physics
    this.game.physics.arcade.enable(this);
    this.body.colliderWorldBounds = true;
    this.body.bounce.x = 1;
    this.body.bounce.y = 1;
    //resizing collider of player from sprite
    this.body.setSize((width || this.tileSize || 16) - (width / 2), (height || this.tileSize || 16) / 2 - 2, (width || this.tileSize || 16) / 4, (height || this.tileSize || 16) / 2 + 1);
  }

  update() {
    //Reset velocity in each update
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;

    if (!this.isTalking) {
      this._updatePlayerMovement();
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
          this.currentFacingDirection = facingDirection.down;
          this.animations.play('down');
        } else {
          if (this.cursors.right.isDown) {
            velocity.x = this.speed;
            this.currentFacingDirection = facingDirection.right;
            this.animations.play('right');
          } else if (this.cursors.left.isDown) {
            velocity.x = -1 * this.speed;
            this.currentFacingDirection = facingDirection.left;
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
          this.currentFacingDirection = facingDirection.up;
          this.animations.play('up');
        } else {
          if (this.cursors.right.isDown) {
            velocity.x = this.speed;
            this.currentFacingDirection = facingDirection.right;
            this.animations.play('right');
          } else if (this.cursors.left.isDown) {
            velocity.x = -1 * this.speed;
            this.currentFacingDirection = facingDirection.left;
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
          this.currentFacingDirection = facingDirection.left;
          this.animations.play('left');
        } else {
          if (this.cursors.up.isDown) {
            velocity.y = -1 * this.speed;
            this.currentFacingDirection = facingDirection.up;
            this.animations.play('up');
          } else if (this.cursors.down.isDown) {
            velocity.y = this.speed;
            this.currentFacingDirection = facingDirection.down;
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
          this.currentFacingDirection = facingDirection.right;
          this.animations.play('right');
        } else {
          if (this.cursors.up.isDown) {
            velocity.y = -1 * this.speed;
            this.currentFacingDirection = facingDirection.up;
            this.animations.play('up');
          } else if (this.cursors.down.isDown) {
            velocity.y = this.speed;
            this.currentFacingDirection = facingDirection.down;
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
          this.currentFacingDirection = facingDirection.up;
          this.animations.play('up');
        }

        if (this.cursors.down.isDown) {
          velocity.y = this.speed;
          this.currentFacingDirection = facingDirection.down;
          this.animations.play('down');
        }

        if (this.cursors.right.isDown) {
          velocity.x = this.speed;
          this.currentFacingDirection = facingDirection.right;
          this.animations.play('right');
        }

        if (this.cursors.left.isDown) {
          velocity.x = -1 * this.speed;
          this.currentFacingDirection = facingDirection.left;
          this.animations.play('left');
        }
        break;
      default:

    }

    if (velocity.x === 0 && velocity.y === 0) {
      switch (this.animations.currentAnim.name) {
        case 'up':
          this.currentFacingDirection = facingDirection.up;
          this.animations.play('idle-up');
          break;
        case 'down':
          this.currentFacingDirection = facingDirection.down;
          this.animations.play('idle-down');
          break;
        case 'right':
          this.currentFacingDirection = facingDirection.right;
          this.animations.play('idle-right');
          break;
        case 'left':
          this.currentFacingDirection = facingDirection.left;
          this.animations.play('idle-left');
          break;
        default:
      }
    }

    this.body.velocity.x = velocity.x;
    this.body.velocity.y = velocity.y;
  }

}
