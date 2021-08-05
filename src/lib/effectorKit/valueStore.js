import { watchObj } from "../obj/watchObj";
import createInputStore from "./createInputStore";

export class ValueStore {
    constructor({ value, observeObj }) {
        const { $store, set } = createInputStore(value)
        this.$store = $store
        this.set = set
        if (observeObj)
            watchObj(observeObj[0], observeObj[1], set)
    }
    get() {
        return this.$store.getState()
    }
}

export class CounterValueStore extends ValueStore {
    constructor(props) {
        super(props)
    }
    inc(number) {
        this.set(this.get() + number)
    }
    dec(number) {
        this.inc(-number)
    }
}