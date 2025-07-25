import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
    providedIn: 'root',
})
export class Alert {
    private readonly snackBar = inject(MatSnackBar)

    showSuccess(message: string, action = 'OK', duration = 3000) {
        this.snackBar.open(message, action, {
            duration,
            panelClass: ['alert-success'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
        })
    }

    showError(message: string, action = 'OK', duration = 3000) {
        this.snackBar.open(message, action, {
            duration,
            panelClass: ['alert-error'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
        })
    }
}
