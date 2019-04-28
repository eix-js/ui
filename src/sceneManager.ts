import { Singleton } from "@eix/utils";
import { isScene } from "./interfaces";
import { sceneEmitter } from "./keys";
import { isString } from "util";
import { debugKey } from "@eix/utils"

@Singleton
export class SceneManager {
    [debugKey]: boolean

    scenes: {
        [key: string]: any & isScene
    } = {}

    constructor(debug = false) { 
        //save debug mode
        this[debugKey] = debug
    }

    /**
     * adds a scene
     * @param name the name of the new scene
     * @param scene the scene instance
     */
    addScene(name: string, scene: any & Partial<isScene>) {
        this.scenes[name] = scene
    }

    /**
     * switches from a scene to another
     * @param name the name of the new scene
     * @param oldName the name of the old scene
     */
    switch(name?: string, oldName?: string) {
        //emit events
        if (name && this.scenes[name])
            this.scenes[name][sceneEmitter].next(true)
        if (oldName && this.scenes[oldName])
            this.scenes[oldName][sceneEmitter].next(false)
    }
}