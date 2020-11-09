import { Point } from "./types";

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
const xoshiro128ss = (a: number, b: number, c: number, d: number) => {
    console.log("SEED", a);
    return () => {
        var t = b << 9,
            r = a * 5;
        r = ((r << 7) | (r >>> 25)) * 9;
        c ^= a;
        d ^= b;
        b ^= c;
        a ^= d;
        c ^= t;
        d = (d << 11) | (d >>> 21);
        return (r >>> 0) / 4294967296;
    };
};

export const makeEnv = (canvas: HTMLCanvasElement, width: number, height: number, resolution = 8) => {
    const ctx = canvas.getContext("2d");
    let offsetY = 0;
    let points: Point[] = [];
    const random = xoshiro128ss(Date.now(), 2600980751997770790, 3131701164191746090, -3375623441569470803);
    /// const random = xoshiro128ss(123000, 2600980751997770790, 3131701164191746090, -3375623441569470803);
    return {
        canvas,
        random,
        sceneWidth: width,
        sceneHeight: height,
        resolution,
        r: (value: number) => Math.floor(value / resolution),
        rmin: (value: number, min: number) => {
            value = Math.floor(value / resolution);
            return value < min ? min : value;
        },
        top: (value: number) => value * resolution + offsetY,
        bottom: (value: number) => Math.min(value * resolution + offsetY, height),
        left: (value: number) => value * resolution,
        right: (value: number) => value * resolution + resolution / 2,
        setOddY: (oddY: boolean) => (offsetY = oddY ? resolution / 2 : 0),
        addPoint: (point: Point) => {
            if (points.length && points[points.length - 1].x === point.x && points[points.length - 1].y === point.y) {
                return;
            }
            points.push(point);
        },
        withCtx: (handler: (ctx: CanvasRenderingContext2D) => void) => {
            if (ctx !== null) {
                handler(ctx);
                return true;
            }
            return false;
        },
        flushLines: () => {
            if (ctx !== null && points.length) {
                ctx.beginPath();
                ctx.moveTo(points[0]?.x, points[0]?.y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                if (points.length > 2) {
                    ctx.fill();
                }
                ctx.stroke();
                points.length = 0;
            }
        },
    };
};

export type Env = ReturnType<typeof makeEnv>;
