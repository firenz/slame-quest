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
    
    var player;
    var cursors;
    
    //var for levels
    var map;
    var backgroundLayer;
    var blockedLayer;
    
    //elements that will appear in the levels
    var items;
    var stairs;

    function preload() {
        
        setupScale();
        setupPhysics();
        setupAssets();
        setupControls();

    }

    function create() {
        
        map = game.add.tilemap('testlevel1');
        
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        //game.map.addTilesetImage('tiles', 'gameTiles');
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
        
        //map = setupLevel('testlevel1', 'testTiles', 'backgroundLayer', 'blockedLayer', 'objectLayer');

    }

    function update() {
        
        updatePlayerMovement();
        updateCollissions();
        
    }
    
    function setupAssets () {
        
        //load specific tiles from tileset as images
        //game.load.image();
        
        //load game assets
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
        cursors = game.input.keyboard.createCursorKeys();
        
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
    
    function updatePlayerMovement () {
        
        //player movement
        player.body.velocity.y = 0;
        player.body.velocity.x = 0;
        
        if (cursors.up.isDown) {
            player.body.velocity.y -= 50;
            
            player.animations.play('up');
        }
        else if (cursors.down.isDown) {
            player.body.velocity.y += 50;
            
            player.animations.play('down');
        }
        else if (cursors.left.isDown) {
            player.body.velocity.x -= 50;
            
            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x += 50;
            
            player.animations.play('right');
        }
        else{
            //Idle animations
            
            //TODO depending of the facing direction of player the idle changes
        }
    }
    
    function updateCollissions () {
        
        //collisions
        game.physics.arcade.collide(player, blockedLayer);
        game.physics.arcade.overlap(player, items, collect, null, this);
        game.physics.arcade.overlap(player, stairs, enterStairs, null, this);
        
    }
    
    function createItems (currentMap) {
        
        //var _currentMap = currentMap || map;
        
        //create items
        items = game.add.group();
        items.enableBody = true;
        
        var result = findObjectsByType('item', currentMap, 'objectsLayer');
        result.forEach(function(element){
            createFromTiledObject(element, items);
        });
        
    }
    
    function createStairs (currentMap) {
        
        //var _currentMap = currentMap || map;
        
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
        
        // player.animations.add('idle-up', [], 5, true);
        // player.animations.add('idle-down', [], 5, true);
        // player.animations.add('idle-left', [], 5, true);
        // player.animations.add('idle-right', [], 5, true);
        player.animations.add('up', [20, 21, 22, 23], 5, true);
        player.animations.add('down', [0, 1, 2, 3], 5, true);
        player.animations.add('right', [10, 11, 12, 13], 5, true);
        player.animations.add('left', [30, 31, 32, 33], 5, true);
        
        game.physics.arcade.enable(player);
        player.body.colliderWorldBounds = true;
        
        //resizing collider of player from sprite
        //player.body.setSize(player.width - 2, player.height - 2, 1, 1);
        player.body.setSize(player.width - 8, player.height / 2 - 2, 4, player.height / 2 + 1);
        
        game.physics.arcade.enable(player);
        game.camera.follow(player);
        player.animations.play('down');
        
    }
    
    function collect(player, collectable) {
        console.log('yummy!');
        
        //remove sprite
        collectable.destroy();
    }
    
    function enterStairs(player, stairs) {
        console.log('entering stairs that will take you to ' + stairs.targetTilemap + ' on x:' + stairs.targetX + ' and y:'+ stairs.targetY);
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

};