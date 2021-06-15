import { Button, FormItem, FormLayoutGroup, Input, ModalCard, Separator, SliderSwitch } from "@vkontakte/vkui"
import { useGameSetting } from "../../hooks/useGameSetting"
import { SelectFPS } from "./SelectFPS"

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
                inputs.map(({ onChange, value, name }) =>
                    <FormItem top={name} key={name} className="clearPaddingVertical">
                        <Input onChange={onChange} value={value} />
                    </FormItem>
                )
            }
            <Button style={{ marginTop: '10px' }} onClick={reqSaveConfig} mode="commerce">ПЕРЕЗАГРУЗИТЬ СЕРВЕР</Button>
        </ModalCard>
    )
}