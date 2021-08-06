import { useStore } from "effector-react"
import { useContext } from "react"
import { gameContext } from "../../game/gameContext"

export function useUserValue(prop) {
    const game = useContext(gameContext)
    return useStore(game.user[prop].$store)
}
