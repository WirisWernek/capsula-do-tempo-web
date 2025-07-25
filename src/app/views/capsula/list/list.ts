import { DatePipe } from '@angular/common'
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { Router } from '@angular/router'
import { CapsulaApi } from '../../../api/capsula'
import { CapsulaModel } from '../../../models/capsula.model'
import { LimitPipe } from '../../../pipes/limit.pipe'
import { Alert } from '../../../service/alert'

@Component({
    selector: 'app-list',
    imports: [MatTableModule, MatPaginatorModule, DatePipe, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, LimitPipe],
    templateUrl: './list.html',
    styleUrl: './list.scss',
})
export class List implements AfterViewInit {
    displayedColumns: string[] = ['id', 'nome', 'qtdMensagens', 'dataCriacao', 'dataExpiracao', 'actions']
    dataSource = new MatTableDataSource<CapsulaModel>()
    private readonly capsulaApi = inject(CapsulaApi)
    private readonly router = inject(Router)
    private readonly alert = inject(Alert)

    @ViewChild(MatPaginator) paginator!: MatPaginator

    ngAfterViewInit() {
        this.capsulaApi.list().subscribe({
            next: (capsulas: CapsulaModel[]) => {
                this.dataSource.data = capsulas
            },
            error: (error) => {
                console.error('Error fetching capsulas:', error)
            },
        })
        this.paginator.pageSizeOptions = [10, 25, 50]
        this.paginator.pageSize = 10
        this.dataSource.paginator = this.paginator
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage()
        }
    }

    novaCapsula() {
        this.router.navigateByUrl('/capsula/form')
    }

    viewCapsula(capsulaID: string) {
        this.router.navigateByUrl('/capsula/form', { state: { capsulaID: capsulaID, mode: 'view' } })
    }
    viewMessagesCapsula(capsulaID: string) {
        this.router.navigateByUrl('/mensagem', { state: { capsulaID } })
    }
    editCapsula(capsulaID: string) {
        this.router.navigateByUrl('/capsula/form', { state: { capsulaID: capsulaID, mode: 'edit' } })
    }
    deleteCapsula(capsulaID: string) {
        this.capsulaApi.delete(capsulaID).subscribe({
            next: () => {
                console.log('Capsula deleted successfully')
                this.alert.showSuccess('Capsula deleted successfully')
                this.dataSource.data = this.dataSource.data.filter((capsula) => capsula.id !== capsulaID)
            },
            error: (error) => {
                console.error('Error deleting capsula:', error)
            },
        })
    }
}
