import Text from '../text'
import { describe, expect, test } from '@jest/globals'

describe('word Wrapper class Word', () => {
    const testText = 'Some Words with. special characters! 1234 5678 90.'
    const text = new Text(testText)

    test('words should be text splitted by space', () => {
        expect(text.words.map((w) => w.value).join(' ')).toBe(testText)
    })
    test('number of alphabetic chars', () => {
        expect(text.alphaCharCount).toBe(30)
    })
    test('number of white space chars', () => {
        expect(text.whiteSpacesCount).toBe(7)
    })

    test('number of numeric chars', () => {
        expect(text.numberCharCount).toBe(10)
    })
    test('number of specialCharCount chars', () => {
        expect(text.specialCharCount).toBe(3)
    })
})
