import React, { FC, useRef, useEffect, useLayoutEffect, useMemo, CSSProperties } from 'react';
import { SVG, Svg, Element } from "@svgdotjs/svg.js";

interface SvgContainerProps {
  height?: string;
  width?: string;
  margin?: string;
  onload?: (svg: Svg) => void;
}

export type Ref = {
  svg: Svg,
  container: HTMLDivElement | null
} | null;

const SvgContainer = React.forwardRef<Ref, SvgContainerProps>(
  ({ height, width, margin, onload }, ref) => {
    const wrapper = useRef<HTMLDivElement>(null);
    const svg = useMemo(() => SVG(), []);

    React.useImperativeHandle(ref, () => ({
      svg: svg,
      container: wrapper.current,
    }));

    useEffect(() => {
      if (wrapper && wrapper.current) {
        if (wrapper.current.children.length === 0)
          svg.addTo(wrapper.current).size('100%', '100%');
        else if (onload) onload(svg);
      }
      return () => { svg.clear(); }
    }, [wrapper, svg]);

    const style: CSSProperties = {
    };
    if(margin) style.margin = margin;
    if(height) style.height = height;
    if(width) style.width = width;

    return <div ref={wrapper} style={style} />;
  }
);

export default SvgContainer;

export const useSvg = (
  comp: any,
  effect: (svg: Svg) => Element[],
  deps: any[]
) => {
  const callbackRef = useRef(effect);

  useLayoutEffect(() => {
    callbackRef.current = effect;
  }, [effect]);

  useEffect(() => {
    let objs: Element[] = [];
    let current = callbackRef.current;
    if (current) objs = current(comp.current.svg) || [];
    return () => objs.forEach((obj) => obj.remove());
  }, [...deps, comp]);
};

export const svgUpdate = (
  comp: any,
  effect: (svg: Svg) => void
) => () => effect(comp.current.svg);

export const useSvgWithCleanup = (
  comp: any,
  effect: (svg: Svg) => ((svg: Svg) => void) | void,
  deps: any[]
) => {
  const callbackRef = useRef(effect);

  useLayoutEffect(() => {
    callbackRef.current = effect;
  }, [effect]);

  useEffect(() => {
    let current = callbackRef.current;
    let ret: any;
    let compCurrent: any = comp.current;
    if (current) ret = current(compCurrent.svg);
    return () => {
      if (compCurrent) {
        if (ret) ret(compCurrent.svg);
        else compCurrent.svg.clear();
      }
    };
  }, [...deps, comp]);
};