import { expect } from "chai"
import { SceneManager } from "../src/sceneManager";
import { Scene, sceneEmitter } from "../src/main";
import { random } from "./utils/random.util";
import { Subject } from "rxjs";

describe("SceneManager", () => {
    it("should allow adding scenes", () => {
        //create manager
        const manager = new SceneManager(true)

        //generate random number
        const num = random(10, 100)

        //create sample scene
        @Scene({
            template: (target: any) => target,
            render: () => { }
        })
        class TestScene {
            someprop = num

            constructor() { }
        }

        //create instance
        const instance = new TestScene()

        //add instance to manager
        manager.addScene("testScene", instance)

        //assert
        expect(manager.scenes.testScene.someprop, "it should now have the new scene")
            .to.be.equal(num)
    })

    it("should allow only swithing to one scene", () => {
        //create manager
        const manager = new SceneManager(true)

        //create sample scene
        @Scene({
            template: (target: any) => target,
            render: () => { }
        })
        class TestScene {
            [sceneEmitter]: Subject<boolean>

            constructor() { }
        }

        //create instance
        const instance = new TestScene()

        //add scene
        manager.addScene("0",instance)

        //subscribe to emitters
        instance[sceneEmitter].subscribe(value => 
            expect(value,"the emitted value should be true").to.be.true
        )

        //trigger switch
        manager.switch("0")
    })

    it("should emit events on scenes", () => {
        //create manager
        const manager = new SceneManager(true)

        //create sample scene
        @Scene({
            template: (target: any) => target,
            render: () => { }
        })
        class TestScene {
            [sceneEmitter]: Subject<boolean>

            constructor() { }
        }

        //create instance
        const instances = [...Array(2)].map(() => new TestScene())

        //add all instance
        instances.forEach((instance, index) => manager.addScene(`${index}`, instance))

        //subscribe to emitters
        instances[0][sceneEmitter].subscribe(value => 
            expect(value,"the emitted value should be true").to.be.true
        )
        instances[1][sceneEmitter].subscribe(value => 
            expect(value,"the emitted value should be false").to.be.false
        )

        //trigger switch
        manager.switch("0","1")
    })
})



