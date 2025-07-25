import { TestBed } from '@angular/core/testing'

import { CapsulaApi } from './capsula'

describe('CapsulaApi', () => {
    let service: CapsulaApi

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(CapsulaApi)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
