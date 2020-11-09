import * as React from "react";
import { useEffect, useRef, useState, FC } from "react";
import { useRafLoop, useUpdate } from "react-use";
import { createUseStyles } from "react-jss";

import { makeScene } from "./scene";
import { makeEnv } from "./env";
import { Layers } from "./types";

// @see: https://github.com/streamich/react-use/tree/master/docs

interface CastlesProps {
    width: number;
    height: number;
}

export const Castles: FC<CastlesProps> = ({ width, height }) => {
    const classes = useStyles(); // eslint-disable-line @typescript-eslint/no-use-before-define
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);

    const [ticks, setTicks] = React.useState(0);
    const [lastCall, setLastCall] = React.useState(0);
    const update = useUpdate();

    const [layers, setLayers] = useState<Layers>([]);
    const [stageX, setStageX] = useState(0);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (canvasEl === null) {
            return;
        }
        if (width > 0 && height > 0) {
            console.log("WH changed:", width, height);
            const env = makeEnv(canvasEl, width, height);
            setLayers(makeScene(env));
        }
    }, [width, height]);

    useEffect(() => {
        const itemsEl = itemsRef.current;
        if (itemsEl === null) {
            return;
        }
        itemsEl.textContent = "";
        console.log(stageX);
        layers.forEach((layer, layerIndex) => {
            layer.items.forEach((item) => {
                item.canvas.className = "layerItem";
                itemsEl.appendChild(item.canvas);
                const x = item.x - (stageX % 100) * (1 + layerIndex / 3);
                item.canvas.style.transform = "translate(" + x + "px," + item.y + "px)";
            });
        });
    }, [stageX, layers]);

    const [loopStop, loopStart, isActive] = useRafLoop((time) => {
        setTicks((ticks) => ticks + 1);
        setLastCall(time);

        setStageX(stageX + 1);
    }, false);
    const ui = (
        <div className={classes.ui}>
            <div>RAF triggered: {ticks} (times)</div>
            <div>Last high res timestamp: {lastCall}</div>
            <button
                onClick={() => {
                    if (isActive()) loopStop();
                    else loopStart();
                    update();
                }}
            >
                {isActive() ? "STOP" : "START"}
            </button>
        </div>
    );

    return (
        <div className={classes.root}>
            {ui}
            <div className={classes.layers} ref={itemsRef} />
            <canvas ref={canvasRef} width={width} height={height} style={{ width, height }} />
        </div>
    );
};

const useStyles = createUseStyles({
    root: {
        position: "relative",
    },
    layers: {
        zIndex: 1,
        position: "absolute",
        "& .layerItem": {
            position: "absolute",
        },
    },
    ui: {
        zIndex: 2,
        position: "absolute",
    },
});
