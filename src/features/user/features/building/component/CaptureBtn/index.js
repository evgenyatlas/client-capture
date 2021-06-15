import { Button, Caption, FormItem, FormLayout, Group } from "@vkontakte/vkui"
import { useStore } from "effector-react"
import { $captureDistance, $selectedBuilding, captureBuildingEv, captureBuildingFx } from "../../../../../captureBuildings/store"
import pointToLineDistance from '@turf/point-to-line-distance'
import { $user, $userColor, captureBuildingUserEv } from "../../../../../user/store"
import './CaptureBtn.css'


export function CaptureBtn({ notAvailable, cost }) {
    const { player } = useStore($user)
    const building = useStore($selectedBuilding)
    const color = useStore($userColor)
    return (<>
        <Button
            style={{ background: color }}
            stretched
            disabled={notAvailable}
            size="l"
            mode="commerce"
            onClick={
                () => captureBuildingEv({ player, building })
            }>
            <div className="CaptureBtn"><span>Захватить </span><span className="CaptureBtn__Cost">{cost} <img src="/img/energy-icon.svg" /></span></div>
        </Button>

        {
            notAvailable
            &&
            <center>
                <Caption level="2" weight="regular" style={{ marginTop: '10px' }}>{notAvailable}</Caption>
            </center>
        }
    </>
    )
}
