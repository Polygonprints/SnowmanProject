function main(){
const gameState = {};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('cave', "Cave.png");
    this.load.image('platform', "Cheeseplatform.png");
    this.load.spritesheet('codey', "CodySheet.png", { frameWidth: 118, frameHeight: 249 });
    this.load.spritesheet('snowman', "SnomanSheet.png", { frameWidth: 95, frameHeight: 145 });
    this.load.spritesheet('exit', "PortalSheet.png", { frameWidth: 244.25, frameHeight: 505 });
  }

  create() {
    gameState.active = true;

    this.add.image(0, 0, 'cave').setOrigin(0, 0);

    const platforms = this.physics.add.staticGroup();
    const platPositions = [
      { x: 50, y: 575 }, { x: 250, y: 575 }, { x: 450, y: 575 }, { x: 400, y: 380 }, { x: 100, y: 200 },
    ];
    platPositions.forEach(plat => {
      platforms.create(plat.x, plat.y, 'platform')
    });


  
  gameState.player = this.physics.add.sprite(50, 450, 'codey').setScale(0.4);
  this.cameras.main.setBounds(0, 0, 2000, 600);
  this.cameras.main.startFollow(gameState.player);

    this.physics.add.collider(gameState.player, platforms);
    
    gameState.player.setCollideWorldBounds(true);

    gameState.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('codey', { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1
    });

    gameState.enemy = this.physics.add.sprite(450, 200, 'snowman');

    platforms
    this.physics.add.collider(gameState.enemy, platforms);

    this.anims.create({
      key: 'snowmanAlert',
      frames: this.anims.generateFrameNumbers('snowman', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    gameState.enemy.anims.play('snowmanAlert', true);

    this.physics.add.overlap(gameState.player, gameState.enemy, () => {
      this.cameras.main.shake(1000, 0.02)
      this.add.text(150, 50, '      Game Over...\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll();
      gameState.enemy.move.stop();
      this.input.on('pointerup', () => {
        this.anims.resumeAll();
        this.scene.restart();
      })
    });

    gameState.exit = this.physics.add.sprite(80, 120, 'exit').setScale(0.2);
    this.anims.create({
      key: 'glow',
      frames: this.anims.generateFrameNumbers('exit', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.physics.add.collider(gameState.exit, platforms);
    gameState.exit.anims.play('glow', true);

    this.physics.add.overlap(gameState.player, gameState.exit, () => {this.cameras.main.fade(1000, 0, 0, 0)
      
      
      this.add.text(150, 50, 'You reached the exit!\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
      this.physics.pause();
      gameState.active = false;
      this.anims.pauseAll();
      gameState.enemy.move.stop();
      this.input.on('pointerup', () => {
        this.anims.resumeAll();
        this.scene.restart();
      })
    })


    gameState.enemy.move = this.tweens.add({
      targets: gameState.enemy,
      x: 320,
      ease: 'Linear',
      duration: 1800,
      repeat: -1,
      yoyo: true,
      onRepeat: growSnowman
    })
    
    let scaleChange = 1.1;
    function growSnowman() {
      if (scaleChange < 4) {
        scaleChange += .005;
        gameState.enemy.setScale(scaleChange);
        gameState.enemy.y -= 15;
      }
    }
  }

  update() {
    if (gameState.active) {
      if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(350);
        gameState.player.anims.play('run', true);
        gameState.player.flipX = false;
      } else if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-350);
        gameState.player.anims.play('run', true);
        gameState.player.flipX = true;
      } else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }

      if ((gameState.cursors.space.isDown || gameState.cursors.up.isDown) && gameState.player.body.touching.down) {
        gameState.player.anims.play('jump', true);
        gameState.player.setVelocityY(-800);
      }
    }
  }
}


const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
      enableBody: true,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);


};