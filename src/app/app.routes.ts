import { Routes } from '@angular/router'

export const routes: Routes = [
    {
		path: '',
		loadComponent: () => import('./core/components/toolbar/toolbar').then((m) => m.Toolbar),
        loadChildren: () => import('./views/view.routes').then((r) => r.VIEW_ROUTES),
	},

	
]
