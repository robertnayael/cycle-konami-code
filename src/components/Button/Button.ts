import { button, DOMSource, VNode } from '@cycle/dom'
import { combineLatest, of, Observable } from 'rxjs'
import { map, scan, share, shareReplay, startWith } from 'rxjs/operators'

export namespace Button {

    export interface Props {
        activeLabel: string
        inactiveLabel: string
    }

    export interface Sources {
        DOM: DOMSource,
        props: Observable<Props>
    }

    export interface Sinks {
        DOM: Observable<VNode>
        isActive: Observable<boolean>
    }
}

export function Button({ DOM, keyup: keyup$, props: props$ }: Button.Sources): Button.Sinks {

    const click$ = (DOM.select('button').events('click') as unknown as Observable<Event>)
    .pipe(share())

    const isActive$ = click$.pipe(
        startWith(false),
        scan<any, boolean>((wasActive, _) => !wasActive),
        shareReplay(1)
    )

    const DOM$ = combineLatest(isActive$, props$).pipe(
        map(([ isActive, { activeLabel, inactiveLabel } ]) =>
            button(isActive ? activeLabel : inactiveLabel))
    )

    return {
        DOM: DOM$,
        isActive: isActive$
    }
}
