import { Svg, Element } from "@svgdotjs/svg.js";
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

export const useSvgContainer = () => {
  const [handles, setHandles] = useState<SvgContainerHandles>();
  return { setHandles, svgContainer: handles };
};

export type SvgContainerHandles = {
  svg: Svg;
  container: HTMLDivElement;
}


export const useSvg = (
  container: SvgContainerHandles | undefined,
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
    if (current && container) objs = current(container.svg) || [];
    return () => objs.forEach((obj) => obj.remove());
  }, [...deps, container]);
};

export const svgUpdate = (
  container: SvgContainerHandles | undefined,
  effect: (svg: Svg) => void
) => () => effect(container!.svg);

export const useSvgWithCleanup = (
  container: SvgContainerHandles | undefined,
  effect: (svg: Svg) => ((svg: Svg) => void),
  deps: any[]
) => {
  const callbackRef = useRef(effect);

  useLayoutEffect(() => {
    callbackRef.current = effect;
  }, [effect]);

  useEffect(() => {
    let current = callbackRef.current;
    let ret: ((svg: Svg) => void);
    if (current && container) ret = current(container.svg);
    return () => {
      if (container) {
        if (ret) ret(container.svg);
        else container.svg.clear();
      }
    };
  }, [...deps, container]);
};