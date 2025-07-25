import { Routes } from '@angular/router'
import { getCapsulaByIdResolver, getCapsulaIdResolver, getModeFormCapsulaResolver } from '../resolvers/capsula-resolver.resolver'
import { getMensagemByIdResolver, getMensagensByCapsulaIdResolver, getModeFormMensagemResolver } from '../resolvers/mensagem.resolver'

export const VIEW_ROUTES: Routes = [
    {
        path: 'capsula',
        children: [
            {
                path: 'list',
                loadComponent: () => import('./capsula/list/list').then((c) => c.List),
            },
            {
                path: 'form',
                loadComponent: () => import('./capsula/form/form').then((c) => c.Form),
                resolve: {
                    mode: getModeFormCapsulaResolver,
                    capsula: getCapsulaByIdResolver,
                },
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'list',
            },
        ],
    },
    {
        path: 'mensagem',
        children: [
            {
                path: 'list',
                loadComponent: () => import('./mensagem/list/list').then((c) => c.List),
                resolve: {
                    capsulaID: getCapsulaIdResolver,
                    mensagens: getMensagensByCapsulaIdResolver,
                },
            },
            {
                path: 'form',
                loadComponent: () => import('./mensagem/form/form').then((c) => c.Form),
                resolve: {
                    capsulaID: getCapsulaIdResolver,
                    mode: getModeFormMensagemResolver,
                    mensagem: getMensagemByIdResolver,
                },
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'list',
            },
        ],
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'capsula/list',
    },
]
