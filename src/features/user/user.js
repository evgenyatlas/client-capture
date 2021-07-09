import { attackEv } from "../user/features/attackBtn/store";
import { $smothCoords, freezeGeolocation, unFreezeGeolocation } from "../geolocation/store";
import { captureBuildingUserEv, setUserEv, updateEnergyEv, updateEnergyFactorEv } from "./store";
import { debounce } from "@vkontakte/vkjs";
import { Player } from "../player/player";

const deferUnFreezeGeolocation = debounce(unFreezeGeolocation, Player.ATACK_TIME)

export class User {
    id = ''
    player = null
    socket = null
    #loadedBbox = null
    #map
    constructor({ player, socket, map }) {
        this.player = player
        this.#map = map
        this.socket = socket
        this.id = player.id
        //Закидываем нашего игрока в store (по большей части для UI)
        setUserEv({ player: this.player, socket })
        //Прослушивания GPS и смена позиции нашего игрока
        $smothCoords.watch(this.#changePosition)
        //Реакция на события (из UI) захвата строения
        captureBuildingUserEv.watch(this.#captureBuilding)
        //Реакция на события (из UI) атаки
        attackEv.watch(this.#attack)
    }

    //Метод обновления energy для UI
    updateEnergy = (energy) => {
        updateEnergyEv(energy)
    }
    //Смена позиции 
    #changePosition = (pos) => {
        this.player.changePosition(pos)
        this.socket.emit('changePosition', pos)
    }
    //Захват строения (вызывается как реакция на события из UI)
    #captureBuilding = (data) => {
        const energyCost = data.building.energyCost
        this.updateEnergy(-energyCost)
        this.player.updateEnergy(-energyCost)
        this.socket.emit('captureBuilding', data.building.getDataServer())
    }
    unCaptureBuilding = captureBuilding => {
        updateEnergyFactorEv(-captureBuilding.energyFactor)
    }
    damage(energy) {
        this.updateEnergy(energy)
        freezeGeolocation()
        deferUnFreezeGeolocation()
    }
    //Атака
    #attack = (energy = 1) => {
        //Вызываем метод атаки нашего игрока
        this.player.attack(energy)
        //Обновляем UI
        this.updateEnergy(-energy)
        //Оповещаем сервер
        this.socket.emit('attack', energy)
    }
}