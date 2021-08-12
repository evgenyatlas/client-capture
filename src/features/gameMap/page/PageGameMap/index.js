import { Panel, View } from "@vkontakte/vkui";
import { memo, useEffect, useState } from "react";
import { DebugInfoList } from "../../../debug/components/DebugInfoList";
import { ShowGameSettingBtn } from "../../../gameSetting/components/ShowGameSettingBtn";
import { DeadNotice } from "../../../user/features/deadNotice/components/DeadNotice";
import { GameUI } from "../../../user/components/GameUI";
import { GameMap } from "../../components/GameMap";
import { initGameMap } from "../../init";
import { Game } from "../../../game/game";
import { gameContext } from "../../../game/gameContext";
import { Modals } from "../../../modals/components/Modals";


export const PageGameMap = memo(function PageGameMap() {
    const [game, setGame] = useState(null)
    useEffect(async () => {
        const map = await initGameMap()
        const game = new Game({ map })
        await game.init()
        setGame(game)
    }, [])
    return (
        <gameContext.Provider value={game} >
            <View activePanel="gameMap" modal={<Modals />}>
                <Panel id="gameMap" >

                    <GameMap />
                    {
                        //Рендирим игровой интерфейс только после загрузки игры
                        game
                        &&
                        game.user
                        &&
                        <>
                            <GameUI />
                            <DebugInfoList />
                            <ShowGameSettingBtn />
                        </>
                    }

                </Panel>
            </View>
        </gameContext.Provider>
    )
})