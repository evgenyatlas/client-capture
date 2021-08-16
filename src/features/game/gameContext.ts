import { createContext } from "react";
import { Game } from "./game";

export const gameContext = createContext<Game | null>(null)

