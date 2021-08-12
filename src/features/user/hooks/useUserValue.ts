import { useStore } from "effector-react"

import { useGame } from "../../game/hooks/useGame"

export function useUserValue(key: string) {
    const game = useGame()
    return useStore(game.user[key].$store)
}