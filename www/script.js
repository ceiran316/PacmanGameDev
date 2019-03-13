// Pacman settings
let config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 744,
    height: 686,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
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
let scoreText;
let pellets;
let superPellets;
let startLives = 3;
let livesText;
let isGameOver = false;

var graphics;
var pathR;
var pathP;
var pathB;
var pathY;
var ENEMY_SPEED = 1/101000;
var BIT_DAMAGE = 1;
var lives = startLives

function preload() {
    this.load.image('tiles', '/assets/tilesets/colours.png');
    this.load.tilemapTiledJSON('map', '/assets/tilemaps/pacmap2.json');
    this.load.audio('chomp', '/assets/audio/pacmanChomp.mp3');
    
    //this.load.atlas('sprites', '/assets/sprites/ghost1/png', '/assets/tilemaps/pacmap2.json');

    //load characters
    this.load.spritesheet('player', '/assets/sprites/spritesheet.png', {
        frameWidth: 20,
        frameHeight: 20
      });

    this.load.spritesheet('enemy', '/assets/sprites/blinky.png', {
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

    //this.load.image('enemy', '/assets/sprites/ghost1.png');
}

var Enemy = new Phaser.Class({
    
    Extends: Phaser.GameObjects.Image,

    initialize: function Enemy (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 0;
    },
    startOnPath: function ()
    {
        // set the t parameter at the start of the path
        this.follower.t = 0;
        this.hp = 1;
        
        // get x and y of the given t point            
        pathR.getPoint(this.follower.t, this.follower.vec);
        
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        
    },
    receiveDamage: function(damage) {
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
        if(this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);      
        }
    },
    update: function (time, delta)
    { 
        // move the t point along the path, 0 is the start and 0 is the end
        this.follower.t += ENEMY_SPEED * delta;
        
        // get the new x and y coordinates in vec
        pathR.getPoint(this.follower.t, this.follower.vec);
        
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

function damageEnemy(enemy, bullet) {  
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
        // we remove the bullet right away
        bullet.setActive(false);
        bullet.setVisible(false);    
        
        // decrease the enemy hp with BULLET_DAMAGE
        enemy.receiveDamage(BULLET_DAMAGE);
    }
}

function create() {
    const map = this.make.tilemap({key:"map", tileWidth : 25, tileHeight: 25});
    const tileset = map.addTilesetImage('colours', 'tiles');
    const background = map.createDynamicLayer('background', tileset, 0, 0);
   //const layer = map.createDynamicLayer(0, tileset);
    const walls = map.createDynamicLayer('walls', tileset, 0, 0);
    pellets = map.createDynamicLayer('pellets', tileset, 0, 0);
    const score = map.createDynamicLayer('score', tileset, 0, 0);
    superPellets = map.createDynamicLayer('superPellets', tileset, 0, 0);
    walls.setCollisionByExclusion([-1]);
    //layer.setCollisionByProperty({ collides: true });
    this.data.set('lives', 3);
    this.data.set('level', 1);
    this.data.set('High Score', 2000);

    scoreText = this.add.text(630, 321, 'Score: 0', {  FontSize: '80px', fill: '#ffffff'} );
    scoreText.fixedToCamera = true;
    var graphics = this.add.graphics();    
    // the path for our enemies
    // parameters are the start x and y of our path
    pathR = this.add.path(214, 255); //centre top left
    pathR.lineTo(411, 255); // this.enemy.anims.play('left', true);
    pathR.lineTo(411, 321);
    pathR.lineTo(477, 321);
    pathR.lineTo(477, 39);
    pathR.lineTo(345, 39);
    pathR.lineTo(345, 123);
    pathR.lineTo(411, 123);
    pathR.lineTo(411, 189);
    pathR.lineTo(345, 189);
    pathR.lineTo(345, 255);
    pathR.lineTo(279, 255);
    pathR.lineTo(279, 189);
    pathR.lineTo(214, 189);
    pathR.lineTo(214, 123);
    pathR.lineTo(279, 123);
    pathR.lineTo(279, 39);
    pathR.lineTo(147, 39);
    pathR.lineTo(147, 123);
    pathR.lineTo(39, 123);
    pathR.lineTo(39, 189);
    pathR.lineTo(147, 189);
    pathR.lineTo(147, 123);
    pathR.lineTo(585, 123);
    pathR.lineTo(585, 39);
    pathR.lineTo(477, 39);
    pathR.lineTo(477, 189);
    pathR.lineTo(585, 189);
    pathR.lineTo(585, 123);
    pathR.lineTo(477, 123);
    pathR.lineTo(477, 189);
    pathR.lineTo(543, 189);
    pathR.lineTo(543, 255);
    pathR.lineTo(585, 255);
    pathR.lineTo(585, 321); 
    pathR.lineTo(411, 321);
    pathR.lineTo(411, 255);
    pathR.lineTo(345, 255);
    pathR.lineTo(345, 189);
    pathR.lineTo(411, 189);
    pathR.lineTo(411, 123);
    pathR.lineTo(477, 123);
    pathR.lineTo(477, 321);
    pathR.lineTo(411, 321);
    pathR.lineTo(411, 447);
    pathR.lineTo(477, 447);
    pathR.lineTo(477, 321);
    pathR.lineTo(543, 321);
    pathR.lineTo(543, 447);
    pathR.lineTo(585, 447);
    pathR.lineTo(585, 513);
    pathR.lineTo(543, 513);
    pathR.lineTo(543, 579);
    pathR.lineTo(585, 579);
    pathR.lineTo(585, 645);
    pathR.lineTo(345, 645);
    pathR.lineTo(345, 579);
    pathR.lineTo(411, 579);
    pathR.lineTo(411, 513);
    pathR.lineTo(345, 513);
    pathR.lineTo(345, 447);
    pathR.lineTo(411, 447);
    pathR.lineTo(411, 381);
    pathR.lineTo(214, 381);
    pathR.lineTo(214, 321);
    pathR.lineTo(147, 321);
    pathR.lineTo(147, 447);
    pathR.lineTo(279, 447);
    pathR.lineTo(279, 513);
    pathR.lineTo(477, 513);
    pathR.lineTo(477, 579);
    pathR.lineTo(585, 579);
    pathR.lineTo(585, 645);
    pathR.lineTo(279, 645);
    pathR.lineTo(279, 579);
    pathR.lineTo(214, 579);
    pathR.lineTo(214, 513);
    pathR.lineTo(147, 513);
    pathR.lineTo(147, 321);
    pathR.lineTo(214, 321);
    pathR.lineTo(214, 447);
    pathR.lineTo(279, 447);
    pathR.lineTo(279, 513);
    pathR.lineTo(214, 513);
    pathR.lineTo(214, 579);
    pathR.lineTo(279, 579);
    pathR.lineTo(279, 645);
    pathR.lineTo(39, 645);
    pathR.lineTo(39, 579);
    pathR.lineTo(147, 579);
    pathR.lineTo(147, 513);
    pathR.lineTo(214, 513);
    pathR.lineTo(214, 579);
    pathR.lineTo(279, 579);
    pathR.lineTo(279, 645);
    pathR.lineTo(39, 645);
    pathR.lineTo(39, 579);
    pathR.lineTo(147, 579);
    pathR.lineTo(147, 321);
    pathR.lineTo(81, 321);
    pathR.lineTo(81, 447);
    pathR.lineTo(39, 447);
    pathR.lineTo(39, 513);
    pathR.lineTo(81, 513);
    pathR.lineTo(81, 579);
    pathR.lineTo(147, 579);
    pathR.lineTo(147, 447);
    pathR.lineTo(81, 447);
    pathR.lineTo(81, 321);
    pathR.lineTo(39, 321);
    pathR.lineTo(39, 255);
    pathR.lineTo(81, 255);
    pathR.lineTo(81, 189);
    pathR.lineTo(39, 189);
    pathR.lineTo(39, 39);
    pathR.lineTo(147, 39);
    pathR.lineTo(147, 123);
    pathR.lineTo(279, 123);
    pathR.lineTo(279, 39);
    pathR.lineTo(39, 39);
    pathR.lineTo(39, 123);
    pathR.lineTo(147, 123);
    pathR.lineTo(147, 321);
    pathR.lineTo(214, 321);
    pathR.lineTo(214, 447);
    pathR.lineTo(279, 447);
    pathR.lineTo(279, 513);
    pathR.lineTo(345, 513);
    pathR.lineTo(345, 447);
    pathR.lineTo(411, 447);
    pathR.lineTo(411, 381);
    pathR.lineTo(214, 381);
    pathR.lineTo(214, 255);

    /*pathP = this.add.path(411,258);//centre top right
    pathP.lineTo(411, 381);
    pathP.lineTo(214, 381);
    pathP.lineTo(214, 258);
    pathP.lineTo(411, 258);

    pathB = this.add.path(214, 381);//centre bottom left
    pathB.lineTo(411, 381);
    pathB.lineTo(214, 381);
    pathB.lineTo(214, 258);
    pathB.lineTo(411, 258);

    pathY = this.add.path(411, 381);//centre bottom right
    pathY.lineTo(411, 381);
    pathY.lineTo(214, 381);
    pathY.lineTo(214, 258);
    pathY.lineTo(411, 258);*/
    
    graphics.lineStyle(3, 0xba2c2c, 1);
    // visualize the path
    //pathR.draw(graphics);
    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 0;
    //enemies.set('body.immovable', true);
   // game.physics.arcade.collide(player, enemies);
   // enemies.set('body.immovable', false);
   // game.physics.arcade.collide(enemies);   
    
    // player
    this.player = this.physics.add.sprite(335, 513, 'player');
    this.player.setCollideWorldBounds(true);
    // set the boundaries of our game world
    this.physics.world.bounds.width = walls.width;
    this.physics.world.bounds.height = walls.height;
    this.player.body.allowGravity = false;
    this.player.setScale(1.6);
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 4,
        end: 6
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 43,
        end: 45
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', {
            start: 82,
            end: 84
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('player', {
        start: 121,
        end: 123
    }),
    frameRate: 10,
    repeat: -1
    });

      //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Add collision detection for player and walls
    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.player, enemies);

    // when the player overlaps with a tile with index 28799, the collectCoin function will be called
    // 28799 found in the coins layer in the json file 
    pellets.setTileIndexCallback(28799, collectPellets, this);
    superPellets.setTileIndexCallback(28884, collectSuperPellets, this);
    
    // Add an overlap check for player and coins
    this.physics.add.overlap(this.player, pellets);
    this.physics.add.overlap(this.player, superPellets);
  
    
    //ghosts
    this.enemy = this.physics.add.sprite('enemy');
    //enemy.setCollideWorldBounds(true);
    this.enemy.setScale(2);
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 160,
        end: 160
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'enemy',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 162,
        end: 162
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('enemy', {
          start: 156,
          end: 156
        }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('enemy', {
          start: 158,
          end: 158
        }),
        frameRate: 10,
        repeat: -1
      });
    //enemy2 = this.add.sprite(303.5, 340, 'enemy2');
    //enemy3 = this.add.sprite(303.5, 340, 'enemy3');
    //enemy4 = this.add.sprite(303.5, 340, 'enemy4');
    
    
    
    cursors = this.input.keyboard.createCursorKeys();

}

