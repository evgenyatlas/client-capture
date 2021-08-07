import { useStore } from "effector-react"
import { useContext } from "react"
import { gameContext } from "../../game/gameContext"

export function useCaptureBuildingValue(prop) {
    const game = useContext(gameContext)
    return useStore(game.captureBuilding[prop].$store)
}
