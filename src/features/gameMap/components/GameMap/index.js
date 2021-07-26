import { useStore } from "effector-react";
import config from "../../../../config";
import { ReactMapbox } from "../../../../lib/react-mapbox/components/ReactMapbox";
import { $readyGeolocation, $smothCoords } from "../../../geolocation/store";
import { changeGameMap } from "../../store";

export function GameMap() {
    const ready = useStore($readyGeolocation)
    console.log(ready)
    return (
        ready ? <ReactMapbox
            onLoad={changeGameMap}
            rotateTouchMove={true}
            zoom={config().DEFAULT_ZOOM}
            centerFn={$smothCoords.getState}
            pitch={50}
            style="mapbox://styles/jeckyhit/ckr14z8zb0enz17nskd7iii9c"
            // onClicks={[
            //     ['building', (e) => console.log(e.features)]
            // ]}
            // onClicks={[
            //     [e => console.log(e.features)]
            // ]}
            interactive={false}
        /> :
            null
    )
}