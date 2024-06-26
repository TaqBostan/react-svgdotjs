import React, { FC, useRef } from 'react';
import { SvgContainer } from './index';
import { useSvg, useSvgWithCleanup, svgUpdate, useSvgContainer } from './hook';
import { Svg } from '@svgdotjs/svg.js';

const img1 = 'https://svgjs.dev/docs/3.0/assets/images/logo-svg-js-01d-128.png';
const img2 = 'https://en.systemgroup.net/wp-content/themes/sg/dist/images/logo.png';

export const SvgContainerPrimary: FC = () => {

  const [color, setColor] = React.useState("red");
  const [x, setX] = React.useState(0);
  const [img, setImg] = React.useState(img1);
  const { setHandles, svgContainer } = useSvgContainer();

  useSvgWithCleanup(svgContainer, svg => {
    let _img = svg.image(img, ev => {
      svg.size(500, 300);
    })
    return svg => { svg.clear(); }
  }, [img]);

  const onload = (svg: Svg, container: HTMLDivElement) => {
    // svg.image(img1, ev => {
    //   svg.size(500, 600);
    // })
    svg.size(500, 600);
  }

  useSvg(svgContainer, svg => {
    let r = svg.rect(100, 100).fill(color).move(0, 130);
    return [r];
  }, [color]);

  useSvg(svgContainer, svg => {
    let c = svg.circle(10).fill('red').move(110 + x, 240 + x);
    return [c];
  }, [x]);

  let extraDraw = svgUpdate(svgContainer, svg => {
    svg.circle(10).fill(color).move(130, 270);
  });

  // const extraDraw = () => {
  //   let svg = svgContainer!.svg;
  //   svg.circle(10).fill(color).move(130, 270);
  // }

  return (
    <div className="App">
      <div>
        <p>Parent</p>
        <button onClick={() => setColor("#ccc")}>Change color</button>
        <button onClick={() => setX(10)}>Change x</button>
        <button onClick={extraDraw}>Extra draw</button>
        <button onClick={() => setImg(img2)}>Change image</button>
      </div>

      <SvgContainer setHandles={setHandles} width='500px' height='600px' onload={onload} />
    </div>
  );
}