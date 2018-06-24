class PreloadState extends Phaser.State {

    create() {
      this.game.state.start('MainState')
    }
}

export default PreloadState;