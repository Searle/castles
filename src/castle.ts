import { Env } from "./env";
import { makeSpline, Point } from "./spline";

const makeLine = (env: Env, x0: number, y0: number, x1: number, y1: number) => {
    const { ctx, random } = env;
    const dy = y1 - y0;
    const dx = x1 - x0;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len <= 20) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        return;
    }
    const resolution = Math.pow(len, 0.8);
    const angle = Math.atan2(dx, dy);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const points: Point[] = [];
    for (let i = 0, jitter = 0; ; i += resolution + 0.15) {
        if (i >= len) {
            jitter = 0;
            i = len;
        }
        const x = x0 + sin * i + cos * jitter;
        const y = y0 + cos * i - sin * jitter;
        points.push({ x, y });
        jitter = random() * 6 - 3;
        if (i >= len) {
            break;
        }
    }
    makeSpline({ points, resolution }).draw(ctx);
};

const makeCastlePart = (env: Env, rx0: number, rx1: number, ry: number) => {
    const { ctx, left, right, top, bottom } = env;
    ctx.fillStyle = "white";
    ctx.fillRect(left(rx0), top(ry), right(rx1 - rx0) + 1, bottom(50));

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    //    ctx.strokeRect(left(x0), top(y), right(x1 - x0) + 1, bottom(50));

    const bottomY = bottom(9999);
    makeLine(env, left(rx0), top(ry), left(rx0), bottomY);
    makeLine(env, right(rx1), top(ry), right(rx1), bottomY);
    makeLine(env, left(rx0), top(ry), right(rx1), top(ry));
};

export const makeCastle = (env: Env, x0: number, x1: number, y: number) => {
    const { random, r, rmin } = env;
    if (x1 === 0) {
        x1 = x0 + r(40 + random() * 41);
    }
    const width = Math.floor(((1 + random()) * (x1 - x0)) / 2.5);
    if (width > 3 && width < x1 - x0 - rmin(10, 1)) {
        const x = (x1 + x0) / 2;
        const y1 = y - rmin(20 + random() * 20, 2);
        makeCastle(env, x - width / 2, x + width / 2, y1);
    }
    makeCastlePart(env, x0, x1 - 1, y);
    return x1 - x0;
};
