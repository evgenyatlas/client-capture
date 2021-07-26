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