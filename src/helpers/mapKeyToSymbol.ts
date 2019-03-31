/**
 * Maps standard key values, like the ones available under `KeyboardEvent.key`,
 * to custom symbols.
 *
 * @param key standard key value
 * @returns custom key symbol, or null if the key is not allowed
 */
export function mapKeyToSymbol(key: string): string | null {
    if (isStandardAllowedKey(key)) {
        return key.toLocaleLowerCase()
    }

    if (allowedSpecialKeys.includes(key)) {
        return customKeySymbols[key] || key
    }

    return null
}

const isStandardAllowedKey = (key: string) =>
    key.length === 1 &&
    /[a-zA-Z0-9\.,;'\[\]\\\/]/.test(key)

const allowedSpecialKeys = [
    'Enter',
    'Tab',
    ' ',
    'ArrowDown',
    'ArrowUp',
    'ArrowLeft',
    'ArrowRight',
    'End',
    'Home',
    'PageDown',
    'PageUp'
]

const customKeySymbols = {
    Enter: '[Enter]',
    Tab: '[Tab]',
    ' ': '[Space]',
    ArrowDown: '⇩',
    ArrowUp: '⇧',
    ArrowLeft: '⇦',
    ArrowRight: '⇨',
    End: '[End]',
    Home: '[Home]',
    PageDown: '[Page Down]',
    PageUp: '[Page Up]'
}
