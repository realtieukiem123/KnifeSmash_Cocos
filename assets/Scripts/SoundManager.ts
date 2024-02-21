import { _decorator, AudioClip, AudioSource, CCBoolean, Component, director, Node } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property(AudioClip) public audioList: AudioClip[] = [];
    @property(CCBoolean) public isVolume: boolean = true;

    //#region: "singleton"
    public static Instance: SoundManager;
    protected onLoad(): void {
        if (SoundManager.Instance == null) {
            SoundManager.Instance = this;
            //this.isVolume = true;
            director.addPersistRootNode(this.node);
        }
        director.loadScene("Menu");

    }
    //#endregion



    public ClickSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[0], 1);
    }
    public LoseSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[1], 1);
    }
    public FireSound(): void {
        let nodeAudio = new Node();
        let audioManager = nodeAudio.addComponent(AudioSource)

        if (!this.isVolume) return;
        audioManager.loop = false;
        audioManager.playOneShot(this.audioList[2], 1);
        console.log("soundfire" + audioManager.playOneShot(this.audioList[2], 1));

    }
    public WinSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[3], 1);
    }
    public ColisionSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[4], 1);
    }
    public EatScore(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[5], 1);
    }

    public ButtonSound() {
        if (this.isVolume) {
            console.log("offSound");
            this.isVolume = false;
            AudioManager.instance.pause();
        } else {
            console.log("onSound");
            this.isVolume = true;
            AudioManager.instance.resume();
        }
    }

}


