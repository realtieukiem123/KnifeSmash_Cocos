import { _decorator, Component, director, math, Node, randomRange, Sprite, tween } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;
const { randomRangeInt } = math;

@ccclass('Circle')
export class Circle extends Component {
    @property(Node) nodeSpriteCircle: Node;

    protected start(): void {


        this.onFit();
        this.scheduleOnce(function () {
            //change skin
            let numC = GameManager.Instance.typeMap;
            this.nodeSpriteCircle.getComponent(Sprite).spriteFrame = GameManager.Instance.listSpriteCircle[numC];

        }, 0.01);

    }

    protected update(dt: number): void {
        //this.RotateCircle();
    }



    // RotateCircle() {
    //     this.node.rotation = 90
    // }

    onFit() {
        let r = 0;
        let currentAngle = 0;
        let diffAngle = 0;
        let timeRd = 0;

        if (GameManager.Instance.numMap == 1) {
            r -= 360;
            diffAngle = r;
            timeRd = 3;
        } else if (GameManager.Instance.numMap == 2) {
            r += 360;
            diffAngle = r;
            timeRd = 3;
        } else {
            //let r = Math.round(Math.random() * 360 - 180);
            r = Math.round(Math.random() * 720);
            //let r = 0;
            currentAngle = this.node.angle;

            diffAngle = r - currentAngle;
            timeRd = randomRange(1.5, 4);
            // if (diffAngle >= 360) {
            //     diffAngle -= 360;
            // }
            // if (diffAngle <= -360) {
            //     diffAngle += 360;
            // }
        }


        tween(this.node)
            .by(timeRd, { angle: diffAngle })
            //.delay(0.1)
            .call(() => {
                this.onFit();
            })
            .start();
    }

    // public SetSprite() {
    //     console.log("omg");
    //     this.nodeSpriteCircle.parent = director.getScene().getChildByName("Canvas").getChildByName("OutCircle").getChildByName("Circle");
    //     //this.addChild(this.nodeSpriteCircle.getComponent(Sprite), -1)
    // }
}


