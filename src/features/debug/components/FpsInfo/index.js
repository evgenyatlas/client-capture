import { useStore } from "effector-react"
import { DebugTable } from "../DebugTable"
import { $fps } from "./store"

export function FpsInfo() {
    const fps = useStore($fps)
    return (
        <DebugTable>
            {
                [
                    { caption: 'GameRender FPS', text: fps }
                ]
            }
        </DebugTable>
    )
}