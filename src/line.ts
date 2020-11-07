import { Env } from "./env";
import { Point } from "./types";
import { makeSpline } from "./spline";

export const makeLine = (env: Env, x0: number, y0: number, x1: number, y1: number) => {
    const { random, addPoint } = env;
    const dy = y1 - y0;
    const dx = x1 - x0;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len <= 20) {
        addPoint({ x: x0, y: y0 });
        addPoint({ x: x1, y: y1 });
        return;
    }
    const resolution = Math.pow(len, 0.8);
    const angle = Math.atan2(dx, dy);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const points: Point[] = [];
    for (let i = 0, jitter = 0; ; i += resolution + 0.15) {
        if (i + resolution * 0.5 >= len) {
            jitter = 0;
            i = len;
        }
        const x = x0 + sin * i + cos * jitter;
        const y = y0 + cos * i - sin * jitter;
        points.push({ x, y });
        jitter = random() * 4 - 2;
        if (i >= len) {
            break;
        }
    }
    makeSpline(env, points, resolution);
};

export const makeLines = (env: Env, ...xy: number[]) => {
    const { random } = env;
    for (let i = 1; i < xy.length - 1; i++) {
        xy[i] += random() * 1.5 - 0.75;
    }
    for (let i = 0; i < xy.length - 3; i += 2) {
        makeLine(env, xy[i], xy[i + 1], xy[i + 2], xy[i + 3]);
    }
};
