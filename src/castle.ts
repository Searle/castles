import { Env } from "./env";
import { makeLine, makeLines } from "./line";

const makeRoof = (env: Env, rx0: number, rx1: number, ry: number) => {
    const { left, right, top } = env;
    const y0 = top(ry);
    const x0 = left(rx0 - 1);
    const x1 = right(rx1 + 1);
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

const makeWindows = (env: Env, rx0: number, rx1: number, ry0: number, ry1: number) => {
    const { random, left, right, top, bottom } = env;

    // FIXME: Bessere Y-Plazierung wenn kein Platz
    // TODO: Mehrere Reihen
    const y0 = top(ry0) + random() * 5;
    const y1 = bottom(ry1);
    if (y0 + 20 < y1) {
        return;
    }
    const x0 = left(rx0);
    const x1 = right(rx1);
    const xres = left(rx0 + 1) - x0;
    const yres = top(ry0 + 1) - y0;
    const width = x1 - x0;
    const windows = Math.floor(width / (xres * 3));
    if (windows) {
        for (let i = 0.5; i < windows; i++) {
            if (random() < 0.1) {
                continue;
            }
            const wx = x0 + (width * i) / windows;
            const wy0 = top(ry0 + 3);
            const wx0 = wx - xres * 0.3;
            const wx1 = wx + xres * 0.3;
            if (random() < 0.5) {
                const wy1 = wy0 - yres;
                const wy2 = wy0 - yres * 1.4;
                makeLines(env, wx0, wy0, wx0, wy1, wx, wy2, wx1, wy1, wx1, wy0, wx0, wy0);
            } else {
                makeLines(env, wx0, wy0 - yres * 0.7, wx1, wy0 - yres * 0.7);
                env.flushLines();
                makeLines(env, wx, wy0 - yres * 1.3, wx, wy0 - yres * 0.1);
            }
            env.flushLines();
        }
    }
};

const makeCastlePart = (env: Env, rx0: number, rx1: number, ry0: number, ry1: number, mayHaveRoof: boolean) => {
    const { ctx, random, left, right, top, bottom } = env;

    const color = 255 - Math.floor(random() * 35);
    const greyColor = "rgb(" + color + "," + color + "," + color + ")";
    const redColor = "rgb(255," + (color - 50) + "," + (color - 50) + ")";
    ctx.fillStyle = greyColor;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.1;

    const y1 = bottom(ry1 || 9999);
    const y0 = top(ry0);
    if (mayHaveRoof && random() < 0.5) {
        ctx.fillStyle = redColor;
        makeRoof(env, rx0, rx1, ry0);
    } else {
        makeCrenels(env, rx0, rx1, ry0);
    }
    env.flushLines();

    ctx.fillStyle = greyColor;
    makeLine(env, left(rx0), y1, left(rx0), y0);
    makeLine(env, left(rx0), y0, right(rx1), y0);
    makeLine(env, right(rx1), y0, right(rx1), y1);
    env.flushLines();

    makeWindows(env, rx0, rx1, ry0, ry1);
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
