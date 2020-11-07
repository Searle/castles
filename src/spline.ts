import { Point } from "./types";
import { Env } from "./env";

export const makeSpline = (env: Env, points: Point[], resolution = 1000, tension = 0.85) => {
    const pointsCount = points.length;
    if (pointsCount < 3) {
        return;
    }

    const centers = [];
    const controls: Array<Point[]> = [];
    for (let i = 0; i < pointsCount - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        centers.push({
            x: (p0.x + p1.x) / 2,
            y: (p0.y + p1.y) / 2,
        });
    }
    controls.push([points[0], points[0]]);
    for (let i = 0; i < centers.length - 1; i++) {
        const c0 = centers[i];
        const c1 = centers[i + 1];
        const p1 = points[i + 1];
        const dx = p1.x - (c0.x + c1.x) / 2;
        const dy = p1.y - (c0.y + c1.y) / 2;
        controls.push([
            {
                x: (1 - tension) * p1.x + tension * (c0.x + dx),
                y: (1 - tension) * p1.y + tension * (c0.y + dy),
            },
            {
                x: (1 - tension) * p1.x + tension * (c1.x + dx),
                y: (1 - tension) * p1.y + tension * (c1.y + dy),
            },
        ]);
    }
    controls.push([points[pointsCount - 1], points[pointsCount - 1]]);

    const B = function (t: number) {
        const t2 = t * t;
        const t3 = t2 * t;
        const ti = 1 - t;
        return [t3, 3 * t2 * ti, 3 * t * ti * ti, ti * ti * ti];
    };

    const bezier = (t: number, p1: Point, c1: Point, c2: Point, p2: Point): Point => {
        const b = B(t);
        return {
            x: p2.x * b[0] + c2.x * b[1] + c1.x * b[2] + p1.x * b[3],
            y: p2.y * b[0] + c2.y * b[1] + c1.y * b[2] + p1.y * b[3],
        };
    };

    const pos = (t: number): Point => {
        if (t < 0) t = 0;
        if (t > resolution) t = resolution - 1;

        const t2 = t / resolution;
        if (t2 >= 1) return points[pointsCount - 1];

        const n = Math.floor((points.length - 1) * t2);
        const t1 = (pointsCount - 1) * t2 - n;

        return bezier(t1, points[n], controls[n][1], controls[n + 1][0], points[n + 1]);
    };

    const { addPoint } = env;
    for (let i = 0; i < resolution; i++) {
        addPoint(pos(i));
    }
};
