//Метод позволяющий отслеживать изменения полей обьекта 
export function watchObj(obj, prop, fn) {
    const nameSaved = Symbol(prop)
    obj[nameSaved] = obj[prop]
    Object.defineProperty(obj, prop, {
        enumerable: true,
        get: () => obj[nameSaved],
        configurable: true,
        set: (val) => {
            fn(val)
            return obj[nameSaved] = val
        }
    })
}