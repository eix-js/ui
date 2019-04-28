import { changeHandler } from "../src/handler"
import { Subject } from "rxjs";
import { random } from "./utils/random.util";
import { expect } from "chai"
import { isProxyKey } from "../src/keys";

describe("Change handler", () => {
    it("should detect changes on an array", () => {
        //create subject
        const emitter = new Subject<any>()
        emitter.next(0)

        let recived = 0

        const minimumRandomValue = 10

        //count changes
        emitter.pipe().subscribe({
            next: () => recived++,
            complete: () => {
                //should be bigger than the minimum random value
                expect(times, "the number of emitted values should be bigger than the min rand val")
                    .to.be.above(minimumRandomValue - 1)

                //compare times with the actual count
                expect(times, "the number of emitted values should be equal to the times we modified the object")
                    .to.be.equal(recived)
            }
        })

        //create proxy
        const target = [...Array(random(10, 100))].map(_ => random(0, 100))
        const wall = new Proxy(target, changeHandler(emitter))

        //modify the target n times
        const times = random(minimumRandomValue, 100)

        for (let i = 0; i < times; i++)
            wall[random(0, target.length)] = random(1, 100)

        //finish subject
        emitter.complete()
    })

    it("should respond true on .isProxy", () => {
        //create new emitter
        const emitter = new Subject<any>()

        //create new proxy
        const target = {
            [isProxyKey]: false
        }
        const wall = new Proxy(target, changeHandler(emitter))

        //should override the object
        expect(wall[isProxyKey], "isProxy should be always true").to.be.true
    })

    it("should serve proxies for nested objects", () => {
        //create emitter
        const emitter = new Subject<any>()

        //generate random number
        const depth = random(10, 50)

        //create target ft nested objects
        const target: any = {}
        let last = target

        //nest objects
        for (let i = 0; i < depth; i++) {
            //create child object
            last.child = {
                [isProxyKey]: false
            }

            //update last
            last = last.child
        }

        //create proxy
        const wall = new Proxy(target, changeHandler(emitter))

        //reset last
        last = wall

        //assert every layer
        while (true) {
            //only do this if there is a child
            if (last.child) {
                //assert
                expect(last.child[isProxyKey], "isProxy should be true").to.be.true

                //update last
                last = last.child
            }

            else return
        }
    })
})