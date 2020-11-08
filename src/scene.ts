import { makeCastle } from "./castle";
import { Env } from "./env";

const makeSky = (env: Env) => {
    const { ctx, sceneWidth, sceneHeight } = env;
    ctx.beginPath();
    ctx.fillStyle = "#87cefa";
    ctx.fillRect(0, 0, sceneWidth, sceneHeight);
};

const makeSun = (env: Env) => {
    const { ctx, sceneWidth } = env;
    const x = sceneWidth / 4;
    const y = 50;
    const r = 40;
    ctx.beginPath();
    ctx.fillStyle = "#f9d71c";
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    const addCircle = (dx: number, dy: number, dr: number) => {
        ctx.beginPath();
        ctx.strokeStyle = "#f9d71c";
        ctx.arc(x + dx, y + dy, r + dr, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    };

    addCircle(-10, 5, 2);
    addCircle(-5, -2, 2);
    addCircle(+4, 2, 2);
};

export const makeScene = (env: Env) => {
    const { r, random, sceneWidth, sceneHeight } = env;
    makeSky(env);
    makeSun(env);

    const single = !!0;

    let y = r(180);
    let offsetY = 0;
    let oddY = false;
    while (y < r(sceneHeight)) {
        let x = r(-80 + random() * 80);
        if (single) x = 40;
        env.setOddY(oddY);
        while (x < sceneWidth) {
            const w = makeCastle(env, x, 0, y - r(random() * (25 + offsetY / 2)));
            x += w + r(10 + random() * 60);
            if (single) break;
        }
        if (single) break;
        y += r(40 + offsetY + random() * 40);
        offsetY += 15;
        oddY = !oddY;
    }
};
