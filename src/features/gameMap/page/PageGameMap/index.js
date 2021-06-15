import { Panel, View } from "@vkontakte/vkui";
import { memo } from "react";
import { DebugInfoList } from "../../../debug/components/DebugInfoList";
import { ShowGameSettingBtn } from "../../../gameSetting/components/ShowGameSettingBtn";
import { DeadNotice } from "../../../user/features/deadNotice/components/DeadNotice";
import { GameUI } from "../../../user/components/GameUI";
import { GameMap } from "../../components/GameMap";

export const PageGameMap = memo(function PageGameMap() {
    return (
        <View activePanel="gameMap" >
            <Panel id="gameMap" >
                <GameMap />
                <GameUI />
                <DebugInfoList />
                <ShowGameSettingBtn />
            </Panel>
        </View>
    )
})