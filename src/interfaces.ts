import { scenePortalsKey, isProxyKey, isSceneKey, sceneEmitter } from "./keys";
import { Subject } from "rxjs";

export type constructable = { new(...args: any[]): {} }
export type renderable = HTMLElement | DocumentFragment
export interface canBeProxy {
    isProxy?: boolean
}

export interface sceneData {
    name:string | number
    parent:HTMLElement
    emitter: Subject<any>
    target: any
    instance: any
}

export interface Plugin {
    events: {
        start: (value:boolean,data:sceneData) => any
        stop: (value:boolean,data:sceneData) => any
    }
}

export interface SceneOptions<T> {
    template: (target: any) => T
    render: (template: T, parent: HTMLElement) => any
    name?: string
    plugins?: Plugin[]
}

export interface isScene {
    [isSceneKey]: true
    [sceneEmitter]: Subject<boolean>
}

export interface isProxy {
    [isProxyKey]: true
}