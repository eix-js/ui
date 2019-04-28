import { expect } from "chai"
import { Scene } from "../src/scene"
import jsdom from "jsdom";
import { random } from "./utils/random.util";
import { ScenePortal, renderKey } from "../src/main";
import { SceneManager } from "../src/sceneManager"
import { Test } from "mocha";
import { sceneData } from "../src/interfaces";

const { JSDOM } = jsdom;
const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
        <head></head>
        <body></body>
    </html>
`);

//@ts-ignore
global.document = dom.window.document

describe("Scene", () => {
    it("should render on change", () => {
        //create test class
        @Scene({
            template: (target) => target.prop,
            render: (target: string, parent) => {
                parent.innerHTML = target
            },
            name: "testName"
        })
        class TestScene {
            @ScenePortal<number>()
            prop = 0

            constructor() { }
        }

        //create instance
        const instance = new TestScene()

        //generate random number 
        const num = random(10, 100)

        //set prop
        instance.prop = num

        //check dom
        const result = document.getElementsByClassName("testName")[0].innerHTML

        //assert 
        expect(result, "the dom should be updated")
            .to.be.equal(instance.prop.toString())
    })

    it("should not render when the render prop is false", () => {
        //create test class
        @Scene({
            template: (target) => target.prop,
            render: (target: string, parent) => {
                parent.innerHTML = target
            },
            name: "testName"
        })
        class TestScene {
            [renderKey] = false

            @ScenePortal<number>()
            prop = 0

            constructor() { }
        }

        //create instance
        const instance = new TestScene()

        //generate random number 
        const num = random(10, 100)

        //set prop
        instance.prop = num

        //check dom
        const result = document.getElementsByClassName("testName")[0].innerHTML

        //assert 
        expect(result, "the dom shouldnt be updated")
            .not.to.be.equal(instance.prop.toString())
    })

    it("should work with plugins",() => {
        //create manager
        const manager = new SceneManager(true)

        //create test class
        @Scene({
            template: (target) => target.prop,
            render: (target: string, parent) => {
                parent.innerHTML = target
            },
            name: "testName",
            plugins: [{
                events: {
                    start: (value:boolean,data:sceneData) => {
                        expect(value).to.be.true

                        //assert sceneData
                        expect(data.name).to.be.equal("testName")
                    },
                    stop: (value:boolean) => {
                        expect(value).to.be.false
                    }
                }
            }]
        })
        class TestScene {
            [renderKey] = false

            @ScenePortal<number>()
            prop = 0

            constructor() { }
        }

        //create instance
        const instance = new TestScene()

        //add instance
        manager.addScene("testScene",instance)

        //trigger events
        manager.switch("testScene","testScene")
    })
})

