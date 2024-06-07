import Word from './word'

export default class Text {
    words: Word[]
    text: string
    wordCount: number
    charCount: number
    alphaCharCount: number
    whiteSpacesCount: number
    numberCharCount: number
    specialCharCount: number

    constructor(text: string) {
        this.words = text.split(' ').map((w) => new Word(w))
        this.text = text
        this.wordCount = this.words.length
        this.charCount = this.text.split('').length
        this.alphaCharCount = (this.text.match(/[A-Za-z]/g) ?? []).length
        this.whiteSpacesCount = (this.text.match(/\s/g) ?? []).length
        this.numberCharCount = (this.text.match(/\d/g) ?? []).length
        this.specialCharCount =
            this.charCount - this.whiteSpacesCount - this.alphaCharCount - this.numberCharCount
    }
}
