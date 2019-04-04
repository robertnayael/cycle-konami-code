import { MockedDOMSource } from '@cycle/dom'
import { DOMSource } from '@cycle/dom/lib/cjs/rxjs'
import { hot } from 'jest-marbles'
import { of, NEVER, Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { Button } from './'

function createButton(
    props: Button.Props,
    click$: Observable<any> = NEVER
) {
    const propsMock = of(props)

    const domSourceMock = new MockedDOMSource({
        button: {
            click: click$
        }
    }) as unknown as DOMSource

    const sources: Button.Sources = {
        DOM: domSourceMock,
        props: propsMock
    }

    const sinks = Button(sources)

    return sinks
}

describe('Button component', () => {

    it('should create', () => {
        const sinks = createButton({ activeLabel: 'label1', inactiveLabel: 'label2' })
        expect(sinks).toBeTruthy()
    })

    it.skip('should render a <button> element', () => {

    })

    it('should emit `false` on start and then `true` / `false` on toggle on and off', () => {
        const clicks$ =         hot('-----c---c-----c--c---c')
        const expectedOutput$ = hot('f----t---f-----t--f---t', { f: 'f', t: 't' })

        const sinks = createButton({ activeLabel: 'l1', inactiveLabel: 'l2' }, clicks$)

        const isActive$ = sinks.isActive.pipe(
            map(isActive => isActive ? 't' : 'f')
        )

        expect(isActive$).toBeObservable(expectedOutput$)
    })

    it.skip('should switch labels on toggle on and off', () => {

    })

})
