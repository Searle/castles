import { makeCastle } from "./castle";
import { Env, makeEnv } from "./env";
import { Layers, Layer } from "./types";

const makeSky = (env: Env) => {
    const { withCtx, sceneWidth, sceneHeight } = env;
    withCtx((ctx) => {
        ctx.beginPath();
        ctx.fillStyle = "#87cefa";
        ctx.fillRect(0, 0, sceneWidth, sceneHeight);
    });
};

const makeSun = (env: Env) => {
    const { withCtx, sceneWidth } = env;
    withCtx((ctx) => {
        const x = sceneWidth / 4;
        const y = 50;
        const r = 40;

        const addCircle = (dx: number, dy: number, dr: number) => {
            ctx.beginPath();
            ctx.strokeStyle = "#f9d71c";
            ctx.arc(x + dx, y + dy, r + dr, 0, 2 * Math.PI);
            ctx.stroke();
        };

        ctx.beginPath();
        ctx.fillStyle = "#f9d71c";
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        addCircle(-10, 5, 2);
        addCircle(-5, -2, 2);
        addCircle(+4, 2, 2);
    });
};

const makeLand = (env: Env) => {
    const { withCtx, sceneWidth, sceneHeight } = env;
    withCtx((ctx) => {
        ctx.beginPath();
        ctx.fillStyle = "#6fad43";
        ctx.strokeStyle = "#388004";
        const y = (sceneHeight * 3) / 4;
        ctx.fillRect(0, y, sceneWidth, sceneHeight);
        ctx.moveTo(0, y);
        ctx.lineTo(sceneWidth, y);
        ctx.stroke();
    });
};

export const makeScene = (env: Env) => {
    const { r, random, left, top, sceneWidth, sceneHeight } = env;
    makeSky(env);
    makeSun(env);
    makeLand(env);

    const single = !!0; // for Debugging
    const time = Date.now();

    const makerCanvas = document.createElement("canvas");
    makerCanvas.width = sceneWidth;
    makerCanvas.height = sceneHeight + env.resolution;
    const makerEnv = makeEnv(makerCanvas, sceneWidth, sceneHeight);

    var layers: Layers = [];

    let ry = r(180);
    let offsetY = 0;
    let oddY = false;
    while (ry < r(sceneHeight)) {
        const rx0 = r(-80 + random() * 80);
        let rx = rx0;
        if (single) rx = 40;
        makerEnv.setOddY(oddY);
        const layer: Layer = {
            items: [],
            width: 0,
        };
        while (rx < r(sceneWidth * 2 + 200)) {
            const ry_ = ry - r(random() * (25 + offsetY / 2));
            const castle = makeCastle(makerEnv, ry_);
            layer.items.push({
                canvas: castle.canvas,
                x: left(rx) + castle.x,
                y: top(ry_) + castle.y,
                width: castle.width,
                height: castle.height,
            });
            rx += r(castle.castleWidth + random() * 80);
            layer.width = left(rx - rx0);
            if (single) break;
        }
        layers.push(layer);
        if (single) break;
        ry += r(40 + offsetY + random() * 40);
        offsetY += 15;
        oddY = !oddY;
    }
    console.log("makeScene:", Date.now() - time, "ms");
    return layers;
};
