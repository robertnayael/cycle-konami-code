import { form, label, input, DOMSource, VNode } from '@cycle/dom'
import { Observable, of, concat, combineLatest } from 'rxjs'
import { map, mapTo, pluck, startWith } from 'rxjs/operators'

function intent(DOM: DOMSource) {
    const inputValue$ = (DOM
        .select('.input')
        .events('input') as unknown as Observable<Event>)
        .pipe(
            map(event => (<HTMLInputElement>event.target).value)
        )

    const inputFocus$ = (DOM
        .select('.input')
        .events('focus') as unknown as Observable<Event>)
        .pipe(mapTo(null))

    const inputBlur$ = (DOM
        .select('.input')
        .events('blur') as unknown as Observable<Event>)
        .pipe(mapTo(null), startWith(null))

    return {
        inputValue$,
        inputFocus$,
        inputBlur$
    }
}

export function Input(sources: Input.Sources): Input.Sinks {

    const {
        inputValue$,
        inputFocus$,
        inputBlur$
    } = intent(sources.DOM)

    const props$ = sources.props

    const initialValue$ = props$.pipe(pluck('initialValue'))
    const labelText$ = props$.pipe(pluck('label'))

    const currentValue$ = concat(initialValue$, inputValue$)

    const vDom$ = combineLatest(currentValue$, labelText$).pipe(
        map(([ value, labelText ]) => form('.wrapper', [
            label(
                '.label',
                {
                    attrs: {
                        for: 'input-field'
                    }
                },
                labelText
            ),
            input('.input', {
                attrs: {
                    value,
                    name: 'input-field',
                    id: 'input-field'
                }
            })
        ]))
    )

    return {
        DOM: vDom$,
        value: currentValue$,
        focus: inputFocus$,
        blur: inputBlur$
    }
}

export namespace Input {

    export interface Props {
        label: string
        initialValue?: string
    }

    export interface Sources {
        DOM: DOMSource
        props: Observable<Props>
    }

    export interface Sinks {
        DOM: Observable<VNode>,
        value: Observable<string>,
        focus: Observable<boolean>
        blur: Observable<boolean>
    }

}
