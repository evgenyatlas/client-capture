import { useStore } from "effector-react"
import { useContext } from "react"
import { Game } from "../../game/game"
import { gameContext } from "../../game/gameContext"
import { useGame } from "../../game/hooks/useGame"
import { User } from "../user"


export function useUser(): User {
    const game = useGame()
    return game.user
}
