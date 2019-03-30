import { form, label, input, DOMSource, VNode } from '@cycle/dom'
import { Observable, of, concat, combineLatest } from 'rxjs'
import { map, mapTo, pluck, startWith } from 'rxjs/operators'

function intent(DOM: DOMSource): Actions {
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

function model(actions: Actions, props$: Observable<Input.Props>): Observable<State> {
    const initialValue$ = props$.pipe(pluck('initialValue'))
    const labelText$ = props$.pipe(pluck('label'))
    const currentValue$ = concat(initialValue$, actions.inputValue$)

    return combineLatest(labelText$, currentValue$).pipe(
        map(([ labelText, currentValue ]) => ({
            labelText,
            currentValue
        }))
    )
}

function view(state$: Observable<State>): Observable<VNode> {
    return state$.pipe(
        map(({ currentValue, labelText }) => form('.wrapper', [
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
                    currentValue,
                    name: 'input-field',
                    id: 'input-field'
                }
            })
        ]))
    )
}

export function Input(sources: Input.Sources): Input.Sinks {

    const actions = intent(sources.DOM)
    const state$ = model(actions, sources.props)
    const vDom$ = view(state$)

    const currentValue$ = state$.pipe(pluck('currentValue'))

    return {
        DOM: vDom$,
        value: currentValue$,
        focus: actions.inputFocus$,
        blur: actions.inputBlur$
    }
}

interface Actions {
    inputValue$: Observable<string>
    inputFocus$: Observable<void>
    inputBlur$: Observable<void>
}

interface State {
    currentValue: string
    labelText: string
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
        focus: Observable<void>
        blur: Observable<void>
    }

}
