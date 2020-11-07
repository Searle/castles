import { makeCastle } from "./castle";
import { Env } from "./env";

export const makeScene = (env: Env, width: number, height: number) => {
    const { ctx, r, random } = env;
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, width, height);

    let y = r(180);
    let oddY = false;
    while (y < r(height)) {
        let x = r(-80 + random() * 80);
        //x = 40;
        env.setOddY(oddY);
        while (x < width) {
            const w = makeCastle(env, x, 0, y - r(random() * 25));
            x += w + r(10 + random() * 60);
            //  break;
        }
        //        break;
        y += r(30 + random() * 30);
        oddY = !oddY;
    }
};
