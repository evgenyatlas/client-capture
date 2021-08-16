type rgba = (string | number)[]

/**
 * Класс для работы с RGBA
 */
export class RGBA {
    #rgba: rgba;
    #str: string
    alpha: number

    constructor(rgba: rgba) {
        this.#rgba = rgba
        this.#str = RGBA.rgba2str(rgba)
        this.alpha = this.#rgba[3] !== undefined ? +this.#rgba[3] : 1
    }

    print(alpha: number) {
        return alpha ?
            RGBA.rgba2str(this.#rgba, alpha)
            :
            this.#str
    }

    /**
    Создание экземпляра из строки
    */
    static fromStr(str: string): RGBA {
        const rgba = str.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),(\d+)/i)
        if (rgba === null) throw new Error('the str is not rgba')
        return new RGBA(rgba.slice(1))
    }

    static rgba2str(rgba: rgba, alpha?: number): string {
        return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${alpha ? alpha : rgba[3]})`
    }
}