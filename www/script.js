// Pacman settings
let config = {
    type: Phaser.AUTO,
    width: 626,
    height: 686,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: -1 }
        }
    },
     // game height
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
      } // our newly created scene
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
let score = 0;
let gameOver = false;

var graphics;
var path;
var ENEMY_SPEED = 1/10000;

function preload() {
    this.load.image('tiles', '/assets/tilesets/colours.png');
    this.load.tilemapTiledJSON('map', '/assets/tilemaps/pacmap2.json');
    
    this.load.atlas('sprites', '/assets/sprites/ghost1/png', '/assets/tilemaps/pacmap2.json');

    //load characters
    this.load.spritesheet('player', '/assets/sprites/spritesheet.png', {
        frameWidth: 16,
        frameHeight: 16
      });

    this.load.spritesheet('enemyR', '/assets/sprites/spritesheet.png', {
    frameWidth: 16,
    frameHeight: 16
    });
    this.load.spritesheet('enemyP', '/assets/sprites/spritesheet.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet('enemyB', '/assets/sprites/spritesheet.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet('enemyY', '/assets/sprites/spritesheet.png', {
        frameWidth: 16,
        frameHeight: 16
    });

    this.load.image('enemyR', '/assets/sprites/ghost1.png');
}

var Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Image, 
    initialize:
    function Enemy (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0,0, 'sprites','enemyR');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    },
    startOnPath: function ()
    {
        // set the t parameter at the start of the path
        this.follower.t = 0;
        this.hp = 100;
        
        // get x and y of the given t point            
        path1.getPoint(this.follower.t, this.follower.vec);
        
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        
    },
    update: function (time, delta)
    {
        // move the t point along the path, 0 is the start and 0 is the end
        this.follower.t += ENEMY_SPEED * delta;
        
        // get the new x and y coordinates in vec
        path.getPoint(this.follower.t, this.follower.vec);
        
        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // if we have reached the end of the path, remove the enemy
        if (this.follower.t >= 1)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
    
});

function getEnemy(x, y, distance) {
  var enemyUnits = enemies.getChildren();
  for(var i = 0; i < enemyUnits.length; i++) {       
      if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
          return enemyUnits[i];
  }
  return false;
} 

function create() {
    const map = this.make.tilemap({key:"map", tileWidth : 25, tileHeight: 25});
    const tileset = map.addTilesetImage('colours', 'tiles');
    const background = map.createDynamicLayer('background', tileset, 0, 0);
   //const layer = map.createDynamicLayer(0, tileset);
    const walls = map.createDynamicLayer('walls', tileset, 0, 0);
    pellets = map.createDynamicLayer('pellets', tileset, 0, 0);
    //const superPellets = map.createDynamicLayer('superPellets', tileset, 0, 0);
    walls.setCollisionByExclusion([-1]);
    //layer.setCollisionByProperty({ collides: true });

    this.data.set('lives', 3);
    this.data.set('level', 1);
    this.data.set('High Score', 2000);

    /*text.setText([
        'Level: ' + this.data.get('level'),
        'Lives: ' + this.data.get('lives'),
        'Score: ' + this.data.get('score')
    ]);*/

    var graphics = this.add.graphics();    
    // the path for our enemies
    // parameters are the start x and y of our path
    path1 = this.add.path(147, 123);
    path1.lineTo(477, 123);
    path1.lineTo(477, 513);
    path1.lineTo(147, 513);
    path1.lineTo(147, 123);
    
    graphics.lineStyle(3, 0xfff82d, 1);
    // visualize the path
    path1.draw(graphics);enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    
    
    // player
    this.player = this.physics.add.sprite(335, 510, 'player');
    this.player.setCollideWorldBounds(true);
    // set the boundaries of our game world
    this.physics.world.bounds.width = walls.width;
    this.physics.world.bounds.height = walls.height;
    this.player.setScale(2);
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 49 ,
        end: 49
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', {
          start: 98,
          end: 98
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('player', {
        start: 147,
        end: 147
    }),
    frameRate: 10,
    repeat: -1
    });

      //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Add collision detection for player and walls
    this.physics.add.collider(this.player, walls);

    // when the player overlaps with a tile with index 141, the collectCoin function will be called
    // 141 found in the coins layer in the json file 
    //pellets.setTileIndexCallback(141, collectCoin, this);
    
    // Add an overlap check for player and coins
    this.physics.add.overlap(this.player, pellets);
  
    
    //ghosts
    this.enemyR = this.add.sprite('enemyR');
    //enemyR.setCollideWorldBounds(true);
    this.enemyR.setScale(2);
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('enemyR', {
        start: 294,
        end: 294
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'enemyR',
      frames: this.anims.generateFrameNumbers('enemyR', {
        start: 294,
        end: 294
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('enemyR', {
          start: 15,
          end: 16
        }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('enemyR', {
          start: 23,
          end: 25
        }),
        frameRate: 10,
        repeat: -1
      });
    //enemy2 = this.add.sprite(303.5, 340, 'enemy2');
    //enemy3 = this.add.sprite(303.5, 340, 'enemy3');
    //enemy4 = this.add.sprite(303.5, 340, 'enemy4');
    
    
    
    cursors = this.input.keyboard.createCursorKeys();

}
  
function update(time, delta) {
    if (time > this.nextEnemy)
    {
        var enemy = enemies.get();
        if (enemy)
        {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath();

            this.nextEnemy = time + 2000;
        }       
    }
    this.player.body.setVelocity(0);

    // check for game over
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown) {
        this.player.setVelocityX(-75);
        this.player.anims.play('left', true);
    } 
    else if (cursors.right.isDown) {
        this.player.setVelocityX(75);
        this.player.anims.play('right', true);
    }
    else if (cursors.up.isDown) {
        this.player.setVelocityY(-75);    
        this.player.anims.play('up', true);
    }
    else {
        this.player.setVelocityY(75);    
        this.player.anims.play('down', true);
    }
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



