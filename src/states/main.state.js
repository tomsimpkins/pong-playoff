import { paddle1 as paddle1Bot, paddle2 as paddle2Bot } from "../ai/index.js"
import {
  INITIAL_VELOCITY,
  SPEED_INCREMENT,
  BALL_DIMS,
  GAME_DIMS,
  PADDLE_DIMS,
  MAX_PADDLE_DELTA
} from "../constants.js"

class MainState extends Phaser.State {

  constructor() {
    super()

    this.score1 = 0
    this.score2 = 0
    this._paused = true
    this.tick = 0
  }

  create() {
    // this.game.forceSingleUpdate = true
    // this.game.time.advancedTiming = true

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.checkCollision.right = false;
    this.game.physics.arcade.checkCollision.left = false;

    this.paddle1 = this.game.add.sprite(this.game.world.x + 50, this.game.world.centerY, this.paddleTexture())
    this.paddle1.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.paddle1, Phaser.Physics.ARCADE)
    this.paddle1.body.bounce.set(1);
    this.paddle1.body.immovable = true;

    this.paddle2 = this.game.add.sprite(this.game.world.width - 50, this.game.world.centerY, this.paddleTexture())
    this.paddle2.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.paddle2, Phaser.Physics.ARCADE)
    this.paddle2.body.bounce.set(1);
    this.paddle2.body.immovable = true;

    this.ball = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, this.ballTexture());
    this.ball.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.ball, Phaser.Physics.ARCADE)
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.set(1)
    this.ball.checkWorldBounds = true
    this.ball.events.onOutOfBounds.add(this.ballLost, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.input.onDown.add(this.releaseBall, this);
  }

  update() {
    if (this._paused) return

    this.tick++
    this.game.physics.arcade.collide(this.ball, this.paddle1, MainState.ballOnPaddle1, null, this)
    this.game.physics.arcade.collide(this.ball, this.paddle2, MainState.ballOnPaddle2, null, this)

    if (this.cursors.up.isDown) {
      this.paddle1.y = Math.max(this.paddle1.y - MAX_PADDLE_DELTA, this.paddle1.height / 2)
    }
    else if (this.cursors.down.isDown) {
      this.paddle1.y = Math.min(this.paddle1.y + MAX_PADDLE_DELTA, this.game.height - this.paddle1.height / 2)
    }

    let proposedPosition = MainState.fromPaddleCoords(paddle2Bot(this.formatPaddleData(true)))
    let diff = proposedPosition - this.paddle2.y

    diff = diff > MAX_PADDLE_DELTA ? MAX_PADDLE_DELTA :
      diff < -MAX_PADDLE_DELTA ? -MAX_PADDLE_DELTA :
        diff

    this.paddle2.y = Math.max(Math.min(this.paddle2.y + diff, this.game.height - this.paddle2.height / 2), this.paddle2.height / 2)

  }

  render() {
    // this.game.debug.spriteInfo(this.paddle1, 0, 50)
    // this.game.debug.spriteInfo(this.ball, 400, 50)
    // this.game.debug.text(this.game.time.fps, 0, 300)
  }

  paddleTexture() {
    let graphics = new Phaser.Graphics(this.game)

    graphics.beginFill(0xFF0000)
    graphics.drawRect(0, 0, ...PADDLE_DIMS)
    graphics.endFill()

    return graphics.generateTexture()
  }

  ballTexture() {
    let graphics = new Phaser.Graphics(this.game)

    graphics.beginFill(0x00FF00)
    graphics.drawRect(0, 0, ...BALL_DIMS)
    graphics.endFill()

    return graphics.generateTexture()
  }

  static ballOnPaddle1(ball, paddle) {
    if (!ball.body.touching.left) return

    ball.body.velocity.setTo(...MainState.calcNewVelocity(ball, paddle))
  }

  static ballOnPaddle2(ball, paddle) {
    if (!ball.body.touching.right) return

    ball.body.velocity.setTo(...MainState.calcNewVelocity(ball, paddle, true))
  }

  static calcNewVelocity(ball, paddle, reverse = false) {
    let dist, exitAngle, exitSpeed

    // distance from centreY of paddle, proportion of possible distance from centre
    dist = (ball.y - paddle.y) / ((ball.height + paddle.height) / 2)
    exitAngle = (Math.PI / 3) * dist
    exitSpeed = ball.body.speed + SPEED_INCREMENT

    return [
      (reverse ? -1 : 1) *  exitSpeed * Math.cos(exitAngle),
      exitSpeed * Math.sin(exitAngle)
    ]
  }

  static toFpsSpeed(v) {
    return v / 60
  }
  
  static toPaddleCoords(y) {
    return y - GAME_DIMS[1] / 2
  }
  
  static fromPaddleCoords(y) {
    return y + GAME_DIMS[1] / 2
  }

  formatPaddleData(reverse = false) {
    let leftBound, rightBound

    rightBound = this.paddle2.left
    leftBound = this.paddle1.right

    return Object.assign({
      GAME_DIMS: [rightBound - leftBound, GAME_DIMS[1]],
      PADDLE_DIMS,
      BALL_DIMS,
      SPEED_INCREMENT: MainState.toFpsSpeed(SPEED_INCREMENT),
      MAX_PADDLE_DELTA
    }, !reverse ? {
      player: MainState.toPaddleCoords(this.paddle1.y),
      opponent: MainState.toPaddleCoords(this.paddle2.y),
      INITIAL_VELOCITY: INITIAL_VELOCITY.map(MainState.toFpsSpeed),
      ballPosition: [this.ball.position.x - leftBound, MainState.toPaddleCoords(this.ball.position.y)],
      ballVelocity: [this.ball.body.velocity.x, this.ball.body.velocity.y].map(MainState.toFpsSpeed)
    } : {
      player: MainState.toPaddleCoords(this.paddle2.y),
      opponent: MainState.toPaddleCoords(this.paddle1.y),
      INITIAL_VELOCITY: [-INITIAL_VELOCITY[0], INITIAL_VELOCITY[1]].map(MainState.toFpsSpeed),
      ballPosition: [rightBound - this.ball.position.x, MainState.toPaddleCoords(this.ball.position.y)],
      ballVelocity: [-this.ball.body.velocity.x, this.ball.body.velocity.y].map(MainState.toFpsSpeed)
    })
  }

  ballLost(ball) {
    this._paused = true

    this.ball.x = this.game.world.centerX
    this.ball.y = this.game.world.centerY

    this.paddle1.y = this.game.world.centerY
    this.paddle2.y = this.game.world.centerY

    this.ball.body.velocity.setTo(0, 0)
  }

  releaseBall() {
    if (!this._paused) return

    this._paused = false
    this.ball.body.velocity.setTo(...INITIAL_VELOCITY)
  }
}

export default MainState;