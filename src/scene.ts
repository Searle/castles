import { makeCastle } from "./castle";
import { Env, makeEnv } from "./env";
import { Layers, Layer } from "./types";

const makeSky = (env: Env) => {
    const { withCtx, sceneWidth, sceneHeight } = env;
    withCtx((ctx) => {
        ctx.beginPath();
        ctx.fillStyle = "#87cefa";
        ctx.fillRect(0, 0, sceneWidth, sceneHeight);
        ctx.closePath();
    });
};

const makeSun = (env: Env) => {
    const { withCtx, sceneWidth } = env;
    const x = sceneWidth / 4;
    const y = 50;
    const r = 40;
    withCtx((ctx) => {
        ctx.beginPath();
        ctx.fillStyle = "#f9d71c";
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    });

    const addCircle = (dx: number, dy: number, dr: number) =>
        withCtx((ctx) => {
            ctx.beginPath();
            ctx.strokeStyle = "#f9d71c";
            ctx.arc(x + dx, y + dy, r + dr, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        });

    addCircle(-10, 5, 2);
    addCircle(-5, -2, 2);
    addCircle(+4, 2, 2);
};

export const makeScene = (env: Env) => {
    const { withCtx, r, random, left, top, sceneWidth, sceneHeight } = env;
    makeSky(env);
    makeSun(env);

    const single = !!0;
    const time = Date.now();

    const makerCanvas = document.createElement("canvas");
    makerCanvas.width = sceneWidth;
    makerCanvas.height = sceneHeight;
    const makerEnv = makeEnv(makerCanvas, sceneWidth, sceneHeight);

    var layers: Layers = [];

    let ry = r(180);
    let offsetY = 0;
    let oddY = false;
    while (ry < r(sceneHeight)) {
        let rx = r(-80 + random() * 80);
        if (single) rx = 40;
        makerEnv.setOddY(oddY);
        const layer: Layer = {
            items: [],
        };
        while (rx < r(sceneWidth + 200)) {
            const ry_ = ry - r(random() * (25 + offsetY / 2));
            const castle = makeCastle(makerEnv, ry_);

            layer.items.push({
                canvas: castle.canvas,
                x: left(rx) + castle.x,
                y: top(ry_) + castle.y,
                width: castle.width,
                height: castle.height,
            });
            if (false)
                withCtx((ctx) => {
                    ctx.beginPath();
                    ctx.strokeStyle = "#F00";
                    ctx.lineWidth = 1;
                    ctx.moveTo(0, top(ry_));
                    ctx.lineTo(1000, top(ry_));
                    ctx.closePath();
                    ctx.stroke();
                });
            /*                
            withCtx((ctx) =>
                ctx.drawImage(
                    castle.canvas,
                    0,
                    0,
                    castle.width,
                    castle.height,
                    left(rx) + castle.x,
                    top(ry_) + castle.y,
                    castle.width,
                    castle.height,
                ),
            );
*/

            rx += r(castle.width + 10 + random() * 60);
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
