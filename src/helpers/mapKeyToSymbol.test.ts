import { mapKeyToSymbol } from './mapKeyToSymbol'

describe('`mapKeyToSymbol` helper', () => {

    it('for lowercase letters, it returns them unchanged', () => {
        expect(mapKeyToSymbol('a')).toBe('a')
    })

    it('for uppercase letters, it returns lowercase letters', () => {
        expect(mapKeyToSymbol('A')).toBe('a')
    })

    it('for number characters, it returns them unchanged', () => {
        expect(mapKeyToSymbol('5')).toBe('5')
    })

    it('for punctuation symbols, it returns them unchanged', () => {
        expect(mapKeyToSymbol('.')).toBe('.')
        expect(mapKeyToSymbol(',')).toBe(',')
        expect(mapKeyToSymbol('/')).toBe('/')
    })

    it('maps special keys to symbols', () => {
        expect(mapKeyToSymbol('Enter')).toBe('[Enter]')
        expect(mapKeyToSymbol('ArrowUp')).toBe('⇧')
    })

    it('maps unrecognized keys to `null`', () => {
        expect(mapKeyToSymbol('F1')).toBe(null)
    })

})
