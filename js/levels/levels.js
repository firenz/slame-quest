'use_strict';

class Level extends Phaser.State {
  create() {
    this._setupLevel();
  }

  update() {
    if(player.isTalking){
      if(cursors.accept.isDown){
        console.log("Pressed Z");
        dialogue.clear(player);
      }
    }
    this._updateCollissions();
  }

  _updateCollissions(){
    //collisions
    game.physics.arcade.collide(this.player, this.blockedLayer);
    //TODO: Maybe as a future release, there will be custom collisions between player and blockedLayer
    //game.physics.arcade.overlap(player, blockedLayer, processCollisionBlockedLayer, null, this);

    game.physics.arcade.overlap(this.player, this.items, this._collect, null, this);
    this._checkOverlapStairs(this.player);
    game.physics.arcade.overlap(this.player, this.stairs, this._stairsEnter, this._stairsCallbackEnter, this);
  }

  _setupLevel(tilemapName = 'testlevel1', tilesetName = 'tiles', tilesetKeyAsset = 'testTiles', backgroundLayerName = 'backgroundLayer', blockedLayerName = 'blockedLayer' , objectLayerName = 'objectsLayer'){
    this.tilemapName = tilemapName;
    this.tilesetName = tilesetName;
    this.tilesetKeyAsset = tilesetKeyAsset;
    this.backgroundLayerName = backgroundLayerName;
    this.blockedLayerName = blockedLayerName;
    this.objectLayerName = objectLayerName;

    this.map = game.stage.add.tilemap(this.tilemapName);

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage(this.tilesetName, this.tilesetKeyAsset);

    //create layer
    this.backgroundlayer = this.map.createLayer(this.backgroundLayerName);
    this.blockedLayer = this.map.createLayer(this.blockedLayerName);

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 2000, true, this.blockedLayerName);

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    console.log('createItems');
    this._createItems(this.map);
    console.log('createStairs');
    this._createStairs(this.map);
    this._playerStart(this.map);

  }

  _createItems() {

    //create items
    this.items = game.add.group();
    this.items.enableBody = true;

    var result = findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element) {
      createFromTiledObject(element, items);
    });

  }

  _createStairs() {

    //create stairs
    this.stairs = game.add.group();
    this.stairs.enableBody = true;
    this.stairs.isCollidingStairs = false;

    var result = findObjectsByType('stairs', this.map, 'objectsLayer');
    result.forEach(function(element) {
      createFromTiledObject(element, stairs);
    });

  }

  _playerStart(currentMap) {
    //create player
    var result = findObjectsByType('playerStart', currentMap, 'objectsLayer');
    this.player = new Player(game, cursors, result[0].x, result[0].y, 'player');
  }

  //create a sprite from an object
  _createFromTiledObject(element, group) {
    var sprite;

    //if the object has a propety called sprite, load the custom sprite
    if (element.properties.hasOwnProperty('sprite')) {
      sprite = group.create(element.x, element.y, element.properties.sprite);
    } else {
      sprite = group.create(element.x, element.y, 'testTiles', (element.gid - 1));
    }

    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key) {
      sprite[key] = element.properties[key];
    });

  }

  //find objects in a Tiled layer that contains a property called "type" equal to a certain value
  _findObjectsByType(type, map, layer) {

    var result = new Array();
    map.objects[layer].forEach(function(element) {
      if (element.properties.type === type) {
        result.push(element);
      }
    });
    return result;

  }

  _collect(player, collectable) {
    dialogue.write(game, player, "Yummy!");

    //remove sprite
    collectable.destroy();
  }

  _stairsEnter(player, stairs) {
    dialogue.write(game, player,"Entering stairs that\nwill take you to\n" + this.stairs.targetTilemap + "\non x:" + this.stairs.targetX + "and y:" + this.stairs.targetY);
  }

  _stairsCallbackEnter() {
    if(!this.stairs.isCollidingStairs && checkOverlapStairs(this.player)) {
      this.stairs.isCollidingStairs = true;
      return true;
    }
    else{
      return false;
    }
  }

  _stairsCheckOverlap(player) {
    var boundsA = player.getBounds();
    var boundsB = this.stairs.getBounds();

    if(Phaser.Rectangle.intersects(boundsA, boundsB)) {
      return true;
    }
    else{
      this.stairs.isCollidingStairs = false;
      return false;
    }
  }

}
