export type constructable = { new(...args: any[]): {} }
export type renderable = HTMLElement | DocumentFragment
export interface canBeProxy {
    isProxy?: boolean
}