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
        if (width > 0 && height > 0) {
            console.log("WH changed:", width, height);
            const env = makeEnv(canvasEl, width, height);
            makeScene(env);
        }
    }, [width, height]);

    return <canvas ref={canvasRef} width={width} height={height} style={{ width, height }} />;
};
