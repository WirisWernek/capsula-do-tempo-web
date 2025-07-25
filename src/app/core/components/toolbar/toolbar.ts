import { Component } from '@angular/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterOutlet } from '@angular/router'

@Component({
    selector: 'app-toolbar',
    imports: [RouterOutlet, MatToolbarModule],
    templateUrl: './toolbar.html',
    styleUrl: './toolbar.scss',
})
export class Toolbar {}
