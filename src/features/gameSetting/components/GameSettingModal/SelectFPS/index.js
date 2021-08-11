import { FormItem, SliderSwitch } from "@vkontakte/vkui"
import { useState } from "react"
import config from "../../../../../config"

export function SelectFPS() {
    const [fps, setfps] = useState(config().GAME.FPS)
    return (
        <FormItem>
            <SliderSwitch
                activeValue={fps}
                onSwitch={(fps) => {
                    setfps(fps)
                    config().GAME.FPS = fps
                }}
                options={[
                    {
                        name: '30 FPS',
                        value: 45,
                    },
                    {
                        name: '60 FPS',
                        value: 75,
                    },
                ]}
            />
        </FormItem>
    )
}