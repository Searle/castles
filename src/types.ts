export interface Point {
    x: number;
    y: number;
}

export interface LayerItem {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Layer {
    items: LayerItem[];
    width: number;
}

export type Layers = Layer[];
