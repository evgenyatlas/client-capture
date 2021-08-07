import { $smothCoords, freezeGeolocation, unFreezeGeolocation } from "../geolocation/store";
import { captureBuildingUserEv, setUserEv, updateEnergyEv, updateEnergyFactorEv } from "./store";
import { debounce, throttle } from "@vkontakte/vkjs";
import { Player } from "../player/player";
import { easeOutElastic } from "../../lib/easing/easeOutElastic";
import { easeOutBack } from "../../lib/easing/easeOutBack";
import config from "../../config";
import { CombineValueStore, CounterValueStore, ValueStore } from "../../lib/effectorKit/valueStore";
import { watchObj } from "../../lib/obj/watchObj";
import createInputStore from "../../lib/effectorKit/createInputStore";
import { combine } from "effector";

//Отложенный вызов разморозки смены геопозиции
//Требуется для того, что бы при множественном уроне от других игроков
//Мы откладывали разморозку смены геопозиции
const deferUnFreezeGeolocation = debounce(unFreezeGeolocation, Player.ATTACK_TIME)

export class User {
    id = ''
    //Игрок к которому привязан пользователь
    player = null
    //Socket (через который будет происходит взаимодействие с сервером)
    socket = null
    //Менеджер захвата строений
    #buildingCapture
    color
    //доступная энергия
    energy
    //добываемая энергия
    energyFactor
    //Выбранная энергия для атаки
    attackEnergy
    //Готовность к атаке
    attackReady
    dead
    //Время ожидания атаки
    #attackTimeout
    //Время когда атака будет доступной
    #attackAccessTime = 0
    #map
    constructor({ player, socket, map, attackTimeout, captureBuildings: buildingCapture }) {
        this.#buildingCapture = buildingCapture
        this.#map = map

        this.player = player
        this.socket = socket
        this.id = player.id
        this.#attackTimeout = attackTimeout
        //цвет
        this.color = new ValueStore({
            observeObj: [player, 'color'],
            readOnly: true
        })
        //Доступная энергия
        this.energy = new ValueStore({
            observeObj: [player, 'energy'],
            readOnly: true
        })
        //добываемая энергия
        this.energyFactor = new CounterValueStore({ value: 0, toFixed: 2 })
        //Выбранное количество атаки на основе (доступная энергия * множитель выбранной атаки)
        this.attackEnergy = new ValueStore({
            value: 0,
            combine: {
                stores: [this.energy.$store],
                fn: (attackEnergyFactor, energy) => Math.max(Math.min(Math.round(energy * attackEnergyFactor) - 1, energy - 1), 0)
            }
        })
        //готовность к атаке
        this.attackReady = this.attackEnergy.map(attackEnergy => attackEnergy > 0)
        this.dead = this.energy.map(energy => energy <= 0)

        //debug
        this.color.$store.watch((color) => console.log(color, ' color'))
        this.energyFactor.$store.watch((energyFactor) => console.log(energyFactor, ' energyFactor'))
        this.energy.$store.watch(energy => console.log(energy, ' energy'))
        this.attackEnergy.$store.watch((attackEnergy) => console.log(attackEnergy, ' attackEnergy'))

        //Закидываем нашего игрока в store (по большей части для UI)
        setUserEv({ player: this.player, socket })
        //Прослушивания GPS и меняем позицию нашего игрока
        $smothCoords.watch(this.#changePosition)
        //Реакция на события (из UI) захвата строения
        captureBuildingUserEv.watch(this.#captureBuilding)
        //Переключения готовности к атаке
        this.attackReady.$store.watch(this.#switchAttackReady)
        //Поворот персонажа
        this.#map.on('rotateZ', this.#rotate)
        //Устанавливаем начальный поворот в 0
        this.#rotate({ bearing: 0 })
    }
    //Установка множителя для атаки исходя из доступная энергия * множитель
    setAttackEnergy(factor) {
        this.attackEnergy.set(factor)
    }
    //Смена позиции игрока
    #changePosition = (pos) => {
        this.player.changePosition(pos)
        this.socket.emit('changePosition', pos)
    }
    //Захват строения (вызывается как реакция на события из UI)
    #captureBuilding = (data) => {
        const energyCost = data.building.energyCost
        this.energyFactor.inc(data.building.energyFactor)
        this.player.updateEnergy(-energyCost)
        this.socket.emit('captureBuilding', data.building.getDataServer())
    }
    //Отмена захвата строения
    unCaptureBuilding = captureBuilding => {
        this.energyFactor.dec(captureBuilding.energyFactor)
        updateEnergyFactorEv(-captureBuilding.energyFactor)
    }
    //Урон нашему пользователю
    damage(energy) {
        this.energy.inc(energy)
        //Замораживаем позицию
        freezeGeolocation()
        //Вызываем 
        deferUnFreezeGeolocation()
    }
    //Поворот персонажа
    #rotate = ({ bearing, angle }) => {
        this.player.rotate(bearing)
        //Сделать throttle
        this.socket.emit('rotate', -bearing)
    }
    //Атака
    attack = () => {
        //Энергия для атаки
        const attackEnergy = this.attackEnergy.get()
        //Если не прошло время для доступности атаки или выбранная атака меньше 1, то выходим
        if (!attackEnergy || !this.#attackAccessTime || this.#attackAccessTime > performance.now()) return
        //Устанавливаем выбранную энергию в 0
        this.attackEnergy.set(0)
        //Очищаем время доступности атаки
        this.#attackAccessTime = 0
        //Вызываем метод атаки нашего игрока
        this.player.attack(attackEnergy)
        //Оповещаем сервер
        this.socket.emit('attack', attackEnergy)
    }
    //Переключения готовности к атаке
    #switchAttackReady = (turn) => {
        this.#attackAccessTime = turn ? performance.now() + this.#attackTimeout : 0
        this.player.switchAttackReady(turn)
        this.socket.emit('switchAttackReady', turn)
    }
    //Метод для удаления пользователя
    destroy() {
        //Todo
    }
}