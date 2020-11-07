import * as React from "react";
import { useRef } from "react";
import { makeScene } from "./scene";
import { makeEnv } from "./env";
import "./styles.css";

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        console.log("CHANGE!");
        const canvasEl = canvasRef.current;
        if (canvasEl === null) {
            return;
        }
        const ctx = canvasEl?.getContext("2d");
        if (ctx === null) {
            return;
        }
        const env = makeEnv(ctx, canvasEl.height);
        makeScene(env, canvasEl.width, canvasEl.height);
    }, []);

    return (
        <div className="App">
            <canvas ref={canvasRef} width="700" height="500" style={{ backgroundColor: "orange" }} />
        </div>
    );
}
