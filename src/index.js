import BootState from './states/boot.state';
import PreloadState from './states/preload.state';
import MainState from './states/main.state';
import { GAME_DIMS } from "./constants.js"

class Game extends Phaser.Game {

    constructor() {
        super(...GAME_DIMS, Phaser.AUTO, '');

        this.state.add('BootState', BootState);
        this.state.add('PreloadState', PreloadState);
        this.state.add('MainState', MainState);

        this.state.start('BootState');
    }
}

new Game();