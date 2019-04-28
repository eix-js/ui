import { Portal } from "../src/portal"
import { expect } from "chai"
import jsdom from "jsdom";
import { random } from "./utils/random.util";

const template = ({ count }: { count: number }) => `${count}`

const { JSDOM } = jsdom;
const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
        <head></head>
        <body></body>
    </html>
`);

function render(template: string, parent: HTMLElement) {
    parent.innerHTML = template
}

function TestPortal<T>(template: (target: any) => string, initialRender = true) {
    //clear the html
    dom.window.document.body.innerHTML = ""

    //return the portal
    return Portal<T, string>(dom.window.document.body, template, render, initialRender, true)
}

describe("Portal", () => {
    it("should render to the dom", () => {
        const template = ({ count }: TestScene) => `${count}`

        class TestScene {
            @TestPortal(template)
            count = 0
        }

        //generate random number
        const num = random(1, 100)

        //create instance
        const testInstance = new TestScene()

        //increase the count
        testInstance.count = num

        //get the result
        const result = dom.window.document.body.innerHTML

        //compare the html
        expect(result, "result should be equal to the count").to.be.equal(num.toString())
    })

    it("should work on arrays", () => {
        const template = ({ counts }: TestScene) => `${JSON.stringify(counts)}`

        const length = random(10, 1000)

        class TestScene {
            @TestPortal<string[]>(template)
            counts = [...Array(length)].map(_ => random(10, 500))
        }

        //create instance
        const testInstance = new TestScene()

        //increase the count
        testInstance.counts[random(0, length)] += random(1, 100)

        //get the result
        const result = dom.window.document.body.innerHTML

        //compare the html
        expect(result, "result should be equal to the counts array").to.be
            .equal(JSON.stringify(testInstance.counts))
    })

    it("shouldn't render when render = false", () => {
        const template = ({ count }: TestScene) => `${count}`

        class TestScene {
            //render should be false
            render = false

            @TestPortal<number>(template, false)
            count = 0
        }

        //save it for asserting
        const initialText = "hello world"

        //set initial text
        dom.window.document.body.innerHTML = initialText

        //create instance of the scene
        const testInstance = new TestScene()

        //get the result
        const result = dom.window.document.body.innerHTML

        //compare the html
        expect(result, "result should be the same as before creating the nstance").to.be
            .equal(initialText)

        expect(result, "result should be different from the count").to.not.be
            .equal(testInstance.count)
    })

    it("should count changes in debug mode", () => {
        const template = ({ count }: TestScene) => `${count}`

        //clear the html
        dom.window.document.body.innerHTML = ""

        class TestScene {
            @Portal<number, string>(dom.window.document.body, template, render, true, true)
            count = 0

            changeCount: (key: string) => number
        }

        //generate random number
        const num = random(10, 100)

        //create instance
        const testInstance = new TestScene()

        for (let i = 0; i < num; i++)
            testInstance.count = i

        //get the result
        const result = testInstance.changeCount("count")

        //compare the html
        expect(result, "it shouldve changed <num> times").to.be.equal(num + 1)
    })

})