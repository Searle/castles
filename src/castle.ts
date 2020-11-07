import { Env } from "./env";
import { makeLine, makeLines } from "./line";

const makeCastleTop = (env: Env, rx0: number, rx1: number, ry: number) => {
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

const makeCastlePart = (env: Env, rx0: number, rx1: number, ry: number) => {
    const { ctx, left, right, top, bottom } = env;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    const bottomY = bottom(9999);
    const y = top(ry);
    makeLine(env, left(rx0), bottomY, left(rx0), y);
    makeCastleTop(env, rx0, rx1, ry);
    makeLine(env, right(rx1), y, right(rx1), bottomY);
    env.flushLines();
    makeLine(env, left(rx0), y, right(rx1), y);
    env.flushLines();
    //xxxxx
};

export const makeCastle = (env: Env, rx0: number, rx1: number, ry: number) => {
    const { random, r, rmin } = env;
    if (rx1 === 0) {
        rx1 = rx0 + r(40 + random() * 41);
    }
    const width = Math.floor(((1 + random()) * (rx1 - rx0)) / 2.5);
    if (width > 3 && width < rx1 - rx0 - rmin(10, 1)) {
        const rx = (rx1 + rx0) / 2;
        const ry1 = ry - rmin(20 + random() * 20, 2);
        makeCastle(env, rx - width / 2, rx + width / 2, ry1);
    }
    makeCastlePart(env, rx0, rx1 - 1, ry);
    return rx1 - rx0;
};
