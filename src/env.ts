import { Point } from "./types";

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
const xoshiro128ss = (a: number, b: number, c: number, d: number) => {
    console.log("SEED", a);
    return () => {
        var t = b << 9,
            r = a * 5;
        r = ((r << 7) | (r >>> 25)) * 9; // eslint-disable-line no-mixed-operators
        c ^= a;
        d ^= b;
        b ^= c;
        a ^= d;
        c ^= t;
        d = (d << 11) | (d >>> 21); // eslint-disable-line no-mixed-operators
        return (r >>> 0) / 4294967296;
    };
};

export const makeEnv = (ctx: CanvasRenderingContext2D, height: number, RES = 8) => {
    let offsetY = 0;
    let points: Point[] = [];
    const random = xoshiro128ss(Date.now(), 2600980751997770790, 3131701164191746090, -3375623441569470803);
    return {
        ctx,
        r: (value: number) => Math.floor(value / RES),
        rmin: (value: number, min: number) => {
            value = Math.floor(value / RES);
            return value < min ? min : value;
        },
        top: (value: number) => value * RES + offsetY,
        bottom: (value: number) => Math.min(value * RES + offsetY, height),
        left: (value: number) => value * RES,
        right: (value: number) => value * RES + RES / 2,
        setOddY: (oddY: boolean) => (offsetY = oddY ? RES / 2 : 0),
        random,
        addPoint: (point: Point) => {
            if (points.length && points[points.length - 1].x === point.x && points[points.length - 1].y === point.y) {
                return;
            }
            points.push(point);
        },
        flushLines: () => {
            if (points.length) {
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
