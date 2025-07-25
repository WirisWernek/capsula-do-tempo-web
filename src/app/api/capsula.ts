import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { CapsulaModel } from '../models/capsula.model'

@Injectable({
    providedIn: 'root',
})
export class CapsulaApi {
    private readonly baseUrl = environment.baseUrl.concat('/capsulas')
    private readonly client = inject(HttpClient)

    create(capsula: CapsulaModel): Observable<CapsulaModel> {
        return this.client.post<CapsulaModel>(`${this.baseUrl}/`, capsula)
    }

    getById(capsulaID: string): Observable<CapsulaModel> {
        return this.client.get<CapsulaModel>(`${this.baseUrl}/${capsulaID}`)
    }

    update(capsulaID: string, capsula: CapsulaModel): Observable<CapsulaModel> {
        return this.client.put<CapsulaModel>(`${this.baseUrl}/${capsulaID}`, capsula)
    }

    delete(capsulaID: string): Observable<void> {
        return this.client.delete<void>(`${this.baseUrl}/${capsulaID}`)
    }

    list(): Observable<CapsulaModel[]> {
        return this.client.get<CapsulaModel[]>(`${this.baseUrl}/`)
    }
}
