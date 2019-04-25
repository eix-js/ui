# Ui
Ui system for the eix game engine

# Getting started

To get started, first install @eix/ui with 
```
npm i <the url of this repo>
```
You also need to include `"experimentalDecorators": true` in your tsconfig.json.

Usually, you will use this with a renderer (eg: lit-html - i rly need to make a repo for this). A renderer is a function wich takes in a template and a parent.

First you need to declare your templates (eg: in lit-html, its TemplateResult, but here it's just a plain string):
```ts
export type templateResult = string
```

And then you can declare your renderer:
```ts
export const demoRenderer = (template:templateResult, parent: HTMLElement) => {
    parent.innerHTML = template
}
```

After that, a scene can ba a plain class:
```ts
export class DemoScene {
    count = 0

    constructor () { }
}
```

To render the scene, you need an activation function, wich takes in the instance of the scene and maps it to a template:

```ts
export const activationFunction = ({count}:DemoScene):templateResult => 
    `<h1>${count}</h1>`
```

After that, you can finally decorate the class:
```ts
import { Portal } from "@eix/ui"

export class DemoScene {
    @Portal<
        number, //the type of the prop
        templateResult //the type of the template
    >(
        document.body, //parent
        activationFunction, //maps target to template
        demoRenderer //renders to the dom
    )
    count = 0
}
```

When you create a new instance, the renderer will automatically render your scene:
```ts
const instance = new DemoScene() // 0 will be displayed in the body
```

You can disable rendering:
```ts
setInterval(() => {
    instance.render = !instance.render
},3000)

setInterval(() => {
    instance.count++ //every 3 seconds thil will stop showing up in the dom, and then reappear 3 seconds later
},1000)
```

Because of the way typescript evaluates decorators, when you first create an instance of the class, the render property won't be defined, so the only way to stop rendering is by passing the 4th argument to Portal:

```ts
export class DemoScene {
    @Portal<
        number, //the type of the prop
        templateResult //the type of the template
    >(
        document.body, //parent
        activationFunction, //maps target to template
        demoRenderer, //renders to the dom
        false //don't render on create
    )
    count = 0
}
```


The Portal decorator also has a debug mode (false by default) wich can be activated by passing true as the last argument of Portal:

```ts
export class DemoScene {
    @Portal<
        number, //the type of the prop
        templateResult //the type of the template
    >(
        document.body, //parent
        activationFunction, //maps target to template
        demoRenderer, //renders to the dom
        false, //don't render on create
        true //debug mode
    )
    count = 0
}
```

This will let you acces the changeCount method of instances (you should probably declare it for typescript to shut up):
```ts
export class DemoScene {
    @Portal<
        number, //the type of the prop
        templateResult //the type of the template
    >(
        document.body, //parent
        activationFunction, //maps target to template
        demoRenderer, //renders to the dom
        false, //don't render on create
        true //debug mode
    )
    count = 0

    changeCount: (key:string) => number //debug mode only
}
```

The method returns the number of times the value of the prop changed (on initialisation, it becomes one)

```ts
instance.changeCount("count") // 1
instance.count++ // increase prop
instance.changeCount("count") // 2
```

# Playing with the source:
Run `npm test` to run test and `npm run build` to build/







