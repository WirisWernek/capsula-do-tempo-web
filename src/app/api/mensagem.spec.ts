import { TestBed } from '@angular/core/testing'

import { MensagemApi } from './mensagem'

describe('MensagemApi', () => {
    let service: MensagemApi

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(MensagemApi)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
