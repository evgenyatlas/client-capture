import mapboxgl from "mapbox-gl"
import config from "../../config"
import { createWithInBound } from "../../lib/canvas/createWithInBound"
import { EasingValue } from "../../lib/canvas/easingValue"
import { RGBA } from "../../lib/color/RGBA"
import { loadImg } from "../../lib/dom/loadImg"
import { easeOutExpo } from "../../lib/easing/easeOutExpo"
import { easeOutQuint } from "../../lib/easing/easeOutQuint"
import { lerp, lerpLoop } from "../../lib/easing/lerp"
import { reverseEasingLoop } from "../../lib/easing/reverseEasingLoop"
import { forEachObj } from "../../lib/obj/forEachObj"
import { createAttackEasing } from "./lib/createAttackEasing"
import { createPositionEasing } from "./lib/createPositionEasing"
import { JellyAnim } from "./lib/jellyAnim"


export class Player {
    static DEAD_COLOR = 'rgb(156, 156, 156, 0.81)'
    //устанавливается из игрового конфига (приходит с сервера)
    static ATTACK_RADIUS
    static AVATAR_SIZE = {
        width: 30,
        height: 30
    }
    //Границы отрисовки
    static withInBound = createWithInBound(
        [-this.AVATAR_SIZE.width, window.innerWidth + this.AVATAR_SIZE.width],
        [-this.AVATAR_SIZE.height, window.innerHeight + this.AVATAR_SIZE.height]
    )
    static ATACK_TIME = 600
    static FACTOR_RADIUS_OUTLINE = 0.62
    static DURATION_MOVE = 800
    static DAMAGE_DURATION_MOVE = 500
    id = ''
    #width
    #height
    #radiusOutline
    #rgbaManager
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
    #attackCircle
    //(EeasingValue) Словарь в котором храняться обьекты для отрисовки ранения
    #damagingList = {}
    #jellyAnim
    avatar = null
    #done = false
    dead = false
    //Флаг для обозначения, что игрок временно вышел (закрыл вкладку и тд)
    isSleep = false

    constructor({
        id,
        avatar = 'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png',
        color,
        position = [0, 0],
        energy = 0,
        isSleep,
        dead
    }) {
        this.id = id
        this.isSleep = isSleep
        this.#rgbaManager = RGBA.fromStr(color)
        this.color = color
        this.colorOut = this.#rgbaManager.print(0.7)
        this.#attackCircle = createAttackEasing(Player.ATACK_TIME)
        this.#position = createPositionEasing(position, Player.DURATION_MOVE)
        this.#jellyAnim = new JellyAnim({ playerPosition: this.#position })
        this.energy = energy
        this.loadSource(avatar)
        this.dead = dead
    }

