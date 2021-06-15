import { ModalRoot } from "@vkontakte/vkui"
import { useStore } from "effector-react"
import { GameSettingModal } from "../../../gameSetting/components/GameSettingModal"
import { SelectedBuildingModal } from "../../../user/features/building/component/SelectedBuildingModal"
import { $activeModal, hideModal } from "../../store"

export function Modals() {
    const activeModal = useStore($activeModal)
    return (
        <ModalRoot activeModal={activeModal} onClose={hideModal}>
            <SelectedBuildingModal id="buildingInfo" />
            <GameSettingModal id="gameSetting" />
        </ModalRoot>
    )
}