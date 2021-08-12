import { createContext } from "react";
import { Game } from "./game";

export const gameContext = createContext<Game | null>(null)

class Test {
    private t: string
    constructor(t: string) {
        this.t = t
    }
}