import { Env } from "./env";
import { makeLine, makeLines } from "./line";

const makeRoof = (env: Env, rx0: number, rx1: number, ry: number) => {
    const { left, right, top } = env;
    const y0 = top(ry);
    const y1 = top(ry - 1);
    const y2 = top(ry - 2);
    const x0 = left(rx0 - 1);
    const x1 = right(rx1 + 1);
    const xres = left(rx0) - x0;
    const width = x1 - x0;
    makeLines(env, left(rx0), y0, x0, y0, (x0 + x1) / 2, top(ry) - width, x1, y0, x1, y0, right(rx1), y0);
};

const makeCrenels = (env: Env, rx0: number, rx1: number, ry: number) => {
    const { left, right, top } = env;
    const y0 = top(ry);
    const y1 = top(ry - 1);
    const y2 = top(ry - 2);
    const x0 = left(rx0 - 1);
    const x1 = right(rx1 + 1);
    const xres = left(rx0) - x0;
    const width = x1 - x0;
    const crenels = Math.floor((width + xres) / (xres * 2));
    if (crenels) {
        makeLines(env, left(rx0), y0, x0, y0);
        const crenels2 = crenels * 2;
        const crenelX = Array<number>(crenels2);
        for (let i = 0; i < crenels2; i++) {
            crenelX[i] = x0 + (width * i) / (crenels2 - 1);
        }
        for (let i = 0; i < crenels2 - 1; i += 2) {
            makeLines(env, crenelX[i], y1, crenelX[i], y2, crenelX[i + 1], y2, crenelX[i + 1], y1);
        }
        makeLines(env, x1, y0, right(rx1), y0);
    }
};

const makeCastlePart = (env: Env, rx0: number, rx1: number, ry0: number, ry1: number, mayHaveRoof: boolean) => {
    const { ctx, random, left, right, top, bottom } = env;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    const y1 = bottom(ry1 || 9999);
    const y0 = top(ry0);
    if (mayHaveRoof && random() < 0.5) {
        makeRoof(env, rx0, rx1, ry0);
    } else {
        makeCrenels(env, rx0, rx1, ry0);
    }
    env.flushLines();
    makeLine(env, left(rx0), y1, left(rx0), y0);
    makeLine(env, left(rx0), y0, right(rx1), y0);
    makeLine(env, right(rx1), y0, right(rx1), y1);
    env.flushLines();
};

export const makeCastle = (env: Env, rx0: number, rx1: number, ry0: number, ry1 = 0, mayHaveRoof = false) => {
    const { random, r, rmin } = env;
    if (rx1 === 0) {
        rx1 = rx0 + r(40 + random() * 60);
    }
    const width = Math.floor(((1 + random()) * (rx1 - rx0)) / 2.5);
    if (width > 3 && width < rx1 - rx0 - rmin(10, 1)) {
        const rx = (rx1 + rx0) / 2;
        const ry_ = ry0 - rmin(30 + random() * 20, 2);
        makeCastle(env, rx - width / 2, rx + width / 2, ry_, ry0, true);
        mayHaveRoof = false;
    }
    makeCastlePart(env, rx0, rx1 - 1, ry0, ry1, mayHaveRoof);
    return rx1 - rx0;
};
