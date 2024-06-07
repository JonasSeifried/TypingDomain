export default class Word {
    readonly value: string
    readonly length: number
    constructor(word: string) {
        this.value = word
        this.length = word.length
    }
    get() {
        return this.value
    }
    toString() {
        return this.value
    }
    equals(other: Word) {
        return this.value === other.value
    }
    isSameWord(other: Word) {
        return this.value.toLowerCase() === other.value.toLowerCase()
    }
}
