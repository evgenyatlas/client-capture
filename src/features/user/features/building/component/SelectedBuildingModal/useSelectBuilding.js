import { useStore } from "effector-react"
import { pointToPolygonDistance } from "../../../../../../lib/geo/pointToPolygonDistance"
import { CaptureBuildings } from "../../../../../captureBuildings/captureBuildings"
import { $selectedBuilding } from "../../../../../captureBuildings/store"
import { $smothCoords } from "../../../../../geolocation/store"
import { useEnergy } from "../../../../hooks/useEnergy"
import { $userId } from "../../../../store"

export function useSelectBuilding() {
    const userId = useStore($userId)
    const energy = useEnergy()
    const currCoords = useStore($smothCoords)
    const selectBuilding = useStore($selectedBuilding)
    let notAvailable = ''
    if (selectBuilding.feature && selectBuilding.feature.geometry && pointToPolygonDistance(currCoords, selectBuilding.feature.geometry) > CaptureBuildings.MIN_CAPTURE_DISTANCE) {
        notAvailable = <>{`Может подойдешь ближе?`} < br /> {`Минимальное расстояние ${CaptureBuildings.MIN_CAPTURE_DISTANCE}м`}</>
    }
    else if (selectBuilding.capturedPlayer && selectBuilding.capturedPlayer.id === userId) {
        notAvailable = 'Истина: захваченное тобой, не может быть захваченно вновь'
    }
    else if (selectBuilding.capturedPlayer ? selectBuilding.energyCostCaptured >= energy : selectBuilding.energyCost >= energy) {
        notAvailable = 'Не хватает энергии'
    }
    return { notAvailable, building: selectBuilding }
}

