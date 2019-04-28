import { Subject } from "rxjs"
import { canBeProxy, renderable } from "./interfaces";
import { changeHandler } from "./handler";
import { scenePortalsKey } from "./keys";

//TODO: remove debug (maybe?)
export function ScenePortal<T>() {

    //make the actual value of the property secret
    let secret: T

    //used to update the secret
    const changeEmitter = new Subject<T>()

    return (target: any, key: string | number) => {
        //add the emitter to the subject array
        if (target[scenePortalsKey])
            target[scenePortalsKey].push(changeEmitter)
        else
            target[scenePortalsKey] = [changeEmitter]

        //getter only reveals secret
        const getter = () => secret

        //setter updates he secret and the html.
        const setter = (next: T) => {
            //save result for emiting
            let result: T

            //check if the value is an object
            if (typeof next == "object")
                //@ts-ignore
                result = new Proxy(next as Object, changeHandler<T>(changeEmitter))
            else
                result = next //set secret to the value provided

            secret = result

            //do something with the event
            changeEmitter.next(result)
        };

        //add the property to the target
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true, //!i have no idea what the last 2 do xd
            configurable: true
        });

        //start by setting the secret value the old value of the key
        secret = target[key]
    }
} 