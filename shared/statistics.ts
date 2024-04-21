export function calculateCorrectWordCount(typedText: string, text: string): number {
    let index = 0
    let numCorrectWords = 0
    for (const word of text.split(' ')) {
        if (word.length === 0) continue
        const typedWord = typedText.slice(index, index + word.length)
        index += word.length + 1 // +1 for the space
        if (word === typedWord) numCorrectWords++
    }
    return numCorrectWords
}

export function calculateCorrectLetterCount(typedText: string, text: string): number {
    let numCorrectLetters = 0
    for (const [index, char] of Array.from(text).entries()) {
        if (char.length === 0) continue
        if (char === typedText[index]) numCorrectLetters++
    }
    return numCorrectLetters
}
