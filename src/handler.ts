import { Subject } from "rxjs";
import { isProxy } from "./interfaces";
import { isProxyKey } from "./keys";

export const changeHandler = <T>(emitter: Subject<T>) => ({
    get(target: T & isProxy, key: keyof T): any {
        //handle proxies
        if (key == isProxyKey)
            return true

        //handle objects
        //if the object isnt a proxy, just create a new one
        if (typeof target[key] == "object" && !(target[key] as any).isProxy)
            return new Proxy(target[key] as Object, changeHandler(emitter))

        //else return result
        return target[key]
    },
    set(target: T, key: keyof T, value: any): boolean {
        //handle objects (by making proxied out of them)
        if (typeof value == "object" && !value.isProxy)
            target[key] = new Proxy(value, changeHandler(emitter))
        else
            target[key] = value

        //just return the data and emt the change
        emitter.next(target)

        return true
    }
})