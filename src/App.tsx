import * as React from "react";
import useSize from "@react-hook/size";
import { Castles } from "./Castles";

export default function App() {
    const app = React.useRef(null);
    const [width, height] = useSize(app);
    return (
        <div className="App" ref={app}>
            <Castles width={width} height={height} />
        </div>
    );
}
