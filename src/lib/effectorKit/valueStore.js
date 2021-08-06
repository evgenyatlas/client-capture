import { combine as combineE } from "effector";
import { watchObj } from "../obj/watchObj";
import createInputStore from "./createInputStore";

//Класс для создания значений, которые помещаются в effector store (которые можно просто связывать с react)
//Помимо этого у него есть возможность связываться с изменениями полей любого обьекта
//А так же склеивать этот store с другими
export class ValueStore {
    $store
    constructor({ value, observeObj, readOnly = false, combine }) {
        //Создаем store для хранения значения
        const { $store, set } = createInputStore(
            //Если передан обьект за которым наблюдаем, то записываем его значение в store
            observeObj ?
                observeObj[0][observeObj[1]]
                :
                value
        )
        this.$store = $store

        //Обьект с которым будем связываться 
        if (observeObj)
            watchObj(observeObj[0], observeObj[1], set)

        //Склеиваем с другими store 
        if (combine) {
            this.$store = combineE(this.$store, ...combine.stores, combine.fn)
        }

        this.set = readOnly ?
            //Если обьект только на чтение, то будем выкидывать исключение при попытке вызова set
            () => { throw new Error('read only') }
            :
            set
    }
    get() {
        return this.$store.getState()
    }
    //Создает новый ValueStore на основе текущего 
    //пропуская получаемае
    map(fn) {
        return {
            get: () => fn(this.get()),
            $store: this.$store.map(fn)
        }
    }
}

export class CombineValueStore extends ValueStore {
    constructor(props) {
        { stores, fn, observeObj, value, readOnly }
        super(props)
    }
    set() {

    }
    get() {
        return this.$store.getState()
    }
}


export class CounterValueStore extends ValueStore {
    #toFixed
    constructor(props) {
        super(props)
        if (props.toFixed) this.#toFixed = props.toFixed
    }
    inc(number) {
        const result = this.get() + number
        this.set(this.#toFixed ? +result.toFixed(this.#toFixed) : result)
    }
    dec(number) {
        this.inc(-number)
    }
}