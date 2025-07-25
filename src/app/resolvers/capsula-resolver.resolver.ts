import { inject } from '@angular/core'
import { Router, type ResolveFn } from '@angular/router'
import { of } from 'rxjs'
import { CapsulaApi } from '../api/capsula'
import { CapsulaModel } from '../models/capsula.model'

export const getCapsulaIdResolver: ResolveFn<string> = (route, state) => {
    return of(getCapsulaId())
}

export const getCapsulaByIdResolver: ResolveFn<CapsulaModel> = (route, state) => {
    const capsulaId = getCapsulaId()
    if (!capsulaId) {
        return of({} as CapsulaModel)
    }
    return inject(CapsulaApi).getById(capsulaId)
}

export const getModeFormCapsulaResolver: ResolveFn<string> = (route, state) => {
    return of(getMode())
}

function getCapsulaId() {
    const navigation = inject(Router).getCurrentNavigation()
    const capsulaId = navigation?.extras.state?.['capsulaID']
    if (!capsulaId) {
        return ''
    }
    return capsulaId
}

function getMode() {
    const navigation = inject(Router).getCurrentNavigation()
    const mode = navigation?.extras.state?.['mode']
    if (!mode) {
        return 'create'
    }
    return mode
}
