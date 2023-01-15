"use strict"
const game = new Phaser.Game(800, 800, Phaser.AUTO, 'game-canvas', { preload, create, update })
function preload() {
   game.load.image("background", "assets/images/background.png")
   game.load.spritesheet("vulture", "assets/images/Vulture.ss.png", 800 / 8, 140 / 2)
   game.load.image("mouse", "assets/images/mouse.png")
   game.load.image("bull", "assets/images/bull.png")
   game.load.image("lion", "assets/images/lion.png")
   game.load.audio("flap", "assets/wing-flap.mp3")

   game.load.image("terrains", "assets/32x32_tileset_terrains.png")
   game.load.tilemap("map", "assets/savana.json", null, Phaser.Tilemap.TILED_JSON)
}

let leo, cursors, spaceKey, ground, mouse, bull, lion, background, textTochki, textWin
let LeoSpeed = 200
let counter = 0

function create() {

   background = game.add.tileSprite(0, 0, 1000, 1000, "background")
   //game.stage.backgroundColor = "#5ab5cc"

   const karta = game.add.tilemap("map")
   karta.addTilesetImage("32x32_tileset_terrains", "terrains")
   karta.setCollisionByExclusion([])
   ground = karta.createLayer(0)
   karta.createLayer(0)
   karta.createLayer(1)

   createLeo()
   createMouse()
   createBull()
   createLion()
   createText()


   game.world.setBounds(0, 0, 1000, 1000)
   game.camera.follow(leo, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0, 1)

   cursors = game.input.keyboard.createCursorKeys()
   spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)


}

function update() {
   background.tilePosition.x -= 0.5
   //background.tilePosition.y-=2

   moveLeo()
   game.physics.arcade.collide(leo, ground)
   game.physics.arcade.collide(mouse, ground)
   game.physics.arcade.collide(bull, ground)
   game.physics.arcade.collide(lion, ground)

   game.physics.arcade.overlap(leo, mouse, function () {
      MouseCollision(mouse)

      updateText()
      console.log(counter)
   })

   game.physics.arcade.overlap(leo, bull, function () {
      BullCollision(bull)

      updateText()
      console.log(counter)
   })

   game.physics.arcade.overlap(leo, lion, function () {
      LionCollision(lion)

      updateText()
      console.log(counter);
   })



}

const createLeo = function () {

   leo = game.add.sprite(100, 100, "vulture")
   //LEO.animations.add("",[1,2,3,4,5,6,7],9,true).play()
   leo.scale.setTo(0.9)
   leo.anchor.setTo(0.5)
   game.physics.enable(leo)
   leo.body.gravity.y = true
   leo.body.gravity.y = 3500
   leo.body.bounce.y = 0.5
   leo.body.collideWorldBounds = true


}

//const jump = function() {
// leo.body.velocity.y = -350
//}

const moveLeo = function () {
   if (cursors.left.isDown) {
      leo.body.velocity.x = -LeoSpeed
      leo.animations.add("", [1, 2, 3, 4, 5, 6, 7], 9, true).play()
      game.sound.add("flap")

   }
   else if (cursors.right.isDown) {
      leo.body.velocity.x = LeoSpeed
      leo.animations.add("", [9, 10, 11, 12, 13, 14, 15, 16], 9, true).play()

   }
   else {
      leo.body.velocity.x = 0
   }

   if (spaceKey.isDown) {
      leo.body.velocity.y = -LeoSpeed

   }
   else {
      leo.body.velocity.y = 0
   }
}

const createMouse = function () {
   mouse = game.add.sprite(game.world.randomX, game.world.randomY, "mouse")
   mouse.scale.setTo(0.1)
   game.physics.enable(mouse)
   mouse.body.collideWorldBounds = true
   mouse.body.bounce.y = 0.2
   mouse.body.gravity.y = 200
}

const MouseCollision = function (mouse) {
   mouse.destroy()
   createMouse()
   counter += 10
}

const createBull = function () {
   bull = game.add.sprite(game.world.randomX, game.world.randomY, "bull")
   bull.scale.setTo(0.2)
   game.physics.enable(bull)
   bull.body.collideWorldBounds = true
   bull.body.bounce.y = 0.2
   bull.body.gravity.y = 200
}

const BullCollision = function (bull) {
   bull.destroy()
   createBull()
   counter += 20
}

const createLion = function () {
   lion = game.add.sprite(game.world.randomX, game.world.randomY, "lion")
   lion.scale.setTo(0.3)
   lion.anchor.setTo(0.5)
   game.physics.enable(lion)
   lion.body.collideWorldBounds = true
   lion.body.bounce.y = 0.15
   lion.body.gravity.y = 200

   game.physics.arcade.enable(lion)

   if (counter > 50) {
      game.physics.arcade.moveToObject(lion, leo, 10, 400)
   }

}

const LionCollision = function (lion) {
   lion.destroy()
   createLion
   counter -= 30
   game.camera.flash(0xffab00, 800)
}

const createText = function () {
   const style = { fill: "#ffffff" }
   textTochki = game.add.text(10, 5, "Точки:" + counter)
}

const updateText = function () {
   const style = { fill: "#ffffff" }
   textTochki.setText("Точки:" + counter)

   if (counter >= 200) {
      const style = { fill: "#ffff00" }
      textWin = game.add.text(400, 400, "Ти уби рибата")
      textWin.scale.setTo(1.5)
   } if (counter < 0) {

      textWin = game.add.text(400, 400, "Симба те съсипа",)
   } else if (counter = 0) {
      textWin.destroy()
   }


}




