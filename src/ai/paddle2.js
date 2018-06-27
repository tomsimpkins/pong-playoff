const clever = data => {
  const ballVelocity = data.ballVelocity
  const ballPosition = data.ballPosition
  const isIncoming = ballVelocity[0] < 0

  let tImpact, yImpact // time until impact with paddle
  if (isIncoming) {
     tImpact = (data.BALL_DIMS[0] / 2 - ballPosition[0]) / ballVelocity[0]
     yImpact = ballPosition[1] + ballVelocity[1] * tImpact
  } else {
    return 0
  }

  if (yImpact < -data.GAME_DIMS[1] / 2) {
    return -data.GAME_DIMS[1]
  } else if (yImpact > data.GAME_DIMS[1] / 2) {
    return data.GAME_DIMS[1]
  } else {
    return yImpact
  }
}

const speed = velocity => {
  const [x, y] = velocity

  return Math.sqrt(x * x + y * y)
}

export default clever