import * as React from "react";
import { useRef, FC } from "react";
import { makeScene } from "./scene";
import { makeEnv } from "./env";

interface CastlesProps {
    width: number;
    height: number;
}

export const Castles: FC<CastlesProps> = ({ width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const canvasEl = canvasRef.current;
        if (canvasEl === null) {
            return;
        }
        const ctx = canvasEl?.getContext("2d");
        if (ctx === null) {
            return;
        }
        const env = makeEnv(ctx, width, height);
        makeScene(env);
    }, [width, height]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ width, height }} />;
};
