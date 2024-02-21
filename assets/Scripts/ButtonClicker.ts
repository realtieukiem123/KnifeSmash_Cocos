import { _decorator, Button, Component, Input, Node } from 'cc';
import { SoundManager } from './SoundManager';
import { GameAds } from './GameAds';
import { GameFirebase } from './GameFirebase';
const { ccclass, property } = _decorator;

@ccclass('ButtonClicker')
export class ButtonClicker extends Component {

    start() {
        this.node.getComponent(Button).node.on(Input.EventType.TOUCH_START, this.ClickButton, this);
    }

    ClickButton() {
        console.log("Clicker");
        SoundManager.Instance.ClickSound();

        // //inter
        // GameAds.instance.showInterstitalAds('inter', () => {
        //     try {
        //         console.log('inter');
        //         GameFirebase.instance.sendAdsInter();

        //     } catch (error) {
        //         console.log("error asd firebase")
        //     }


        // })
    }
}


