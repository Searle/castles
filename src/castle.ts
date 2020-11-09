import { Env } from "./env";
import { makeLine, makeLines } from "./line";

const makeExtent = (padding = 0) => {
    let x0 = 1;
    let x1 = 0;
    let y0 = 1;
    let y1 = 0;
    return {
        get x0() {
            return x0 - padding;
        },
        get y0() {
            return y0 - padding;
        },
        get x1() {
            return x1 + padding;
        },
        get y1() {
            return y1 + padding;
        },
        addRect: (newX0: number, newY0: number, newX1: number, newY1: number) => {
            if (newX0 > newX1) [newX0, newX1] = [newX1, newX0];
            if (newY0 > newY1) [newY0, newY1] = [newY1, newY0];
            if (x0 > x1) {
                x0 = newX0;
                y0 = newY0;
                x1 = newX1;
                y1 = newY1;
            } else {
                if (newX0 < x0) x0 = newX0;
                if (newX1 > x1) x1 = newX1;
                if (newY0 < y0) y0 = newY0;
                if (newY1 > y1) y1 = newY1;
            }
        },
    };
};

type Extent = ReturnType<typeof makeExtent>;

const makeRoof = (env: Env, extent: Extent, rx0: number, rx1: number, ry: number) => {
    const { left, right, top } = env;
    const y0 = top(ry);
    const x0 = left(rx0 - 1);
    const x1 = right(rx1 + 1);
    const width = x1 - x0;
    const y1 = top(ry) - width;
    extent.addRect(x0, y0, x1, y1);
    makeLines(env, left(rx0), y0, x0, y0, (x0 + x1) / 2, y1, x1, y0, x1, y0, right(rx1), y0);
};

const makeCrenels = (env: Env, extent: Extent, rx0: number, rx1: number, ry: number) => {
    const { left, right, top, resolution } = env;
    const y0 = top(ry);
    const y1 = top(ry - 1);
    const y2 = top(ry - 2);
    const x0 = left(rx0 - 1);
    const x1 = right(rx1 + 1);
    extent.addRect(x0, y0, x1, y2);
    const width = x1 - x0;
    const crenels = Math.floor((width + resolution) / (resolution * 2));
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
    const { random, left, right, top, bottom, resolution } = env;

    // FIXME: Bessere Y-Plazierung wenn kein Platz
    // TODO: Mehrere Reihen
    const y0 = top(ry0) + random() * 5;
    const y1 = bottom(ry1);
    if (y0 + 20 < y1) {
        return;
    }
    const x0 = left(rx0);
    const x1 = right(rx1);
    const width = x1 - x0;
    const windows = Math.floor(width / (resolution * 3));
    if (windows) {
        for (let i = 0.5; i < windows; i++) {
            if (random() < 0.1) {
                continue;
            }
            const wx = x0 + (width * i) / windows;
            const wy0 = top(ry0 + 3);
            const wx0 = wx - resolution * 0.3;
            const wx1 = wx + resolution * 0.3;
            if (random() < 0.5) {
                const wy1 = wy0 - resolution;
                const wy2 = wy0 - resolution * 1.4;
                makeLines(env, wx0, wy0, wx0, wy1, wx, wy2, wx1, wy1, wx1, wy0, wx0, wy0);
            } else {
                makeLines(env, wx0, wy0 - resolution * 0.7, wx1, wy0 - resolution * 0.7);
                env.flushLines();
                makeLines(env, wx, wy0 - resolution * 1.3, wx, wy0 - resolution * 0.1);
            }
            env.flushLines();
        }
    }
};

export const makeCastle = (env: Env, ry0: number) => {
    const { random, withCtx, r, left, right, top, canvas, sceneWidth } = env;

    const color = 255 - Math.floor(random() * 35);
    const greyColor = "rgb(" + color + "," + color + "," + color + ")";
    const redColor = "rgb(255," + (color - 50) + "," + (color - 50) + ")";

    const rx0 = 10;
    const extent = makeExtent(100);

    const makeCastlePart = (env: Env, rx0: number, rx1: number, ry0: number, ry1: number, mayHaveRoof: boolean) => {
        const { random, left, right, top, bottom } = env;

        if (mayHaveRoof && random() < 0.5) {
            withCtx((ctx) => (ctx.fillStyle = redColor));
            makeRoof(env, extent, rx0, rx1, ry0);
        } else {
            withCtx((ctx) => (ctx.fillStyle = greyColor));
            makeCrenels(env, extent, rx0, rx1, ry0);
        }
        env.flushLines();

        const x0 = left(rx0);
        const x1 = right(rx1);
        const y1 = bottom(ry1 || 1e9);
        const y0 = top(ry0);
        extent.addRect(x0, y0, x1, y1);
        withCtx((ctx) => (ctx.fillStyle = greyColor));
        makeLine(env, x0, y1, x0, y0);
        makeLine(env, x0, y0, x1, y0);
        makeLine(env, x1, y0, x1, y1);
        env.flushLines();

        makeWindows(env, rx0, rx1, ry0, ry1);
    };

    const makeCastle_ = (env: Env, rx0: number, rx1: number, ry0: number, ry1 = 0, mayHaveRoof: boolean) => {
        const { random, rmin } = env;
        const width = Math.floor(((1 + random()) * (rx1 - rx0)) / 2.5);
        if (width > 3 && width < rx1 - rx0 - rmin(10, 1)) {
            const rx = (rx1 + rx0) / 2;
            const ry_ = ry0 - rmin(30 + random() * 20, 2);
            makeCastle_(env, rx - width / 2, rx + width / 2, ry_, ry0, true);
            mayHaveRoof = false;
        }
        makeCastlePart(env, rx0, rx1 - 1, ry0, ry1, mayHaveRoof);
    };

    env.withCtx((ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.1;
    });

    const rx1 = rx0 + r(40 + random() * Math.max(60, Math.min(120, sceneWidth * 0.1)));
    makeCastle_(env, rx0, rx1, ry0, 0, false);

    const canvas1 = document.createElement("canvas");
    const canvas1Width = extent.x1 - extent.x0;
    const canvas1Height = extent.y1 - extent.y0;
    canvas1.width = canvas1Width;
    canvas1.height = canvas1Height;

    const ctx1 = canvas1.getContext("2d");
    if (ctx1 !== null) {
        ctx1.drawImage(canvas, extent.x0, extent.y0, canvas1Width, canvas1Height, 0, 0, canvas1Width, canvas1Height);
    }

    return {
        canvas: canvas1,
        x: extent.x0 - left(rx0),
        y: extent.y0 - top(ry0),
        castleWidth: right(rx1) - left(rx0),
        width: canvas1Width,
        height: canvas1Height,
    };
};

export type Castle = ReturnType<typeof makeCastle>;

export const makeCastleCanvas = (env: Env, rx0: number, rx1: number, ry0: number, ry1 = 0) => {};
