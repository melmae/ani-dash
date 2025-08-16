declare module 'react-grid-layout' {
  import * as React from 'react';

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }

  export interface Layouts {
    [breakpoint: string]: Layout[];
  }

  export interface ResponsiveProps {
    className?: string;
    layouts?: Layouts;
    breakpoints?: Record<string, number>;
    cols?: Record<string, number>;
    rowHeight?: number;
    margin?: [number, number];
    containerPadding?: [number, number];
    draggableHandle?: string;
    isResizable?: boolean;
    isDraggable?: boolean;
    measureBeforeMount?: boolean;
    onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
    onResizeStop?: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
    onDragStop?: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
    children?: React.ReactNode;
  }

  export const Responsive: React.ComponentType<ResponsiveProps>;
  export function WidthProvider<T>(component: React.ComponentType<T>): React.ComponentType<T>;
}


