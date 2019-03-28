import run from '@cycle/rxjs-run'
import { div, makeDOMDriver, DOMSource, VNode } from '@cycle/dom'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { makeKeyupDriver } from './keyupDriver'

type Sources = {
    DOM: DOMSource,
    keyup: Observable<string>
}

type Sinks = {
    DOM: Observable<VNode>
}

function main(sources: Sources): Sinks {
    const keyup$ = sources.keyup

    const DOM = keyup$.pipe(
        map(key => div(key))
    )

    const sinks = { DOM }
    return sinks
}

run(main, {
    DOM: makeDOMDriver('#app'),
    keyup: makeKeyupDriver()
})
