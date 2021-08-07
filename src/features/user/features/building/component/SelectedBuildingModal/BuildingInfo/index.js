import { Avatar, Button, Group, ModalCard, Separator, SimpleCell, Title } from "@vkontakte/vkui"
import { EnergyIcon } from "../../../../../../../components/EnergyIcon"
import { useColor } from "../../../../../hooks/useColor"
import './BuildingInfo.css'

export const BuildingInfo = function BuildingInfo({ building }) {
    const userColor = useColor()
    return (
        <>
            <Separator className="TopSeparator"></Separator>
            <Group>
                {
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
        </>
    )
}