import { _decorator, Component, director, Node, Sprite, SpriteFrame } from 'cc';
import { SoundManager } from './SoundManager';
import { GameAds } from './GameAds';
import { GameFirebase } from './GameFirebase';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {
    @property(SpriteFrame) public soundFrame: SpriteFrame[] = [];
    @property(Sprite) public soundSprite: Sprite;


    protected start(): void {
        //check sound
        if (SoundManager.Instance.isVolume) {
            this.soundSprite.spriteFrame = this.soundFrame[1];
        } else {
            this.soundSprite.spriteFrame = this.soundFrame[0];
        }

        try {
            //inter
            GameAds.instance.showInterstitalAds('inter', () => {
                console.log('inter');
                //firebase
                GameFirebase.instance.sendAdsInter();
            })
        } catch (error) {
            console.log("error ads firebase")
        }



    }
    public ButtonPlay() {
        //SoundManager.Instance.ClickSound();


        director.loadScene("Round1");
    }
    public ButtonSound() {
        SoundManager.Instance.ButtonSound();

        if (SoundManager.Instance.isVolume) {
            this.soundSprite.spriteFrame = this.soundFrame[1];
            //SoundManager.Instance.ClickSound();
        } else {
            this.soundSprite.spriteFrame = this.soundFrame[0];
        }


    }

}

export const LOCAL_STORAGE = {
    Knife_Score: "knife_Score",
}


