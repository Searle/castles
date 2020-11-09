import * as React from "react";
import { useMeasure } from "react-use";
import { Castles } from "./Castles";

export default function App() {
    const [app, { width, height }] = useMeasure<HTMLDivElement>();
    return (
        <div className="App" ref={app}>
            <Castles width={width} height={height} />
        </div>
    );
}
