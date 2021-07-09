import config from "../../../../config";
import { ReactMapbox } from "../../../../lib/react-mapbox/components/ReactMapbox";
import { changeGameMap } from "../../store";

export function GameMap() {
    return (
        <ReactMapbox
            onLoad={changeGameMap}
            rotateTouchMove={true}
            zoom={config().DEFAULT_ZOOM}
            pitch={50}
            style="mapbox://styles/jeckyhit/ckqipy8cj2cr417qsyeijp03b"
            // onClicks={[
            //     ['building', (e) => console.log(e.features)]
            // ]}
            // onClicks={[
            //     [e => console.log(e.features)]
            // ]}
            interactive={false}
        />
    )
}