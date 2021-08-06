import { useStore } from "effector-react"
import { useContext } from "react"
import { gameContext } from "../../game/gameContext"

export function useUser() {
    const game = useContext(gameContext)
    return game.user
}
