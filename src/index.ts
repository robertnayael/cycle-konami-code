import run from '@cycle/rxjs-run'
import { makeDOMDriver, DOMSource } from '@cycle/dom/lib/cjs/rxjs'
import { div, VNode } from '@cycle/dom'
import { combineLatest, of, Observable } from 'rxjs'
import { filter, map, scan, startWith, switchMap, takeUntil } from 'rxjs/operators'

import { makeKeyupDriver } from './keyupDriver'
import { Button } from './components'

type Sources = {
    DOM: DOMSource,
    keyup: Observable<string>
}

type Sinks = {
    DOM: Observable<VNode>
}

function main(sources: Sources): Sinks {
    const keyup$ = sources.keyup

    const button = Button({
        DOM: sources.DOM,
        props: of({
            inactiveLabel: '[change]',
            activeLabel: '[accept]'
        })
    })
    const buttonDOM$ = button.DOM
    const isButtonActive$ = button.isActive

    const state = model(keyup$, isButtonActive$)
    const DOM$ = view(state.currentSequence$, buttonDOM$, isButtonActive$)

    return { DOM: DOM$ }
}

function model(keyup$: Observable<string>, isButtonActive$: Observable<boolean>) {

    const recordingEnabled$ = isButtonActive$.pipe(
        filter(isActive => isActive)
    )

    const recordingDisabled$ = isButtonActive$.pipe(
        filter(isActive => !isActive)
    )

    const currentSequence$ = recordingEnabled$.pipe(
        switchMap(() => keyup$.pipe(
            startWith([]),
            scan<string, string[]>((sequence, key) => [ ...sequence, key ]),
            takeUntil(recordingDisabled$)
        )),
        startWith([ 'a', 'b', 'c' ])
    )

    return {
        currentSequence$
    }

}

function view(
    currentSequence$: Observable<string[]>,
    buttonDOM$: Observable<VNode>,
    isButtonActive$: Observable<boolean>
) {
    return combineLatest(currentSequence$, buttonDOM$, isButtonActive$).pipe(
        map(([ currentSequence, buttonDOM, isButtonActive ]) => div([
            div(`${isButtonActive ? 'New' : 'Current'} sequence: ${currentSequence.map(key => `[ ${key} ]`).join(' ')}`),
            buttonDOM
        ]))
    )
}

run(main, {
    DOM: makeDOMDriver('#app'),
    keyup: makeKeyupDriver()
})
