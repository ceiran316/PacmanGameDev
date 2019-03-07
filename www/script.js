// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// our game's configuration
let config = {
    type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
    width: 626,
    height: 686,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
     // game height
    scene: {
        preload: preload,
        create: create,
        update: update
      } // our newly created scene
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);

function preload() {
    this.load.image('tiles', '/assets/tilesets/colours.png');
    this.load.tilemapTiledJSON('map', '/assets/tilemaps/pacmap2.json');
    //this.load.spritesheet('pacman', 'assets/sprites/pacman.png', { frameWidth: 96, frameHeight: 96 });
}

function create() {
    const map = this.make.tilemap({key:"map", tileWidth : 25, tileHeight: 25});
    const tileset = map.addTilesetImage('colours', 'tiles');

    const background = map.createDynamicLayer('background', tileset, 0, 0);
    const walls = map.createDynamicLayer('walls', tileset, 0, 0);
    const pellets = map.createDynamicLayer('pellets', tileset, 0, 0);
    const superPellets = map.createDynamicLayer('superPellets', tileset, 0, 0);
}
  
function update() {
    
}

// load asset files for our game
/*gameScene.preload = function() {
 
  // load images
    this.load.image('background', 'assets/pacmap2.png');
    this.load.image('pacman', 'assets/pac.jpg');
    this.load.image('ghost1', 'assets/ghost1.png');
    this.load.image('ghost2', 'assets/ghost2.jpg');
};
 
// executed once, after assets were loaded
gameScene.create = function() {
 
    // background
    this.add.sprite(335, 366, 'background');

    // player
    this.pacman = this.add.sprite(333.5, 548.5, 'pacman');

    //ghosts
    this.ghost1 = this.add.sprite(303.5, 340, 'ghost1');
    this.ghost2 = this.add.sprite(363.5, 340, 'ghost2');
  
    // scale down
    this.pacman.setScale(0.18);
    this.ghost1.setScale(0.13);
    this.ghost2.setScale(0.13);

   
}

gameScene.init = function() {
    this.playerSpeed = 1.5;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
  }

gameScene.update = function() {
    
     // check for active input
     if (this.input.activePointer.isDown) {
    
       // player walks
       this.pacman.x += this.playerSpeed;
     }

     if (Phaser.Geom.Intersects.RectangleToRectangle(this.pacman.getBounds(), this.ghost1.getBounds())) {
        this.gameOver();
      }
};

// end the game
gameScene.gameOver = function() {
    
       // restart the scene
       this.scene.restart();
}*/



