import { DOMSource, MockedDOMSource } from '@cycle/dom'
import { hot } from 'jest-marbles'
import { of, NEVER, Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { Button } from './'

function getButtonFixture(
    props: Button.Props,
    click$: Observable<any> = NEVER
) {
    const propsMock = of(props)

    const clickSubject = new Subject()
    const triggerClick = () => clickSubject.next('click')

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

    return {
        sinks,
        triggerClick
    }
}

describe('Button component', () => {

    it('should create', () => {
        const fixture = getButtonFixture({ activeLabel: 'label1', inactiveLabel: 'label2' })
        expect(fixture.sinks).toBeTruthy()
    })

    it.skip('should render a <button> element', () => {

    })

    it('should emit `false` on start and then `true` / `false` on toggle on and off', () => {
        const clicks$ =          hot('-----c---c-----c--c---c')
        const expectedOutput$ = hot('f----t---f-----t--f---t', { f: 'f', t: 't' })

        const fixture = getButtonFixture({ activeLabel: 'l1', inactiveLabel: 'l2' }, clicks$)

        const isActive$ = fixture.sinks.isActive.pipe(
            map(isActive => isActive ? 't' : 'f')
        )

        expect(isActive$).toBeObservable(expectedOutput$)
    })

    it.skip('should switch labels on toggle on and off', () => {

    })

})
