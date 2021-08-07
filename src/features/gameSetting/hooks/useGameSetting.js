import { useStore } from "effector-react";
import { useEffect, useState } from "react";
import config from "../../../config";
import { list2Matrix } from "../../../lib/array/list2Matrix";
import { forEachObj } from "../../../lib/obj/forEachObj";
import { useUser } from "../../user/hooks/useUser";

export function useGameSetting() {
    const { socket } = useUser()
    const [state, setState] = useState(config().GAME)
    let inputs = []

    forEachObj(state, (key, value) => {
        if (key === 'FPS')
            return
        inputs.push({
            onChange: ({ target: { value } }) => setState(state => ({
                ...state,
                [key]: +value
            })),
            value: +value,
            name: key
        })
    })

    const reqSaveConfig = () => {
        socket.emit('changeSetting', state)
    }

    return {
        reqSaveConfig,
        inputs: list2Matrix(inputs, 2)
    }
}