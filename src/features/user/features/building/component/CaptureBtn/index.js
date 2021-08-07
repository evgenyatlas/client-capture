import { Button, Caption, FormItem, FormLayout, Group } from "@vkontakte/vkui"
import { useStore } from "effector-react"
import { $captureDistance, $selectedBuilding, captureBuildingEv, captureBuildingFx } from "../../../../../captureBuildings/store"
import pointToLineDistance from '@turf/point-to-line-distance'
import './CaptureBtn.css'
import { useUser } from "../../../../hooks/useUser"


export function CaptureBtn({ notAvailable }) {
    const user = useUser()
    const { player, color } = user
    const building = useStore($selectedBuilding)
    const cost = building.capturedPlayer ? building.energyCostCaptured : building.energyCost
    return (<>
        <Button
            style={{ background: color.get() }}
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