function collectPellets(sprite, tile) {
    pellets.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score += 10;
    scoreText.setText('Score: ' + score);
    let chomping = this.sound.add('chomp');
    chomping.play();
    //return false;
}


function collectSuperPellets(sprite, tile) {
    superPellets.removeTileAt(tile.x, tile.y); // remove the tile/coin

    score += 50;
    scoreText.setText('Score: ' + score);
    let chomping = this.sound.add('chomp');
    chomping.play();
}
  
function update(time, delta) {
    
    // if its time for the next enemy
    if (time > this.nextEnemy)
    {        
        var enemy = enemies.get();
        if (enemy)
        {
            enemy.setActive(true);
            enemy.setVisible(true);
            
            // place the enemy at the start of the path
            enemy.startOnPath();
            this.nextEnemy = time + 25302;
        }       
    }

    // check for game over
    if (isGameOver)
    {
        return;
    }
    var direction;

    if (cursors.down.isDown) {
        this.player.setVelocityY(125);  
        this.player.setVelocityX(0);   
        direction = 'down';
        this.player.anims.play('down', true);
    } 
    else if (cursors.right.isDown) {
        this.player.setVelocityX(125);
        this.player.setVelocityY(0); 
        direction = 'right';
        this.player.anims.play('right', true);
    }
    else if (cursors.up.isDown) {
        this.player.setVelocityY(-125);
        this.player.setVelocityX(0);     
        direction = 'up';
        this.player.anims.play('up', true);
    }
    else if (cursors.left.isDown){
        this.player.setVelocityX(-125);
        this.player.setVelocityY(0); 
        direction = 'left';
        this.player.anims.play('left', true);
    }
    else {
        if (direction == 'down') {    
            this.player.anims.play('down', true);
        } 
        if (direction == 'right') {
            this.player.anims.play('right', true);
        }
        if (direction == 'up') {    
            this.player.anims.play('up', true);
        }
        if (direction == 'left') {
            this.player.anims.play('left', true);
        }
        //this.player.setVelocityX(0);
        //this.player.anims.play('left', true);
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



