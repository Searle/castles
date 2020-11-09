import * as React from "react";
import { useEffect, useRef, FC } from "react";
import { useRafLoop, useUpdate } from "react-use";
import { createUseStyles } from "react-jss";

import { makeScene } from "./scene";
import { makeEnv } from "./env";

// @see: https://github.com/streamich/react-use/tree/master/docs

interface CastlesProps {
    width: number;
    height: number;
}

export const Castles: FC<CastlesProps> = ({ width, height }) => {
    const classes = useStyles(); // eslint-disable-line @typescript-eslint/no-use-before-define
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [ticks, setTicks] = React.useState(0);
    const [lastCall, setLastCall] = React.useState(0);
    const update = useUpdate();

    useEffect(() => {
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

    /*
    const [loopStop, loopStart, isActive] = useRafLoop((time) => {
        setTicks((ticks) => ticks + 1);
        setLastCall(time);
    });
    const ui = (
        <div className={classes.ui}>
            <div>RAF triggered: {ticks} (times)</div>
            <div>Last high res timestamp: {lastCall}</div>
            <button
                onClick={() => {
                    isActive() ? loopStop() : loopStart();
                    update();
                }}
            >
                {isActive() ? "STOP" : "START"}
            </button>
        </div>
    );
*/
    return (
        <div className={classes.root}>
            <canvas ref={canvasRef} width={width} height={height} style={{ width, height }} />;
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        position: "relative",
    },
    ui: {
        position: "absolute",
    },
});
