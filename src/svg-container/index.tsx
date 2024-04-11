import React, { useRef, useEffect, useMemo, CSSProperties } from 'react';
import { SVG, Svg } from "@svgdotjs/svg.js";
import { SvgContainerHandles } from './hook';

const SvgContainer = (props: SvgContainerProps) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const svg = useMemo(() => SVG(), []);

  useEffect(() => {
    if (wrapper && wrapper.current) {
      if (wrapper.current.children.length === 0) {
        svg.addTo(wrapper.current).size('100%', '100%');
        props.setHandles({ svg, container: wrapper.current });
        props.onload?.(svg, wrapper.current);
      }
    }
    return () => { svg.clear(); }
  }, [wrapper, svg]);

  const style: CSSProperties = {
  };
  if (props.margin) style.margin = props.margin;
  if (props.height) style.height = props.height;
  if (props.width) style.width = props.width;

  return <div ref={wrapper} style={style} />;
}

export interface SvgContainerProps {
  height?: string;
  width?: string;
  margin?: string;
  onload?: (svg: Svg, container: HTMLDivElement) => void;
  setHandles: (handles: SvgContainerHandles) => void;
}

export { SvgContainer };