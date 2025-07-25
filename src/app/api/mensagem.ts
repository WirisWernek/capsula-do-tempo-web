import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { MensagemModel } from '../models/mensagem.model'

@Injectable({
    providedIn: 'root',
})
export class MensagemApi {
    private readonly baseUrl = environment.baseUrl.concat('/capsulas')
    private readonly client = inject(HttpClient)

    create(capsulaID: string, mensagem: MensagemModel): Observable<MensagemModel> {
        return this.client.post<MensagemModel>(`${this.baseUrl}/${capsulaID}/mensagens`, mensagem)
    }

    getById(capsulaID: string, mensagemID: string): Observable<MensagemModel> {
        return this.client.get<MensagemModel>(`${this.baseUrl}/${capsulaID}/mensagens/${mensagemID}`)
    }

    update(capsulaID: string, mensagemID: string, mensagem: MensagemModel): Observable<MensagemModel> {
        return this.client.put<MensagemModel>(`${this.baseUrl}/${capsulaID}/mensagens/${mensagemID}`, mensagem)
    }

    delete(capsulaID: string, mensagemID: string): Observable<void> {
        return this.client.delete<void>(`${this.baseUrl}/${capsulaID}/mensagens/${mensagemID}`)
    }

    list(capsulaID: string): Observable<MensagemModel[]> {
        return this.client.get<MensagemModel[]>(`${this.baseUrl}/${capsulaID}/mensagens`)
    }
}
