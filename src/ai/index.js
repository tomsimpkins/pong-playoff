import paddle1 from "./paddle1.js"
import paddle2 from "./paddle2.js"
// import paddle1 from "./paddle2.paul.js"
// import paddle2 from "./paddle2.will.js"

// paddleData looks like this:
// {
//   GAME_DIMS: [w, h],
//   PADDLE_DIMS: [w, h],
//   BALL_DIMS: [w, h],
//   SPEED_INCREMENT: N,
//   MAX_PADDLE_DELTA: N,
//   player: y,
//   opponent: y,
//   ballPosition: [x, y],
//   ballVelocity: [x, y]
// }

// paddleFn takes the data from game and returns a target y coord for the paddle
// paddles are orientated s.t. they are on the left.  Y origin is centre of game.
// paddleFn :: paddleData -> Number

export { paddle1, paddle2 }