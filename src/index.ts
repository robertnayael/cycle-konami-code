import run from '@cycle/rxjs-run'
import { div, makeDOMDriver, DOMSource, VNode } from '@cycle/dom'
import { Observable, of, combineLatest, merge } from 'rxjs'
import { map, mapTo } from 'rxjs/operators'

import { makeKeyupDriver } from './keyupDriver'
import { Input } from './components'

type Sources = {
    DOM: DOMSource,
    keyup: Observable<string>
}

type Sinks = {
    DOM: Observable<VNode>
}

function main(sources: Sources): Sinks {
    const keyup$ = sources.keyup

    const inputSources: Input.Sources = {
        DOM: sources.DOM,
        props: of({
            label: 'label',
            initialValue: 'initial value'
        })
    }

    const input = Input(inputSources)
    const {
        DOM: inputVDom$,
        value: inputValue$,
        focus: inputFocus$,
        blur: inputBlur$
    } = input

    const hasFocus$ = merge(
        inputFocus$.pipe(mapTo(true)),
        inputBlur$.pipe(mapTo(false))
    )

    const DOM = combineLatest(inputVDom$, inputValue$, hasFocus$).pipe(
        map(([ inputVDom, inputValue, hasFocus ]) => div([
            inputVDom,
            div(`Input value: ${inputValue}`),
            div(`input is ${hasFocus ? '' : 'not'} focused`)
        ]))
    )

    const sinks = { DOM }
    return sinks
}

run(main, {
    DOM: makeDOMDriver('#app'),
    keyup: makeKeyupDriver()
})
