import { Avatar, Button, Group, ModalCard, Separator, SimpleCell, Title } from "@vkontakte/vkui"
import { useStore } from "effector-react"
import { EnergyIcon } from "../../../../../../components/EnergyIcon"
import { $userColor } from "../../../../../user/store"
import { CaptureBtn } from "../CaptureBtn"
import { BuildingInfo } from "./BuildingInfo"
import { useSelectBuilding } from "./useSelectBuilding"

export function SelectedBuildingModal(props) {
    const { building, notAvailable } = useSelectBuilding()
    return (
        <ModalCard
            header="Информация о здании"
            // onClose={hideModal}
            {...props}
        >
            {building && <BuildingInfo building={building} />}
            <CaptureBtn notAvailable={notAvailable} />
        </ModalCard>
    )
}