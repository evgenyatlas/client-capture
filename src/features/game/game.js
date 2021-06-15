import { GameCanvas } from "../gameCanvas/gameCanvas"
import { io } from 'socket.io-client'
import config from "../../config"
import { Player } from "../player/player"
import { CaptureBuildings } from '../captureBuildings/captureBuildings'
import { $geolocation } from "../geolocation/store"
import { forEachObj } from "../../lib/obj/forEachObj"
import { User } from "../user/user"
import { GAME_STATUSES } from "./const"
import { captureBuildingEv } from "../captureBuildings/store"
import { DeadArea } from "../deadArea/DeadArea"

export class Game {
    #players = {}
    #gameCanvas = null
    #captureBuilding = null
    #deadArea = null
    status = GAME_STATUSES.LOBBY
    startTime = 0
    #user = null
    #map = null

    constructor({ map }) {
        this.#map = map
        //Создаем Canvas для отрисовки игрового процесса
        this.#gameCanvas = new GameCanvas({ map: this.#map })
        //Создаем менеджер для захвата строений
        this.#captureBuilding = new CaptureBuildings({
            map: this.#map,
            gameCanvas: this.#gameCanvas,
            players: this.#players
        })
        //Создаем область смерти
        this.#deadArea = new DeadArea(map)
        // this.#gameCanvas.addRender(this.#deadArea)
    }

    init({ avatarUrl, id } = {}) {
        //Создаем подключение и передаем нашу аватарку, а так же id вк
        const socket = new io(config().SERVER_URL, {
            query:
                avatarUrl ?
                    {
                        avatarUrl,
                        id
                    }
                    :
                    null
        })

        //Подписываемся на события передачи начальных данных
        socket.on('init', (data) => {
            // this.mySocket = socket
            this.status = data.status
            this.startTime = data.startTime
            //Записываем настройки в конфиг
            config().GAME = { ...data.GAME, ...config().GAME }
            //Создаем всех игроков полученных с сервера
            forEachObj(data.players, (playerId, player) => this.onAddPlayer(player))
            //Создаем пользователя (для работы с текущим игроком)
            this.#user = new User({ player: this.#players[socket.id], socket, map: this.#map })
            //Инициализируем менеджер захвата строений
            this.#captureBuilding.init({ user: this.#user })
            //Инициализируем canvas для отрисовки игрового процесса
            this.#gameCanvas.init()
        })

        //Обновляем страницу, при отключение от сервера (почему бы и нет...)
        socket.on('disconnect', (e) => {
            window.location.reload()
        })

        /*ПОДПИСКИ НА СОБЫТИЯ С СЕРВЕРА*/
        //Старт игры
        socket.on('startGame', this.startGame)
        //Добавление новых игроков
        socket.on('addPlayer', this.onAddPlayer)
        //Выход игроков
        socket.on('removePlayer', this.onRemovePlayer)
        //Смена позиции игроков
        socket.on('changePosition', this.onChangePositon)
        //Захвата строений
        socket.on('captureBuilding', this.onCaptureBuilding)
        //Область смерти
        socket.on('deadArea', this.onDeadArea)
        //Атак игроков
        socket.on('attack', this.onAttack)
        //Обновление энергии
        socket.on('updateEnergy', this.onUpdateEnergy)
    }

    //Обработка новых игроков
    onAddPlayer = (data) => {
        //Создаем Игрока
        const player = new Player(data)
        //Добавляем его в canvas для отрисовки
        this.#gameCanvas.addRender(player)
        //Добавляем его в словарь по id
        this.#players[player.id] = player
    }

    //Обработка удаления игроков
    onRemovePlayer = (playerId) => {
        //Удаляем из отрисовки (canvas)
        this.#gameCanvas.removeRender(this.#players[playerId])
        //Удаляем из словаря
        delete this.#players[playerId]
    }

    //Обработка обновления энергии
    onUpdateEnergy = ({ playerId, energy }) => {
        const player = this.#players[playerId]
        player.energy += energy
        //Если это наш пользователь, то вызываем метод для обновления UI
        if (this.#user.player.id === playerId) {
            this.#user.updateEnergy(energy)
        }

    }

    //Обработка атак
    onAttack = ({ attacking, damagePlayers }) => {
        // attacking = this.#players[attacking.id] || attacking

        //Если атакующий это игрок (а не игровой мир) и это не наш пользователь, то вызываем у игрока метод атаки
        //Проверка нашего пользователя, сделано по той причине, что у нашего пользователя и так вызывается метод атаки
        if (this.#players[attacking.id] && attacking.id !== this.#user.player.id)
            this.#players[attacking.id].attack(attacking.attackEnergy)

        //проходимся по всем раненым игрокам, что бы отнять энергию и отрисовать эффекты урона
        damagePlayers.forEach(damagePlayer => {
            //Если это наш пользователь, то вызываем у user метод для обновления UI
            if (this.#user.id === damagePlayer.id) {
                this.#user.updateEnergy(-damagePlayer.energyDamage)
            }
            //Наносим урон
            this.#players[damagePlayer.id].damage(damagePlayer.energyDamage, attacking)
        })

    }

    onDeadArea = (geojson) => {
        this.#deadArea.update(geojson)
    }

    //Обработка смены позиции игроков
    onChangePositon = ({ playerId, position }) => {
        const player = this.#players[playerId]
        player.changePosition(position)
    }

    //Обработка захвата строений
    onCaptureBuilding = ({ building, playerId }) => {
        const player = this.#players[playerId]
        //Списываем с игрока стоимость строения
        player.updateEnergy(-building.energyCost)
        //Вызываем событие для захвата (На него подписан МенеджерЗахвата и наш UI)
        captureBuildingEv({ building, player: this.#players[playerId] })
    }

    startGame = ({ startTime }) => {
        this.status = GAME_STATUSES.LAUNCHED
        this.startTime = startTime
    }
}