import { calculateCorrectLetterCount, calculateCorrectWordCount } from '../statistics'
import { describe, expect, test } from '@jest/globals'

describe('calculateCorrectWordCount', () => {
    test('should return 0 for empty strings', () => {
        expect(calculateCorrectWordCount('', '')).toBe(0)
    })
    test('should return correct word count (9) if equal', () => {
        expect(
            calculateCorrectWordCount(
                'This is a short test text with 9 words.',
                'This is a short test text with 9 words.'
            )
        ).toBe(9)
    })
    test('should not matter how big the word difference is', () => {
        expect(
            calculateCorrectWordCount(
                'T h i s i s a s h owadawdawith 9 words.',
                'This is a short test text with 9 words.'
            )
        ).toBe(3)
    })
    test('should work if text longer than typedText', () => {
        expect(
            calculateCorrectWordCount(
                'T h i s i s a s h owadawdawith 9 words.',
                'This is a short test text with 9 words. This is longer.'
            )
        ).toBe(3)
    })
})

describe('calculateCorrectLetterCount', () => {
    test('should return 0 for empty strings', () => {
        expect(calculateCorrectLetterCount('', '')).toBe(0)
    })
    test('should return correct word count (42) if equal', () => {
        expect(
            calculateCorrectLetterCount(
                'This is a short test text with 42 letters.',
                'This is a short test text with 42 letters.'
            )
        ).toBe(42)
    })
    test('should work if text longer than typedText', () => {
        expect(
            calculateCorrectLetterCount(
                'T h i s i s a s h owadawdawith 9 words.',
                'This is a short test text with 9 words. This is longer.'
            )
        ).toBe(19)
    })
})
