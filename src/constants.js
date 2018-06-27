const INITIAL_VELOCITY = [-180, 0] // pixel per frame
const MAX_PADDLE_DELTA = 8 // // pixel per frame
const SPEED_INCREMENT = 30

const BALL_DIMS = [25, 25] // width, height
const GAME_DIMS = [800, 600] // width, height
const PADDLE_DIMS = [50, 150] // width, height

const PADDLE_CONFIG = ["human", "bot"] // [human|bot, human|bot]

export {
  INITIAL_VELOCITY,
  SPEED_INCREMENT,
  BALL_DIMS,
  GAME_DIMS,
  PADDLE_DIMS,
  MAX_PADDLE_DELTA,
  PADDLE_CONFIG
}