import Word from '../word'
import { describe, expect, test } from '@jest/globals'

describe('word Wrapper class Word', () => {
    const unwrappedWord = 'Volumenometer'
    const unwrappedWordLowerCase = unwrappedWord.toLowerCase()
    const word1 = new Word(unwrappedWord)
    const word1LowerCase = new Word(unwrappedWordLowerCase)
    test('length should return value length', () => {
        expect(word1.length).toBe(word1.value.length)
        expect(word1.length).toBe(unwrappedWord.length)
    })
    test('equals should compare value', () => {
        expect(word1.equals(word1LowerCase)).toBe(false)
        expect(word1.equals(word1)).toBe(true)
    })
    test('isSameWord should compare lowerCase value', () => {
        const word2 = new Word('anyOtherWord')
        expect(word1.isSameWord(word1)).toBe(true)
        expect(word1.isSameWord(word1LowerCase)).toBe(true)
        expect(word1.isSameWord(word2)).toBe(false)
    })
    test('toString should be value', () => {
        expect(word1.toString()).toBe(word1.value)
    })
})
