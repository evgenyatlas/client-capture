import { useContext } from "react"
import { Game } from "../game"
import { gameContext } from "../gameContext"

export function useGame(): Game {
    const game = useContext<Game>(gameContext)
    return game
}
