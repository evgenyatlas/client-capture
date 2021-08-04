import createInputStore from "./createInputStore";

export class ValueStore {
    constructor(value, observable) {
        Object.defineProperty()
        const { $store, set } = createInputStore(value)
        this.$store = $store
        this.set = set
    }
    get() {
        return this.$store.getState()
    }
}