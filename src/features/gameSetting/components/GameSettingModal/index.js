import { Button, FormItem, FormLayoutGroup, Input, ModalCard, Separator, SliderSwitch } from "@vkontakte/vkui"
import { useGameSetting } from "../../hooks/useGameSetting"
import { SelectFPS } from "./SelectFPS"

import './GameSettingModal.css'

export function GameSettingModal(props) {
    const { reqSaveConfig, inputs } = useGameSetting()
    return (
        <ModalCard
            header="Игровые настройки"
            {...props}
        >
            <Separator style={{ marginTop: '5px', marginBottom: '10px' }}></Separator>
            <SelectFPS />
            <Separator style={{ marginTop: '5px', marginBottom: '10px' }}></Separator>
            {
                inputs.map((inputs, i) =>
                    <FormLayoutGroup key={i} mode="horizontal">
                        {inputs.map(({ onChange, value, name }) =>
                            <FormItem top={name} key={name} className="clearPaddingVertical GameSettingInput">
                                <Input className="GameSettingInput__Input" onChange={onChange} value={value} />
                            </FormItem>
                        )}
                    </FormLayoutGroup>

                )
            }
            <Button style={{ marginTop: '10px' }} onClick={reqSaveConfig} mode="commerce">ПЕРЕЗАГРУЗИТЬ СЕРВЕР</Button>
        </ModalCard>
    )
}