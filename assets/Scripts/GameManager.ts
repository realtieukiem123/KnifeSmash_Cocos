import { _decorator, Button, CCFloat, CCInteger, Component, director, find, instantiate, Label, math, Node, Prefab, randomRange, Sprite, SpriteFrame, sys } from 'cc';
import { Knife } from './Knife';
import { Circle } from './Circle';
import { OutCircle } from './OutCircle';
import { LOCAL_STORAGE } from './Menu';
import { SoundManager } from './SoundManager';
import { GameFirebase } from './GameFirebase';
import { GameAds } from './GameAds';
const { ccclass, property } = _decorator;
const { randomRangeInt } = math;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Button) button: Button | null = null;
    @property(Node) public nodeKnife: Node;
    @property(Prefab) prefabKnife: Prefab;
    @property(Circle) scriptCircle: Circle;
    @property(OutCircle) scriptOutCircle: OutCircle;
    //@property(Label) numKnifeText: Label;
    @property(Node) listKnifeNode: Node[] = [];
    @property(Label) numScoreInGame: Label;
    @property(Label) roundText: Label;
    @property(SpriteFrame) listSpriteKnife: SpriteFrame[] = [];
    @property(SpriteFrame) listSpriteCircle: SpriteFrame[] = [];
    //@property(Node) listKnifeNode: Node[] = [];
    public isLose: boolean = false;
    public isPress: boolean = false;
    public gameDone: boolean = false;
    //@property public Score: number = 0;
    public typeKnife: number;
    public typeMap: number;
    //------------------------------UI----------------------------
    @property(Node) winNode: Node;
    @property(Node) loseNode: Node;
    @property(SpriteFrame) btSoundSprite: SpriteFrame[] = [];
    //@property(Sprite) soundSprite: Sprite;
    @property(Label) scoreLoseText: Label;
    @property(Label) scoreWinText: Label;
    //------------------------------CONFIG----------------------------
    @property(CCFloat) speedKnife: number;
    @property(CCFloat) speedVibra: number;
    @property(CCInteger) numMap: number;
    @property(CCInteger) numKnife: number;




    //-------------------------------------------------------------
    //#region: "singleton"
    public static Instance: GameManager;
    protected onLoad(): void {
        GameManager.Instance = this

    }
    //#endregion

    protected start(): void {
        //random
        this.typeKnife = randomRangeInt(0, 5);
        this.typeMap = randomRangeInt(0, 5);

        this.resetRound()
        this.button.node.on(Button.EventType.CLICK, this.moveKnife, this);
        //check sound
        if (SoundManager.Instance.isVolume) {
            find("Canvas/UI/ButtonSound").getComponent(Sprite).spriteFrame = this.btSoundSprite[1];
        } else {
            find("Canvas/UI/ButtonSound").getComponent(Sprite).spriteFrame = this.btSoundSprite[0];
        }

        //inter
        GameAds.instance.showInterstitalAds('inter', () => {
            try {
                console.log('inter');
                GameFirebase.instance.sendAdsInter();

            } catch (error) {
                console.log("error asd firebase")
            }


        })
    }

    resetRound() {
        //this.numKnife = 6;
        if (this.numMap == 1) {
            console.log("numap");
            sys.localStorage.setItem(LOCAL_STORAGE.Knife_Score, 0);
            //this.Score = 0;

        }
        //sys.localStorage.setItem(LOCAL_STORAGE.Knife_Score, this.Score);

        for (let i = 0; i < this.numKnife; i++) {
            this.listKnifeNode[i].active = true;
        }

        this.numScoreInGame.string = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score).toString();
        this.SpawnKnife();
        this.winNode.active = false;

        this.isLose = false;
        this.isPress = false;
        //this.numKnifeText.string = this.numKnife.toString();
        this.roundText.string = this.numMap.toString();


    }

    moveKnife(button: Button) {
        if (this.isLose || this.isPress || this.numKnife < 1) return;

        try {
            //Audio
            SoundManager.Instance.FireSound();
        } catch (error) {

        }



        this.numKnife--;
        this.listKnifeNode[this.numKnife].active = false;
        this.isPress = true;

        this.nodeKnife.getComponent(Knife).isMove = true;
        this.nodeKnife.getComponent(Knife).FireKinfe();

        this.scheduleOnce(function () {
            this.InstantiateKnife();
        }, 0.125);

    }

    public InstantiateKnife() {
        if (this.isLose || this.numKnife < 1) return;


        this.SpawnKnife();

        this.isPress = false;
    }
    SpawnKnife() {
        let knife = instantiate(this.prefabKnife);
        knife.parent = director.getScene().getChildByName("Canvas").getChildByName("KnifeSpawn");
        knife.setPosition(0, -500, 0);
        this.nodeKnife = knife;
        //this.listKnifeNode.pu
    }
    public PlusScore() {
        //console.log("congdiem");

        let scores = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score);
        sys.localStorage.setItem(LOCAL_STORAGE.Knife_Score, scores + "1");

        this.numScoreInGame.string = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score).toString();
    }

    public LoseUI() {
        this.isLose = true;
        // //Audio
        SoundManager.Instance.ColisionSound();
        this.scheduleOnce(function () {
            //Audio
            SoundManager.Instance.LoseSound();
            this.loseNode.active = true;
            this.scoreLoseText.string = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score).toString();
        }, 1);

        //firebase
        try {
            GameFirebase.instance.sendLevelLose(this.numMap);
        } catch (error) {
            console.log("error firebase")
        }


    }

    //-------BUTTON-----------
    public NextButton() {
        //SoundManager.Instance.ClickSound();
        if (this.numMap == 12) {
            director.loadScene("Menu");
        } else {
            director.loadScene("Round" + (this.numMap + 1))
            //this.resetRound();  
        }

    }
    public HomeButton() {
        //SoundManager.Instance.ClickSound();

        director.loadScene("Menu");
    }
    public ButtonSound() {
        SoundManager.Instance.ButtonSound();

        if (SoundManager.Instance.isVolume) {
            find("Canvas/UI/ButtonSound").getComponent(Sprite).spriteFrame = this.btSoundSprite[1];
            //SoundManager.Instance.ClickSound();
        } else {
            find("Canvas/UI/ButtonSound").getComponent(Sprite).spriteFrame = this.btSoundSprite[0];
        }
    }

}






