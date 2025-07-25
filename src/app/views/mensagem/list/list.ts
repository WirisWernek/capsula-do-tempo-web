import { DatePipe } from '@angular/common'
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { ActivatedRoute, Router } from '@angular/router'
import { MensagemApi } from '../../../api/mensagem'
import { MensagemModel } from '../../../models/mensagem.model'
import { LimitPipe } from '../../../pipes/limit.pipe'
import { Alert } from '../../../service/alert'

@Component({
    selector: 'app-list',
    imports: [MatTableModule, MatPaginatorModule, DatePipe, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, LimitPipe],
    templateUrl: './list.html',
    styleUrl: './list.scss',
})
export class List implements AfterViewInit {
    displayedColumns: string[] = ['id', 'nomeCriador', 'emailCriador', 'enviada', 'dataCriacao', 'actions']
    dataSource = new MatTableDataSource<MensagemModel>()
    private mensagemApi = inject(MensagemApi)
    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private alert = inject(Alert)
    private capsulaId = ''

    @ViewChild(MatPaginator) paginator!: MatPaginator

    ngAfterViewInit() {
        const mensagens = this.route.snapshot.data['mensagens'] as MensagemModel[]
        const capsulaID = this.route.snapshot.data['capsulaID'] as string
        if (mensagens && capsulaID) {
            this.dataSource.data = mensagens
            this.capsulaId = capsulaID
        } else {
            this.router.navigateByUrl('/capsula/list')
        }
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

    novaMensagem() {
        this.router.navigateByUrl('/mensagem/form', { state: { capsulaID: this.capsulaId } })
    }

    viewMensagem(mensagemID: string) {
        this.router.navigateByUrl('/mensagem/form', { state: { capsulaID: this.capsulaId, mensagemID: mensagemID, mode: 'view' } })
    }
    editMensagem(mensagemID: string) {
        this.router.navigateByUrl('/mensagem/form', { state: { capsulaID: this.capsulaId, mensagemID: mensagemID, mode: 'edit' } })
    }
    deleteMensagem(mensagemID: string) {
        this.mensagemApi.delete(this.capsulaId, mensagemID).subscribe({
            next: () => {
                console.log('Mensagem deleted successfully')
                this.dataSource.data = this.dataSource.data.filter((mensagem) => mensagem.id !== mensagemID)
                this.alert.showSuccess('Mensagem excluída com sucesso!')
            },
            error: (error) => {
                console.error('Error deleting mensagem:', error)
            },
        })
    }

    voltar() {
        this.router.navigateByUrl('/capsula/list')
    }
}
