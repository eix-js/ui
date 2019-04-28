import { decorable } from "@eix/utils"
import { Subject } from "rxjs";
import { SceneOptions } from "./interfaces";
import { scenePortalsKey, sceneEmitter, renderKey, automaticRenderDisabling } from "./keys";
import { filter } from "rxjs/operators"

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
            [automaticRenderDisabling]: boolean
            [renderKey]: boolean
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
                emitter.pipe(filter(() =>
                    this[renderKey] !== false //dont render if render is set to false
                )).subscribe(() => {
                    //render
                    options.render(options.template(this), parent)
                })

                //subscribe to the scene events
                this[sceneEmitter].pipe(filter(() =>
                    this[automaticRenderDisabling] !== false //dont do it if <insert that long name here> is false
                )).subscribe((value) => {
                    this[renderKey] = value
                })

                //use plugins
                if (options.plugins) {
                    //info for plugins
                    const info = {
                        name, parent, emitter, target,
                        instance: this
                    }


                    this[sceneEmitter].subscribe(state => {
                        //get name
                        const eventName = state ? "start" : "stop"

                        //filter plugins
                        const plugins = options.plugins.filter(value =>
                            value.events[eventName]
                        )

                        //run them
                        plugins.forEach(func => func.events[eventName](state, info))
                    })
                }
            }
        }
    }
}