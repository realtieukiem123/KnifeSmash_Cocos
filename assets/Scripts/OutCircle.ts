import { _decorator, Component, Node, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OutCircle')
export class OutCircle extends Component {


    public vibrateNode(yVibra : number) {

        tween(this.node)
            .to(0.1, { position: new Vec3(0, yVibra, 0) }, {
                easing: "backIn",
                onComplete: (target?: object) => {
                    this.node.position = new Vec3(0, 0, 0)
                },
            })
            .start();
    }
}


