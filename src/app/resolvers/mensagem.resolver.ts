import { inject } from '@angular/core'
import { Router, type ResolveFn } from '@angular/router'
import { of } from 'rxjs'
import { MensagemApi } from '../api/mensagem'
import { MensagemModel } from '../models/mensagem.model'

export const getMensagensByCapsulaIdResolver: ResolveFn<MensagemModel[]> = (route, state) => {
    const capsulaId = getCapsulaId()
    if (!capsulaId) {
        return []
    }
    return inject(MensagemApi).list(capsulaId)
}

export const getMensagemByIdResolver: ResolveFn<MensagemModel> = (route, state) => {
    const capsulaId = getCapsulaId()
    const mensagemId = getMensagemId()
    if (!capsulaId || !mensagemId) {
        return of<MensagemModel>({} as MensagemModel)
    }
    return inject(MensagemApi).getById(capsulaId, mensagemId)
}

export const getModeFormMensagemResolver: ResolveFn<string> = (route, state) => {
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

function getMensagemId() {
    const navigation = inject(Router).getCurrentNavigation()
    const mensagemId = navigation?.extras.state?.['mensagemID']
    if (!mensagemId) {
        return ''
    }
    return mensagemId
}

function getMode() {
	const navigation = inject(Router).getCurrentNavigation()
	const mode = navigation?.extras.state?.['mode']
	if (!mode) {
		return 'create'
	}
	return mode
}