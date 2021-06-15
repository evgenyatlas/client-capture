import { useStore } from "effector-react";
import { useEffect, useState } from "react";
import config from "../../../config";
import { forEachObj } from "../../../lib/obj/forEachObj";
import { $user } from "../../user/store";

export function useGameSetting() {
    const { socket } = useStore($user)
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
        inputs
    }
}