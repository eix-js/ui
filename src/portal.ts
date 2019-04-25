import { Subject } from "rxjs"
import { canBeProxy, renderable } from "./interfaces";
import { changeHandler } from "./handler";

//TODO: remove debug (maybe?)
export function Portal<T, K>(parent: renderable,
    creation: (target: any) => K,
    activation: (template: K, parent: renderable) => any,
    initialRender = true,
    debug = false) {

    //make the actual value of the property secret
    let secret: T

    //used to update the secret
    const changeEmitter = new Subject<T>()

    //used for debuggin only
    let changeCount = 0

    //used to render/ not render the initial state
    let firstTime = true

    return (target: any, key: string | number) => {
        //!for debug only
        if (debug) {
            //save old
            const old = target.changeCount || ((): null => null)

            //create new method
            const newMethod = (name: string) => {
                if (name == key)
                    return changeCount

                //else return the old one
                return old(...arguments)
            }

            //update it
            target.changeCount = newMethod
        }

        //handle getters and setters
        //subscribe to the subject
        changeEmitter.subscribe(next => {
            //update secret
            secret = next


            //only do the following if in debug mode
            if (debug)
                changeCount++


            //only do this is render is true
            if ((initialRender || !firstTime) &&
                ((typeof target.render === "boolean") ? target.render : true))
                //render 
                activation(creation(target), parent)

            //toggle firstTime
            firstTime = false
        })

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

        //set render on target
        if (!(typeof target.render === "boolean"))
            target.render = true
    }
}