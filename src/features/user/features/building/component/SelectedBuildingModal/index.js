import { Avatar, Button, Group, ModalCard, Separator, SimpleCell, Title } from "@vkontakte/vkui"
import { useStore } from "effector-react"
import { EnergyIcon } from "../../../../../../components/EnergyIcon"
import { $userColor } from "../../../../../user/store"
import { CaptureBtn } from "../CaptureBtn"
import { useSelectBuilding } from "./useSelectBuilding"

export function SelectedBuildingModal(props) {
    const { building, notAvailable } = useSelectBuilding()
    const userColor = useStore($userColor)
    return (
        <ModalCard
            header="Информация о здании"
            // onClose={hideModal}
            {...props}
        >
            <Separator style={{ marginTop: '5px', marginBottom: '10px' }}></Separator>
            <Group>
                {
                    building
                    &&
                    building.capturedPlayer
                    &&
                    <SimpleCell
                        style={{ padding: '0px' }}
                        before={
                            <Title style={{ marginRight: '5px' }}
                                level="3"
                                weight="regular">
                                Захваченно:</Title>
                        }
                    >
                        <Avatar
                            style={{
                                boxSizing: 'border-box',
                                border: `5px solid ${building.capturedPlayer.color}`
                            }}
                            src={building.capturedPlayer.avatar.src}
                        />
                    </SimpleCell>
                }
                <Title level="2" weight="regular" style={{ display: 'flex' }}>Множитель энергии: +{building.energyFactor} <EnergyIcon color={userColor} /></Title>

                <Title style={{ marginTop: '10px' }} level="3" weight="regular">Площадь: {building.size}м</Title>
            </Group>
            <Separator style={{ marginTop: '5px', marginBottom: '10px' }}></Separator>
            <CaptureBtn notAvailable={notAvailable} cost={building.capturedPlayer ? building.energyCostCaptured : building.energyCost} />
        </ModalCard>
    )
}