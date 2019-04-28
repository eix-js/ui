import { decorable } from "@eix/utils"
import { Subject } from "rxjs";
import { SceneOptions } from "./interfaces";
import { scenePortalsKey, sceneEmitter } from "./keys";
import { switchMap } from "rxjs/operators"

//unique ids for the div names
let lastId = 0

export function Scene<T>(options: SceneOptions<T>) {
    //subject for changes
    const emitter = new Subject()

    //choose name for scene
    const name = options.name || lastId++

    //create parent
    const parent = document.createElement("div")
    parent.className = name.toString()

    //add parent to body
    document.body.appendChild(parent)

    return <T extends decorable>(target: T) => {
        return class extends target {
            [scenePortalsKey]: Subject<any>[]
            [sceneEmitter] = new Subject<boolean>()

            constructor(...args: any[]) {
                super(...args)

                if (this[scenePortalsKey])
                    //subscribe to all portals
                    this[scenePortalsKey].forEach(subject => {
                        subject.subscribe(value => {
                            emitter.next(value)
                        })
                    })

                // subscribe to emitter
                emitter.subscribe(() => {
                    //render
                    options.render(options.template(this), parent)
                })
            }
        }
    }
}