    //Загрузка ресурсов необходимых для отрисовки игрока
    async loadSource(avatar) {
        this.avatar = await loadImg(avatar)
        this.#done = true
    }
    initRender({ ctx, map, factorPixel }) {
        this.#width = Player.AVATAR_SIZE.width * factorPixel
        this.#height = Player.AVATAR_SIZE.height * factorPixel
        this.#radiusOutline = this.#width * Player.FACTOR_RADIUS_OUTLINE
    }
    //Метод для отрисовки canvas
    render({ ctx, map, factorPixel }) {
        if (!this.#done) return
        //Получаем позицию в пикселях исходя из геопозиции
        const position = map.project(this.#position.get())

        //Если игрок вне границ, то не рисуем его
        if (!Player.withInBound(position)) return

        position.x = position.x * factorPixel
        position.y = position.y * factorPixel

        const img = this.avatar
        /***Отрисовки****/
        //Атака
        this.drawAttack(ctx, factorPixel, position)
        //запуск эффекта подергивания
        this.#jellyAnim.start(ctx)
        //Внешний круг
        this.drawOutline(ctx, factorPixel, position)
        //Аватарка
        this.drawAvatar(ctx, position, img, this.#width, this.#height)
        //Смерть 
        if (this.dead)
            this.drawDead(ctx, factorPixel, position)
        //остановка эффекта поддергивания
        this.#jellyAnim.stop(ctx)
        //Урон
        this.drawDamages(ctx, factorPixel, position)
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
                        console.log('restore')
                        this.#position.restore()
                    }
                }
            })
        }


        this.#position.set(damagePosDirection, true)

        this.#position.setEasing(easeOutQuint)
        this.#position.setDuration(Player.DAMAGE_DURATION_MOVE)

        this.updateEnergy(-energy)
        //Если энергия ушла в ноль, то убиваем игроика
        if (this.energy <= 0)
            this.kill()
    }
    drawOutline(ctx, factorPixel, position) {
        let radiusOutline = this.#radiusOutline

        //Отрисовка анимации для
        // if (this.#position.active) {
        //     radiusOutline = reverseEasingLoop(radiusOutline, radiusOutline * 1.3, this.#position.getT())
        // }

        ctx.beginPath()
        ctx.arc(
            position.x / this.#jellyAnim.scale[0],
            position.y / this.#jellyAnim.scale[1],
            radiusOutline,
            0,
            2 * Math.PI,
            false
        )
        ctx.fillStyle = this.colorOut
        ctx.fill()


    }
    drawAvatar(ctx, position, img, width, height) {
        const { x, y } = position
        // ctx.translate(x, y);
        // ctx.rotate(90 * Math.PI / 180);
        // ctx.translate(-x, -y);

        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            (position.x / this.#jellyAnim.scale[0] - width / 2),
            (position.y / this.#jellyAnim.scale[1] - height / 2),
            width,
            height
        )
        // ctx.translate(x, y);
        // ctx.rotate(-(90 * Math.PI / 180));
        // ctx.translate(-x, -y);

    }
    drawDamages(ctx, factorPixel, position) {
        if (this.dead) return
        forEachObj(this.#damagingList, (playerId, { color, easing, damageEnergy, energy }, i) => {
            const easingValue = easing.get()

            ctx.beginPath()
            ctx.arc(
                position.x,
                position.y,
                this.#radiusOutline * easingValue,
                0,
                2 * Math.PI,
                false
            )
            ctx.fillStyle = this.#rgbaManager.print(1 - easingValue * 0.3)
            ctx.fill()

            /**life**/
            //Bacground line
            let barWidth = this.#width * 2
            let barHeight = 8 * factorPixel
            let x = position.x - barWidth / 2
            let y = position.y + barHeight * 2.8 + ((barHeight + 10) * i)
            ctx.beginPath()
            ctx.rect(x, y, barWidth, barHeight)
            ctx.fillStyle = '#afafaf'
            ctx.fill()
            //health bar
            let healthWidth = barWidth * ((1 - (damageEnergy / energy) * (1 - easingValue)))
            ctx.beginPath()
            ctx.rect(x, y, healthWidth < 0 ? 0 : healthWidth, barHeight)
            ctx.fillStyle = this.color
            ctx.fill()
        })
    }
    drawDead(ctx, factorPixel, position) {
        ctx.beginPath()
        ctx.arc(
            position.x / this.#jellyAnim.scale[0],
            position.y / this.#jellyAnim.scale[1],
            this.#radiusOutline,
            0,
            2 * Math.PI,
            false
        )
        ctx.fillStyle = Player.DEAD_COLOR
        ctx.fill()
    }
    drawAttack(ctx, factorPixel, position) {
        const value = this.#attackCircle.get()
        if (value < 0.01) return
        ctx.beginPath();
        ctx.arc(
            position.x,
            position.y,
            value * factorPixel,
            0,
            2 * Math.PI,
            false
        )
        ctx.fillStyle = this.#rgbaManager.print(1 - value / config().GAME.ATTACK_RADIUS)

        ctx.fill()
    }

    attack = (energy) => {
        this.energy -= energy
        //Отрисовка нашей атаки (Устанавливаем радиус в EasingValue для анимации)
        this.#attackCircle.set(config().GAME.ATTACK_RADIUS)
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

}
/*
   map.easeTo({
                    duration: 3000,
                    center: center,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
                */