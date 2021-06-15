import mapboxgl from "mapbox-gl"
import config from "../../config"
import { createWithInBound } from "../../lib/canvas/createWithInBound"
import { EasingValue } from "../../lib/canvas/easingValue"
import { replaceAlphaRgba } from "../../lib/color/replaceAlphaRgba"
import { loadImg } from "../../lib/dom/loadImg"
import { forEachObj } from "../../lib/obj/forEachObj"
import { createAttackEasing } from "./lib/createAttackEasing"
import { createPositionEasing } from "./lib/createPositionEasing"

export class Player {
    static DEAD_COLOR = 'rgb(156, 156, 156, 0.81)'
    //устанавливается из игрового конфига (приходит с сервера)
    static ATTACK_RADIUS
    static AVATAR_SIZE = {
        width: 30,
        height: 30
    }
    static withInBound = createWithInBound(
        [-this.AVATAR_SIZE.width, window.innerWidth + this.AVATAR_SIZE.width],
        [-this.AVATAR_SIZE.height, window.innerHeight + this.AVATAR_SIZE.height]
    )
    static ATACK_TIME = 600
    id = ''
    color = ''
    energy = 1
    position
    attackCircle
    damagingList = []
    avatar = null
    done = false
    dead = false

    constructor({
        id,
        avatar = 'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png',
        color,
        position = [0, 0],
        energy = 0,
    }) {
        this.id = id
        this.color = color
        this.attackCircle = createAttackEasing(Player.ATACK_TIME)
        this.position = createPositionEasing(position)
        this.energy = energy
        this.loadSource(avatar)
    }
    attack = (energy) => {
        this.energy -= energy
        //Отрисовка нашей атаки (Устанавливаем радиус в EasingValue для анимации)
        this.attackCircle.set(config().GAME.ATTACK_RADIUS)
    }
    //обновление энергии
    updateEnergy(energy) {
        this.energy += energy
    }
    //Отрисовка ранения от других игроков или игрового мира
    damage = (energy, damaging) => {
        this.damagingList[damaging.id] = {
            color: damaging.color,
            energy: this.energy,
            damageEnergy: energy,
            easing: new EasingValue({
                value: 1,
                nextValue: 0,
                duration: Player.ATACK_TIME,
                endFn: () => {
                    this.damagingList[damaging.id] = null
                    delete this.damagingList[damaging.id]
                }
            })
        }
        this.updateEnergy(-energy)
        //Если энергия ушла в ноль, то убиваем игроика
        if (this.energy <= 0)
            this.kill()

    }
    //убийство игрока
    kill() {
        this.energy = 0
        this.dead = true
    }
    changePosition = position => {
        this.position.set(position)
    }
    //Загрузка ресурсов необходимых для отрисовки игрока
    async loadSource(avatar) {
        this.avatar = await loadImg(avatar)
        this.done = true
    }
    //Метод для отрисовки canvas
    render({ ctx = new CanvasRenderingContext2D(), map, factorPixel }) {
        if (!this.done) return
        const position = map.project(this.position.get())
        //Если игрок вне границ, то не рисуем его
        if (!Player.withInBound(position)) return

        position.x = position.x * factorPixel
        position.y = position.y * factorPixel

        const img = this.avatar
        const width = Player.AVATAR_SIZE.width * factorPixel
        const height = Player.AVATAR_SIZE.height * factorPixel

        //draw circle
        this.drawOutline(ctx, factorPixel, position)
        this.drawAttack(ctx, factorPixel, position)
        this.drawAvatar(ctx, position, img, width, height)
        this.drawDamages(ctx, factorPixel, position)
        if (this.dead)
            this.drawDead(ctx, factorPixel, position)

    }
    drawOutline(ctx, factorPixel, position) {
        ctx.beginPath()
        ctx.arc(
            position.x,
            position.y,
            Player.AVATAR_SIZE.width * factorPixel * 0.62,
            0,
            2 * Math.PI,
            false
        )
        ctx.fillStyle = this.color
        ctx.fill()
    }
    drawDamages(ctx, factorPixel, position) {
        forEachObj(this.damagingList, (playerId, { color, easing, damageEnergy, energy }, i) => {
            const easingValue = easing.get()

            ctx.beginPath()
            ctx.arc(
                position.x,
                position.y,
                Player.AVATAR_SIZE.width * factorPixel * 1 * easingValue,
                0,
                2 * Math.PI,
                false
            )
            ctx.fillStyle = replaceAlphaRgba(color, 1 - easingValue * 0.3)
            ctx.fill()

            //life bar bg
            let barWidth = Player.AVATAR_SIZE.width * factorPixel * 2
            let barHeight = 8 * factorPixel
            let x = position.x - barWidth / 2
            let y = position.y + barHeight * 2.8 + ((barHeight + 10) * i)
            ctx.beginPath()
            ctx.rect(x, y, barWidth, barHeight)
            ctx.fillStyle = '#afafaf'
            ctx.fill()

            //life bar
            // console.log(barWidth, barWidth * (1 - (damageEnergy / energy)))
            // let damageFactor = barWidth - (barWidth * (damageEnergy / energy) * easingValue)
            // console.log(barWidth - (barWidth * (damageEnergy / energy) * easingValue))
            ctx.beginPath()
            ctx.rect(x, y, (barWidth * ((1 - (damageEnergy / energy) * (1 - easingValue)))), barHeight)
            ctx.fillStyle = this.color
            ctx.fill()
        })
    }
    drawDead(ctx, factorPixel, position) {
        ctx.beginPath()
        ctx.arc(
            position.x,
            position.y,
            Player.AVATAR_SIZE.width * factorPixel * 0.62,
            0,
            2 * Math.PI,
            false
        )
        ctx.fillStyle = Player.DEAD_COLOR
        ctx.fill()
    }
    drawAttack(ctx, factorPixel, position) {
        const value = this.attackCircle.get()
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
        ctx.fillStyle = replaceAlphaRgba(this.color, (1 - value / config().GAME.ATTACK_RADIUS))

        ctx.fill()
    }
    drawAvatar(ctx, position, img, width, height) {
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            position.x - width / 2,
            position.y - height / 2,
            width,
            height
        )
    }
}
/*
   map.easeTo({
                    duration: 3000,
                    center: center,
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
                */