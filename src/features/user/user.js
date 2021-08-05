import { $attackReady, attackEv } from "../user/features/attackBtn/store";
import { $smothCoords, freezeGeolocation, unFreezeGeolocation } from "../geolocation/store";
import { captureBuildingUserEv, setUserEv, updateEnergyEv, updateEnergyFactorEv } from "./store";
import { debounce, throttle } from "@vkontakte/vkjs";
import { Player } from "../player/player";
import { easeOutElastic } from "../../lib/easing/easeOutElastic";
import { easeOutBack } from "../../lib/easing/easeOutBack";
import config from "../../config";
import { CounterValueStore, ValueStore } from "../../lib/effectorKit/valueStore";
import { watchObj } from "../../lib/obj/watchObj";

const deferUnFreezeGeolocation = debounce(unFreezeGeolocation, Player.ATTACK_TIME)

export class User {
    static instance = null
    static ATTACK_TIMEOUT
    id = ''
    player = null
    socket = null
    color
    //доступная энергия
    energy
    //Множитель энергии (т.е та которая добывается)
    energyFactor
    //Множитель для выбранной энергии атаки
    attackEnergyFactor
    //Выбранная энергия для атаки
    attackEnergy
    dead
    #attackTimeout
    #attackAvailTime = 0
    #map
    constructor({ player, socket, map, attackTimeout }) {
        this.color = new ValueStore({ value: player.color, observeObj: [player, 'color'] })
        this.energy = new ValueStore({ value: player.energy, observeObj: [player, 'energy'] })
        this.attackEnergyFactor =
            this.energyFactor = new CounterValueStore({ value: 0, toFixed: 2 })
        this.dead = this.energy.map(energy => energy <= 0)
        this.#attackTimeout = attackTimeout
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
        //Переключения готовности к атаке
        $attackReady.watch(this.#switchAttackReady)
        //Поворот персонажа
        this.#map.on('rotateZ', this.#rotate)
        //Устанавливаем начальный поворот в 0
        this.#rotate({ bearing: 0 })
    }
    setAttackEnergy(factor) {

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
        this.energyFactor.inc(data.building.energyFactor)
        //delete
        this.updateEnergy(-energyCost)
        this.player.updateEnergy(-energyCost)
        this.socket.emit('captureBuilding', data.building.getDataServer())
    }
    unCaptureBuilding = captureBuilding => {
        this.energyFactor.dec(captureBuilding.energyFactor)
        updateEnergyFactorEv(-captureBuilding.energyFactor)
    }
    damage(energy) {
        this.updateEnergy(energy)
        freezeGeolocation()
        deferUnFreezeGeolocation()
    }
    #rotate = ({ bearing, angle }) => {
        this.player.rotate(bearing)
        //Сделать throttle
        this.socket.emit('rotate', -bearing)
    }
    //Атака
    #attack = (energy = 1) => {
        //Если не прошло время для доступности атаки, то выходим
        if (!this.#attackAvailTime || this.#attackAvailTime > performance.now()) return
        //Очищаем время доступности атаки
        this.#attackAvailTime = 0
        //Вызываем метод атаки нашего игрока
        this.player.attack(energy)
        //Обновляем UI
        this.updateEnergy(-energy)
        //Оповещаем сервер
        this.socket.emit('attack', energy)
    }
    #switchAttackReady = (turn) => {
        this.#attackAvailTime = turn ? performance.now() + this.#attackTimeout : 0
        this.player.switchAttackReady(turn)
        this.socket.emit('switchAttackReady', turn)
    }
}