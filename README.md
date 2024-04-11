A lightweight component to use [SVG.js](https://svgjs.dev/docs/3.1/) library in React. Custom hooks are provided for automatically re-rendering when the underlying data changes. Check out [the CodePen](https://codepen.io/Mohamad-Mehdi-Rajaei/pen/poBdRBO) for some examples.

## Getting started

Install `react-svgdotjs` using npm.

```shell
npm install react-svgdotjs
```

Then you can just import the component and its hook:

```js
import { SvgContainer, useSvgContainer } from 'react-svgdotjs';
```

and use it as below:

```js
const { setHandles, svgContainer } = useSvgContainer();
```

```js
<SvgContainer setHandles={setHandles} width='500px' height='600px' margin='0 auto' onload={onload}/>
```

`SvgContainer` is rendered as a `div` element with specified width, height, and margin. In `onload`, you can access the `svg` element inserted into the above container.

```js
const onload = (svg, container) => {
    // Set svg dimensions 
    svg.size(500, 600);
    // Add a 100x100 red rectangle
    svg.rect(100, 100).fill('red');
}
```

## On-demand changes

To add, remove, or change SVG elements in React event handlers, import and utilize `svgUpdate` hook like so:

```js
const clickHandler = svgUpdate(svgContainer, svg => {
    svg.circle(10).fill('red').move(130, 130);
});
```

```js
<button onClick={clickHandler}>Add a red circle</button>
```

Alternatively, you can access `svg` as below:

```js
const clickHandler = () => {
    let svg = svgContainer.svg;
    svg.circle(10).fill('red').move(130, 130);
}
```

## Custom hooks

The `onload` behavior prevents SVG from benefiting from seamless re-rendering when the underlying data changes. Some custom hooks are provided to address this problem.

### useSvg

Consider the `state` provided below:

```js
const [color, setColor] = React.useState("red");
```

Now, you can move the part of your code that contains states from `onload` to `useSvg`:

```js
import { SvgContainer, useSvgContainer, useSvg } from 'react-svgdotjs';
```

```js
const onload = (svg, container) => {
    // Set svg dimensions 
    svg.size(500, 600);
}

useSvg(svgContainer, svg => {
    // Add a 100x100 rectangle whose color may change!
    let rect = svg.rect(100, 100).fill(color);
    return [rect];
}, [color]);
```

Ensure to return an array containing the added elements. Whenever any of the dependencies undergo a change, the hook will `remove` them and re-execute the function. Within a component, you are allowed to include multiple `useSvg`s, each with its own set of dependencies.

### useSvgWithCleanup

When there is a need for running a function and specifying a cleanup function, you may opt to utilize `useSvgWithCleanup` hook. If no cleanup function is returned, it will proceed to execute `svg.clear()` by default instead.
```js
import { SvgContainer, useSvgContainer, useSvgWithCleanup } from 'react-svgdotjs';
```

```js
const imgUrl = 'https://svgjs.dev/docs/3.0/assets/images/logo-svg-js-01d-128.png';
const [img, setImg] = React.useState(imgUrl);

useSvgWithCleanup(svgContainer, svg => {
    let _img = svg.image(img, ev => {
        svg.size(500, 600);
    });
    return svg => { svg.clear(); }
}, [img]);
```

Within a component, you are allowed to include multiple `useSvgWithCleanup`s, each with its own set of dependencies.

## Contributing

- Fork the project.
- Make changes.
- Run the project in development mode: `npm run ladle`.
- Test your changes using `svg-container.stories.tsx` or your own Stories (`*.stories.tsx`).
- Update README with appropriate docs.
- Commit and PR

## Dependencies

The package is dependent on [`svgdotjs/svg.js`](https://www.npmjs.com/package/@svgdotjs/svg.js) which is automatically managed by NPM. The following peer dependencies must be specified by your project in order to avoid version conflicts:
[`react`](https://www.npmjs.com/package/react),
[`react-dom`](https://www.npmjs.com/package/react-dom).
NPM will not automatically install these for you but it will show you a warning message with instructions on how to install them.

