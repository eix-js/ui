import { expect } from "chai"
import { Scene } from "../src/scene"
import jsdom from "jsdom";
import { random } from "./utils/random.util";
import { ScenePortal } from "../src/main";

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
})

