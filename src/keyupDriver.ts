import { fromEvent } from 'rxjs'
import { pluck } from 'rxjs/operators'

export const makeKeyupDriver = () => () =>
    fromEvent<KeyboardEvent>(document, 'keyup').pipe(
        pluck('key')
    )
