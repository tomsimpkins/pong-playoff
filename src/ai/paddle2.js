const clever = data => {
  const ballVelocity = data.ballVelocity
  const ballPosition = data.ballPosition
  const isIncoming = ballVelocity[0] < 0
  let tImpact, yImpact // time, y at impact with paddle

  if (!isIncoming) return 0 // wait in middle if ball going away.  For now.

  tImpact = (data.BALL_DIMS[0] / 2 - ballPosition[0]) / ballVelocity[0]
  yImpact = ballPosition[1] + ballVelocity[1] * tImpact

  if (yImpact > (data.GAME_DIMS[1] / 2 - data.BALL_DIMS[0] / 2) || yImpact < (-data.GAME_DIMS[1] /2 + data.BALL_DIMS[0] / 2)) {
    return adjustForBounces(yImpact, data.GAME_DIMS[1], data.BALL_DIMS[1])
  }
  else {
    return yImpact
  }
}

// will probably provide the post bounce y coord for free in the end, to avoid repeating this per frame.
const adjustForBounces = (yImpact, gameHeight, ballHeight) => {
  let goingUp = yImpact > 0
  let halfBall = Math.floor(ballHeight / 2)

  // take ball to first bounce
  yImpact = Math.abs(yImpact)
  yImpact -= (gameHeight / 2 - halfBall)
  goingUp = !goingUp

  // subsequent bounces
  while (yImpact > gameHeight) {
    goingUp = !goingUp
    yImpact -= (gameHeight - halfBall * 2)
  }

  // landing y
  return (goingUp ? 1 : -1) * (-(gameHeight / 2 - halfBall) + yImpact)
}

export default clever