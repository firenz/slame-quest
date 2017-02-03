'use_strict';

window.onload = function () {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    //NOTE: Always make the game window less or equal of the actual game size
    //so it can be scaled. If it is bigger, a dark area will appear and
    //it wont shrink
    var game = new Phaser.Game(160, 144, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    var cursors;
    var graphics;

    //var for player
    var player;

    //var for levels
    var map;
    var backgroundLayer;
    var blockedLayer;

    //elements that will appear in the levels
    var items;
    var stairs;

    //flags for collissions
    var isCollidingStairs = false;

    //var for dialogue boxes
    var dialogue;
    var font;
    var dialogueText;
    var dialogueBox;
    var dialogueBoxMarginX = 4;
    var dialogueBoxMarginY = 6;

    function preload() {

        setupScale();
        setupPhysics();
        setupAssets();
        setupControls();

    }

    function create() {

        font = game.add.retroFont('mono-retrofont', 6, 9, Phaser.RetroFont.TEXT_SET1);

        map = game.add.tilemap('testlevel1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        map.addTilesetImage('tiles', 'testTiles');

        //create layer
        backgroundlayer = map.createLayer('backgroundLayer');
        blockedLayer = map.createLayer('blockedLayer');

        //collision on blockedLayer
        map.setCollisionBetween(1, 2000, true, 'blockedLayer');

        //resizes the game world to match the layer dimensions
        backgroundlayer.resizeWorld();

        createItems(map);
        createStairs(map);
        playerStart(map);

        setupDialogueBox();
        clearDialogueBox();
        drawDialogueBox("Hello!\nPress Z to close the\ndialogue.", "up");
    }

    function update() {

        updatePlayerInput();
        updateCollissions();

    }

    function setupAssets () {

        //load specific tiles from tileset as images
        //game.load.image();

        //load game assets
        game.load.image('mono-retrofont', 'assets/fonts/5x8mono-transparent.png');
        game.load.tilemap('testlevel1', 'assets/tilemaps/leveltest.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('testTiles', 'assets/tilesets/color_tileset_16x16_Eiyeron_CC-BY-SA-3.0_8.png', 16, 16);

        game.load.spritesheet('player', 'assets/sprites/char_slime.png', 16, 16);

    }

    function setupScale () {

        // enable crisp rendering for pixel art
        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(game.canvas);

        // scale the game 5x always
        //game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        //game.scale.setUserScale(5, 5);

        //scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.scale.minWidth = 160;
        game.scale.minHeight = 144;
        //scaled up to 5x
        game.scale.maxWidth = 800;
        game.scale.maxHeight = 720;

        //game centered horizontally
        game.scale.pageAlignHorizontally = true;
        //game centered vertically
        game.scale.pageAlignVertically = true;

        //screen size will be set automatically
        //NOTE: change every setScreenSize (deprecated) that appears in a tutorial with updateLayout
        game.scale.updateLayout(true);

    }

    function setupPhysics () {

        //physics system for movement
        game.physics.startSystem(Phaser.Physics.ARCADE);

    }

    function setupControls () {

        //controls
        cursors = game.input.keyboard.addKeys({
            'up': Phaser.Keyboard.UP,
            'down': Phaser.Keyboard.DOWN,
            'left': Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT,
            'accept': Phaser.Keyboard.Z,
            'cancel': Phaser.Keyboard.X
        });

    }

    function setupLevel (tilemapName, tilesetName, backgroundLayerName, blockedLayerName, objectLayerName) {

        var currentMap;

        currentMap = game.add.tilemap('testlevel1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        currentMap.addTilesetImage('tiles', 'testTiles');

        //create layer
        backgroundlayer = currentMap.createLayer('backgroundLayer');
        blockedLayer = currentMap.createLayer('blockedLayer');

        //collision on blockedLayer
        currentMap.setCollisionBetween(1, 2000, true, 'blockedLayer');

        //resizes the game world to match the layer dimensions
        backgroundlayer.resizeWorld();

        console.log('createItems');
        createItems(currentMap);
        console.log('createStairs');
        createStairs(currentMap);
        playerStart(currentMap);

        return currentMap;

    }

    function updatePlayerInput() {
        //reset velocity in each update
        player.body.velocity.y = 0;
        player.body.velocity.x = 0;

        if (player.isTalking) {
            if (cursors.accept.isDown) {
                console.log('pressed Z');
                clearDialogueBox();
            }
        }
        else {
            updatePlayerMovement();
        }
    }

    function updatePlayerMovement () {

        //player movement
        var velocity = { x: 0, y: 0 };

        switch (player.animations.currentAnim.name) {
          case 'up':
          if (cursors.up.isDown) {
            velocity.y = -50;
            if (cursors.right.isDown) {
              velocity.x = 50;
            }
            else if (cursors.left.isDown) {
              velocity.x = -50;
            }
          }
          else if (cursors.down.isDown) {
            velocity.y = 50;
            player.animations.play('down');
          }
          else {
            if (cursors.right.isDown) {
              velocity.x = 50;
              player.animations.play('right');
            }
            else if (cursors.left.isDown) {
              velocity.x = -50;
              player.animations.play('left');
            }
          }
            break;
          case 'down':
          if (cursors.down.isDown) {
            velocity.y = 50;
            if (cursors.right.isDown) {
              velocity.x = 50;
            }
            else if (cursors.left.isDown) {
              velocity.x = -50;
            }
          }
          else if (cursors.up.isDown) {
            velocity.y = -50;
            player.animations.play('up');
          }
          else {
            if (cursors.right.isDown) {
              velocity.x = 50;
              player.animations.play('right');
            }
            else if (cursors.left.isDown) {
              velocity.x = -50;
              player.animations.play('left');
            }
          }
            break;
          case 'right':
          if (cursors.right.isDown) {
            velocity.x = 50;
            if (cursors.up.isDown) {
              velocity.y = -50;
            }
            else if (cursors.down.isDown) {
              velocity.y = 50;
            }
          }
          else if (cursors.left.isDown) {
            velocity.x = -50;
            player.animations.play('left');
          }
          else {
            if (cursors.up.isDown) {
              velocity.y = -50;
              player.animations.play('up');
            }
            else if (cursors.down.isDown) {
              velocity.y = 50;
              player.animations.play('down');
            }
          }
            break;
          case 'left':
          if (cursors.left.isDown) {
            velocity.x = -50;
            if (cursors.up.isDown) {
              velocity.y = -50;
            }
            else if (cursors.down.isDown) {
              velocity.y = 50;
            }
          }
          else if (cursors.right.isDown) {
            velocity.x = 50;
            player.animations.play('right');
          }
          else {
            if (cursors.up.isDown) {
              velocity.y = -50;
              player.animations.play('up');
            }
            else if (cursors.down.isDown) {
              velocity.y = 50;
              player.animations.play('down');
            }
          }
            break;
          case 'idle-up': case 'idle-down': case 'idle-right': case 'idle-left':
            if (cursors.up.isDown) {
              velocity.y = -50;
              player.animations.play('up');
            }

            if (cursors.down.isDown) {
              velocity.y = 50;
              player.animations.play('down');
            }

            if (cursors.right.isDown) {
              velocity.x = 50;
              player.animations.play('right');
            }

            if (cursors.left.isDown) {
              velocity.x = -50;
              player.animations.play('left');
            }
            break;
          default:

        }

        if (velocity.x === 0 && velocity.y === 0) {
          switch (player.animations.currentAnim.name) {
            case 'up':
              player.animations.play('idle-up');
              break;
            case 'down':
              player.animations.play('idle-down');
              break;
            case 'right':
              player.animations.play('idle-right');
              break;
            case 'left':
              player.animations.play('idle-left');
              break;
            default:
            }
        }

        player.body.velocity.x = velocity.x;
        player.body.velocity.y = velocity.y;
    }

    function updateCollissions () {

        //collisions
        game.physics.arcade.collide(player, blockedLayer);
        game.physics.arcade.overlap(player, items, collect, null, this);
        //game.physics.arcade.overlap(player, stairs, enterStairs, null, this);
        checkOverlapStairs(player);
        game.physics.arcade.overlap(player, stairs, enterStairs, processCallbackEnterStairs, this);
    }

    function createItems (currentMap) {

        //create items
        items = game.add.group();
        items.enableBody = true;

        var result = findObjectsByType('item', currentMap, 'objectsLayer');
        result.forEach(function(element){
            createFromTiledObject(element, items);
        });

    }

    function createStairs (currentMap) {

        //create stairs
        stairs = game.add.group();
        stairs.enableBody = true;

        var result = findObjectsByType('stairs', currentMap, 'objectsLayer');
        result.forEach(function(element){
            createFromTiledObject(element, stairs);
        });

    }

    function playerStart(currentMap) {

        //create player
        var result = findObjectsByType('playerStart', currentMap, 'objectsLayer');
        player = game.add.sprite(result[0].x, result[0].y, 'player');

        player.animations.add('idle-up', [20, 24], 5, true);
        player.animations.add('idle-down', [0, 4], 5, true);
        player.animations.add('idle-left', [30, 34], 5, true);
        player.animations.add('idle-right', [10, 14], 5, true);
        player.animations.add('up', [20, 21, 22, 23], 5, true);
        player.animations.add('down', [0, 1, 2, 3], 5, true);
        player.animations.add('right', [10, 11, 12, 13], 5, true);
        player.animations.add('left', [30, 31, 32, 33], 5, true);

        game.physics.arcade.enable(player);
        player.body.colliderWorldBounds = true;

        //resizing collider of player from sprite
        player.body.setSize(player.width - 8, player.height / 2 - 2, 4, player.height / 2 + 1);

        game.physics.arcade.enable(player);
        game.camera.follow(player);
        player.animations.play('idle-down');

        //TODO: make an enum with the different directions the player can face
        var facingDirections = {
            UP : 0,
            DOWN : 1,
            RIGHT : 2,
            LEFT : 3
        };
        player.currentFacingDirection = facingDirections.DOWN;

        //TODO: make an enum with all the possible states for player and assign the current one
        player.isTalking = false;
    }

    function collect(player, collectable) {
        drawDialogueBox("Yummy!");

        //remove sprite
        collectable.destroy();
    }

    function enterStairs(player, stairs) {
        drawDialogueBox('Entering stairs that\nwill take you to\n' + stairs.targetTilemap + '\non x:' + stairs.targetX + ' and y:'+ stairs.targetY);
    }

    function processCallbackEnterStairs() {
        if(!isCollidingStairs && checkOverlapStairs(player)) {
            isCollidingStairs = true;
            return true;
        }
        else{
            return false;
        }
    }

    function checkOverlapStairs(obj1) {
        var boundsA = obj1.getBounds();
        var boundsB = stairs.getBounds();

        if(Phaser.Rectangle.intersects(boundsA, boundsB)) {
            return true;
        }
        else{
            isCollidingStairs = false;
            return false;
        }
    }

    //find objects in a Tiled layer that contains a property called "type" equal to a certain value
    function findObjectsByType(type, map, layer) {

        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if(element.properties.type === type) {
                result.push(element);
            }
        });
        return result;

    }

    //create a sprite from an object
    function createFromTiledObject (element, group) {
        var sprite;

        if (element.properties.hasOwnProperty('sprite')) {
            sprite = group.create(element.x, element.y, element.properties.sprite);
        }
        else {
            sprite = group.create(element.x, element.y, 'testTiles', (element.gid - 1));
        }

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });

    }

    function setupDialogueBox() {
        dialogue = game.add.graphics(game.camera.view.width - 9 * 16, game.camera.view.height - 4 * 16);
        dialogue.fixedToCamera = true;
        dialogue.anchor.setTo(0, 0);

        dialogueBox = dialogue.addChild(game.add.graphics(0, 0));
        dialogueBox.beginFill("#000000");
        dialogueBox.drawRect(0, 0, 8 * 16, 3 * 16);

        dialogueText = dialogue.addChild(game.add.image(dialogueBoxMarginX, dialogueBoxMarginY, font));
        font.setText("", true, -1, 0, Phaser.RetroFont.ALIGN_LEFT, true);
    }

    function drawDialogueBox(string, mode = "bottom") {
        console.log("drawDialogueBox mode: " + mode);
        if (mode === "bottom"){
            dialogue.cameraOffset.y = game.camera.height - (4 * 16 - 16 * 0.5);
        }
        else if(mode === "up") {
            dialogue.cameraOffset.y = (1 * 16 - 16 * 0.5);
        }
        else{
          return;
        }

        player.isTalking = true;
        font.text = string;
        dialogueBox.alpha = 1;
    }

    function clearDialogueBox() {
        dialogueBox.alpha = 0;
        font.text = "";
        player.isTalking = false;
    }

};
