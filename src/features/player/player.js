import mapboxgl from "mapbox-gl"
import config from "../../config"
import { createWithInBound } from "../../lib/canvas/createWithInBound"
import { EasingValue } from "../../lib/canvas/easingValue"
import { RGBA } from "../../lib/color/RGBA"
import { loadImg } from "../../lib/dom/loadImg"
import { easeOutQuint } from "../../lib/easing/easeOutQuint"
import { forEachObj } from "../../lib/obj/forEachObj"
import { calcDistanceAttackPixel } from "./lib/calcDistanceAttackPixel"
import { createAttackRay } from "./lib/createAttackRay"
import { createPositionEasing } from "./lib/createPositionEasing"
import { drawDirection } from "./lib/drawDirection"
import { JellyAnim } from "./lib/jellyAnim"


export class Player {
    static DEAD_COLOR = 'rgb(156, 156, 156, 0.81)'
    //устанавливается из игрового конфига (приходит с сервера)
    static ATTACK_DISTANCE
    static AVATAR_SIZE = {
        width: 30,
        height: 30
    }

    static OUTLINE_RADIUS = 18.5
    static ATTACK_RAY_RADIUS = 24.1
    static ATTACK_RAY_HEIGHT = 4
    static ATTACK_RAY_LENGTH = 110

    static ATACK_TIME = 750
    static DURATION_MOVE = 800
    static DAMAGE_DURATION_MOVE = 400
    //Границы отрисовки
    static withInBound = createWithInBound(
        [-this.AVATAR_SIZE.width, window.innerWidth + this.AVATAR_SIZE.width],
        [-this.AVATAR_SIZE.height, window.innerHeight + this.AVATAR_SIZE.height]
    )
    id = ''
    #rgbaManager
    #attackRayRender
    //Цвет игрока
    color = ''
    //Цвет окружности вокруг игрока
    colorOut = ''
    energy = 0
    //гео позиция игрока [lng, lat] 
    //(EeasingValue)
    #position
    get position() {
        return this.#position.get()
    }
    //(EasingValue) Окружности атаки
    #attackRay
    //(EeasingValue) Словарь в котором храняться обьекты для отрисовки ранения
    #damagingList = {}
    #jellyAnim
    avatar = null
    #done = false
    dead = false
    //Флаг для обозначения, что игрок временно вышел (закрыл вкладку и тд)
    isSleep = false
    attackReady = false
    rotation

    constructor({
        id,
        avatar = 'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png',
        color,
        position = [0, 0],
        energy = 0,
        isSleep,
        dead,
        rotation,
        attackReady
    }) {
        this.id = id
        this.isSleep = isSleep
        this.#rgbaManager = RGBA.fromStr(color)
        this.color = color
        this.colorOut = this.#rgbaManager.print(0.7)
        this.#position = createPositionEasing(position, Player.DURATION_MOVE)
        this.rotation = new EasingValue({ value: rotation, delay: 0, duration: 500 })
        this.#jellyAnim = new JellyAnim({ playerPosition: this.#position })
        this.energy = energy
        this.loadSource(avatar)
        this.dead = dead
        this.attackReady = attackReady
    }

    //Загрузка ресурсов необходимых для отрисовки игрока
    async loadSource(avatar) {
        this.avatar = await loadImg(avatar)
        this.#done = true
    }
    changePosition = position => {
        this.#position.set(position)
    }

