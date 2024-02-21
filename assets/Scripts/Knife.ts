import { _decorator, BoxCollider2D, Button, CCBoolean, Collider2D, Component, Contact2DType, director, ERigidBody2DType, find, IPhysics2DContact, math, Node, PhysicsSystem2D, RigidBody2D, Sprite, SpriteFrame, sys, Tween, tween, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { LOCAL_STORAGE } from './Menu';
import { SoundManager } from './SoundManager';
import { GameFirebase } from './GameFirebase';
const { ccclass, property } = _decorator;

@ccclass('Knife')
export class Knife extends Component {
    @property(CCBoolean) public isMove: boolean = false;
    @property(CCBoolean) public isInCircle: boolean = false;
    @property(Sprite) public spriteKinfe: Sprite;

    protected start(): void {
        //change skin
        let numknife = GameManager.Instance.typeKnife;
        this.spriteKinfe.spriteFrame = GameManager.Instance.listSpriteKnife[numknife];

        GameManager.Instance.nodeKnife = this.node;
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

    }


    // protected update(dt: number): void {
    //     if (this.isMove) {
    //         this.node.setPosition(this.node.position.x, this.node.getPosition().y += GameManager.Instance.speedKnife * dt);
    //     }
    // }

    public FireKinfe() {
        tween(this.node)
            .to(0.11, { position: new Vec3(this.node.position.x, -40, 0) }, {
                easing: "smooth",
                onComplete: (target?: object) => {

                    // this.node.destroy();
                    // with circle
                    // selfCollider.node.getComponent(RigidBody2D).enabledContactListener = false;


                    let scores = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score);
                    scores++;
                    sys.localStorage.setItem(LOCAL_STORAGE.Knife_Score, scores);
        
                    GameManager.Instance.numScoreInGame.string = scores.toString();
                    this.node.getComponent(Knife).isInCircle = true;
                    this.node.getComponent(Knife).isMove = false;

                    this.node.setParent(find("Canvas/OutCircle/Circle/AllKnife"), true);
                    //selfCollider.node.getComponent(RigidBody2D).enabled = false;


                    GameManager.Instance.scriptOutCircle.vibrateNode(GameManager.Instance.speedVibra);

                    if (GameManager.Instance.numKnife < 1 && !GameManager.Instance.isLose) {
                        GameManager.Instance.gameDone = true;
                        this.scheduleOnce(function () {
                            if (GameManager.Instance.isLose) return;
                            console.log("win");
                            //Audio
                            SoundManager.Instance.WinSound();
                            GameManager.Instance.scoreWinText.string = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score).toString();
                            GameManager.Instance.winNode.active = true;
                            //GameManager.Instance.NextButton();

                            //firebase
                            try {
                                GameFirebase.instance.sendNextLevel(GameManager.Instance.numMap + 1);
                            } catch (error) {
                                console.log("error firebase")
                            }

                        }, 0.15);


                    }


                },
            })
            .start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact
        if (GameManager.Instance.isLose) return;


        if (otherCollider.tag == 3) {
            //with score
            if (otherCollider == null) return;
            otherCollider.node.getChildByName("Sprite").active = false;
            otherCollider.node.getComponent(BoxCollider2D).enabled = false;

            //Audio
            SoundManager.Instance.EatScore();
            //Plus Score
            let scores = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score);
            scores++;
            scores++;
            sys.localStorage.setItem(LOCAL_STORAGE.Knife_Score, scores);
            GameManager.Instance.numScoreInGame.string = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score).toString();

        }

        if (this.isInCircle) return;
        if (otherCollider == null) return;

        if (otherCollider.tag == 1 && otherCollider.node.getComponent(Knife).isInCircle) {
            //with knife
            console.log("lose");

            // //Audio
            // SoundManager.Instance.LoseSound();

            Tween.stopAll();
            GameManager.Instance.LoseUI();

            tween(this.node)
                .to(0.5, { position: new Vec3(0, -1000, 0) }, {
                    easing: "smooth",
                    onComplete: (target?: object) => {
                        this.node.destroy();

                    },
                })
                .start();


        } else if (otherCollider.tag == 2) {
            //with trap
            console.log("lose");



            Tween.stopAll();
            GameManager.Instance.LoseUI();
            tween(this.node)
                .to(0.5, { position: new Vec3(0, -1000, 0) }, {
                    easing: "smooth",
                    onComplete: (target?: object) => {
                        this.node.destroy();

                    },
                })
                .start();

        }
        else if (otherCollider.tag == 0 && !GameManager.Instance.isLose && !GameManager.Instance.gameDone) {
            //Audio
            //SoundManager.Instance.ColisionSound();

            //Plus Score
            //GameManager.Instance.Score++;
            let scores = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score);
            scores++;
            sys.localStorage.setItem(LOCAL_STORAGE.Knife_Score, scores);

            GameManager.Instance.numScoreInGame.string = scores.toString();
            //with circle
            //selfCollider.node.getComponent(RigidBody2D).enabledContactListener = false;
            selfCollider.node.getComponent(Knife).isInCircle = true;
            selfCollider.node.getComponent(Knife).isMove = false;

            selfCollider.node.setParent(otherCollider.node.getChildByName("AllKnife"), false);
            //selfCollider.node.getComponent(RigidBody2D).enabled = false;


            GameManager.Instance.scriptOutCircle.vibrateNode(GameManager.Instance.speedVibra);

            if (GameManager.Instance.numKnife < 1 && !GameManager.Instance.isLose) {
                GameManager.Instance.gameDone = true;
                this.scheduleOnce(function () {
                    if (GameManager.Instance.isLose) return;
                    console.log("win");
                    //Audio
                    SoundManager.Instance.WinSound();
                    GameManager.Instance.scoreWinText.string = sys.localStorage.getItem(LOCAL_STORAGE.Knife_Score).toString();
                    GameManager.Instance.winNode.active = true;
                    //GameManager.Instance.NextButton();

                    //firebase
                    try {
                        GameFirebase.instance.sendNextLevel(GameManager.Instance.numMap + 1);
                    } catch (error) {
                        console.log("error firebase")
                    }

                }, 0.15);


            }
        }
    }

}


