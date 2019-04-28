import { scenePortalsKey, isProxyKey, isSceneKey, sceneEmitter } from "./keys";
import { Subject } from "rxjs";

export type constructable = { new(...args: any[]): {} }
export type renderable = HTMLElement | DocumentFragment
export interface canBeProxy {
    isProxy?: boolean
}

export interface SceneOptions<T> {
    template: (target: any) => T
    render: (template: T, parent: HTMLElement) => any
    name?: string
}

export interface isScene {
    [isSceneKey]: true
    [sceneEmitter]: Subject<boolean>
}

export interface isProxy {
    [isProxyKey]: true
}