    //Ранения от других игроков или игрового мира
    damage = (energy, damaging, damagePosDirection) => {
        //Добавляем в словарь для дальнейшей отрисовки
        this.#damagingList[damaging.id] = {
            color: damaging.color,
            energy: this.energy,
            damageEnergy: energy,
            easing: new EasingValue({
                value: 0,
                nextValue: 1,
                delay: 300,
                duration: Player.ATACK_TIME,
                endFn: () => {
                    this.#damagingList[damaging.id] = null
                    delete this.#damagingList[damaging.id]
                    if (Object.keys(this.#damagingList).length < 1) {
                        this.#position.restore()
                    }
                }
            })
        }

        //Отталкиваем только в том случае, если позиция толчка пришла
        if (damagePosDirection) {
            this.#position.set(damagePosDirection, true)

            this.#position.setEasing(easeOutQuint)
            this.#position.setDuration(Player.DAMAGE_DURATION_MOVE)
        }

        this.updateEnergy(-energy)
        //Если энергия ушла в ноль, то убиваем игроика
        if (this.energy <= 0)
            this.kill()
    }
    rotate(bearing) {
        this.rotation.set(bearing)
    }
    switchAttackReady(turn) {
        this.attackReady = turn
    }
    attack = (energy) => {
        this.energy -= energy
        this.#attackRay.start()
    }
    //обновление энергии
    updateEnergy(energy) {
        this.energy += energy
    }
    //убийство игрока
    kill() {
        this.energy = 0
        this.dead = true
    }
    initRender({ ctx, map, factorPixel }) {

        this.#attackRay = createAttackRay({
            attackDistance: Player.ATTACK_DISTANCE,
            ctx,
            position: this.position,
            rotation: this.rotation,
            map,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color: this.colorOut
        })
    }
    //Метод для отрисовки canvas
    render({ ctx, map, factorPixel }) {
        if (!this.#done) return
        //Получаем позицию в пикселях исходя из геопозиции
        let position = map.project(this.#position.get())
        //Если игрок вне границ, то не рисуем его
        if (!Player.withInBound(position)) return

        position.x = position.x * factorPixel
        position.y = position.y * factorPixel

        const img = this.avatar
        /***Отрисовки****/
        //Атака
        this.#attackRay.render(position)
        //запуск эффекта подергивания
        this.#jellyAnim.start(ctx, position)
        //Внешний круг
        this.drawOutline(ctx, factorPixel, position)
        this.drawDirection(ctx, factorPixel, position, map)
        //Аватарка
        this.drawAvatar(ctx, position, img, Player.AVATAR_SIZE.width, Player.AVATAR_SIZE.height, map)
        //Смерть 
        if (this.dead)
            this.drawDead(ctx, factorPixel, position)
        //остановка эффекта поддергивания
        this.#jellyAnim.stop(ctx, position)
        //Урон
        this.drawDamages(ctx, factorPixel, position)
    }
    drawOutline(ctx, factorPixel, position) {

        ctx.beginPath()
        ctx.arc(
            position.x,
            position.y,
            Player.OUTLINE_RADIUS,
            0,
            2 * Math.PI,
            false
        )
        ctx.fillStyle = this.colorOut
        ctx.fill()
    }
    drawDirection(ctx, factorPixel, position, map) {
        if (this.#attackRay.active) return
        const rotation = this.rotation.get() - map.getBearing()
        drawDirection({
            ctx,
            rotation,
            position,
            length: Player.ATTACK_RAY_LENGTH,
            radius: Player.ATTACK_RAY_RADIUS,
            width: Player.ATTACK_RAY_HEIGHT,
            color: this.colorOut
        })
    }
    drawAvatar(ctx, position, img, width, height, map) {
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            (position.x - width / 2),
            (position.y - height / 2),
            width,
            height
        )
    }

    drawDamages(ctx, factorPixel, position) {
        if (this.dead) return
        forEachObj(this.#damagingList, (playerId, { color, easing, damageEnergy, energy }, i) => {
            const easingValue = easing.get()


        })
    }
    drawDead(ctx, factorPixel, position) {
        ctx.beginPath()
        ctx.arc(
            position.x,
            position.y,
            Player.OUTLINE_RADIUS,
            0,
            2 * Math.PI,
            false
        )
        ctx.fillStyle = Player.DEAD_COLOR
        ctx.fill()
    }
    //Статичный метод класса, для рассчета размеров (для отрисовки) в пикселях
    static calcPixel({ map, factorPixel }) {
        Player.AVATAR_SIZE.width = Player.AVATAR_SIZE.width * factorPixel
        Player.AVATAR_SIZE.height = Player.AVATAR_SIZE.height * factorPixel
        Player.OUTLINE_RADIUS = Player.OUTLINE_RADIUS * factorPixel
        Player.ATTACK_RAY_RADIUS = Player.ATTACK_RAY_RADIUS * factorPixel
        Player.ATTACK_RAY_HEIGHT = Player.ATTACK_RAY_HEIGHT * factorPixel
        Player.ATTACK_DISTANCE = calcDistanceAttackPixel(
            config().GAME.ATTACK_DISTANCE,
            Player.AVATAR_SIZE.width,
            map,
            factorPixel
        )
    }
    //old
    // drawAttack(ctx, factorPixel, position, map) {

    //     if (!this.#attackCircle.active) return
    //     const value = this.#attackCircle.get()


    //     ctx.beginPath();
    //     ctx.arc(
    //         position.x,
    //         position.y,
    //         value * factorPixel,
    //         0,
    //         2 * Math.PI,
    //         false
    //     )
    //     ctx.fillStyle = this.#rgbaManager.print(reverseEasingLoop(0.3, 0.7, this.#attackCircle.getT()))
    //     ctx.fill()
    // }

    //NEW
    // drawAttack(ctx, factorPixel, position, map) {

    //     if (!this.#attackRay.active) return

    //     const t = this.#attackCircle.getT() * 100

    //     let rotation = this.rotation.get() - map.getBearing()

    //     let startAngleBar = rotation - 90 - Player.DIRECTION_BAR_LENGTH / 2
    //     let endAngleBar = startAngleBar + Player.DIRECTION_BAR_LENGTH

    //     ctx.beginPath()
    //     ctx.arc(
    //         position.x + Math.sin(toRadians(rotation)) * t,
    //         position.y - Math.cos(toRadians(rotation)) * t,
    //         this.#radiusDirectionBar,
    //         toRadians(startAngleBar),
    //         toRadians(endAngleBar),
    //         false
    //     )
    //     ctx.strokeStyle = this.colorOut
    //     ctx.lineWidth = this.#widthDirectionBar
    //     ctx.stroke()
    // }


    //line around
    // drawAttack(ctx, factorPixel, position, map) {
    //     if (!this.#attackCircle.active) return

    //     const vt = this.#attackCircle.getT()
    //     let rotation = this.rotation.get() - map.getBearing()

    //     let startAngleBar = rotation - 90 - Player.DIRECTION_BAR_LENGTH / 2
    //     let endAngleBar = reverseEasingLoop(startAngleBar, startAngleBar + 360, vt / 0.2)

    //     ctx.beginPath()
    //     const radius = vt > 0.2 ? reverseEasingLoop(this.#radiusDirectionBar, Player.ATTACK_RADIUS * factorPixel, vt - 0.2) : this.#radiusDirectionBar
    //     if (radius < 0) return
    //     ctx.arc(
    //         position.x,
    //         position.y,
    //         radius,
    //         toRadians(startAngleBar),
    //         toRadians(endAngleBar),
    //         false
    //     )
    //     ctx.strokeStyle = this.colorOut
    //     ctx.lineWidth = this.#widthDirectionBar
    //     ctx.stroke()
    // }

}
/*
   map.easeTo({
                    duration: 3000,
                    center: center,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
                */