// export default data => {
//   return data.ballPosition[1]
// }

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

const clever = data => {
  const ballVelocity = data.ballVelocity
  const ballPosition = data.ballPosition
  const isIncoming = ballVelocity[0] < 0

  let tImpact, yImpact // time until impact with paddle
  if (isIncoming) {
     tImpact = - ballPosition[0] / ballVelocity[0]
     yImpact = ballPosition[1] + ballVelocity[1] * tImpact
  } else {
    return data.GAME_DIMS[1] / 2
  }

  if (yImpact < 0) {
    console.log("a")
    return 0
  } else if (yImpact > data.GAME_DIMS[1]) {
    console.log("b")
    return data.GAME_DIMS[1]
  } else {
    console.log(yImpact)
    return yImpact
  }


}

const speed = velocity => {
  const [x, y] = velocity

  return Math.sqrt(x * x + y * y)
}

export default clever