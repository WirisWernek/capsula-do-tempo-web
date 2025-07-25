import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ActivatedRoute, Router } from '@angular/router'
import { MensagemApi } from '../../../api/mensagem'
import { ModoEnum } from '../../../models/enums/modo.enum'
import { MensagemModel } from '../../../models/mensagem.model'
import { Alert } from '../../../service/alert'

@Component({
    selector: 'app-form',
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule],
    providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form.html',
    styleUrl: './form.scss',
})
export class Form implements AfterViewInit {
    private readonly fb = inject(FormBuilder)
    private readonly mensagemApi = inject(MensagemApi)
    private readonly router = inject(Router)
    private readonly route = inject(ActivatedRoute)
    private readonly alert = inject(Alert)
    private capsulaId = ''
    private mensagemId = ''
    mode: ModoEnum = ModoEnum.CREATE
    mensagemForm: FormGroup

    constructor() {
        this.mensagemForm = this.fb.group({
            nomeCriador: ['', [Validators.required, Validators.minLength(3)]],
            emailCriador: ['', [Validators.required, Validators.email]],
            conteudo: ['', [Validators.required, Validators.minLength(10)]],
            dataEnvio: ['', [Validators.required]],
        })
    }

    ngAfterViewInit(): void {
        const params = this.loadParams()

        if (params.capsulaID) {
            this.capsulaId = params.capsulaID
            this.loadByMode(params)
        } else {
            this.alert.showError('Capsula ID é obrigatório')
            this.router.navigateByUrl('/capsula/list')
            this.router.navigateByUrl('/mensagem/list')
        }
    }

    loadByMode(params: { mensagem: MensagemModel | null; mode: string }) {
        switch (params.mode) {
            case 'edit':
                this.mode = ModoEnum.EDIT
                this.patchData(params.mensagem)
                break
            case 'view':
                this.mode = ModoEnum.VIEW
                this.patchData(params.mensagem)
                this.mensagemForm.disable()
                break
            case 'create':
                this.mode = ModoEnum.CREATE
                break
            default:
                this.alert.showError('Modo inválido para o formulário de mensagem')
                this.router.navigateByUrl('/mensagem/list', { state: { capsulaID: this.capsulaId } })
                break
        }
    }

    patchData(mensagem: MensagemModel | null = null) {
        if (!mensagem) {
            this.alert.showError('Mensagem não encontrada')
            this.router.navigateByUrl('/mensagem/list', { state: { capsulaID: this.capsulaId } })
            return
        }
        this.mensagemId = mensagem.id
        const dataEnvio = new Date(mensagem.dataEnvio)
        dataEnvio.setHours(dataEnvio.getHours() + 3) // Adjusting for timezone if necessary
        this.mensagemForm.patchValue({
            nomeCriador: mensagem.nomeCriador,
            emailCriador: mensagem.emailCriador,
            conteudo: mensagem.conteudo,
            dataEnvio: dataEnvio,
        })
    }

    enviar() {
        switch (this.mode) {
            case ModoEnum.CREATE:
                this.criarMensagem()
                break
            case ModoEnum.EDIT:
                this.editarMensagem()
                break
            default:
                this.alert.showError('Modo inválido para o envio da mensagem')
                break
        }
    }

    criarMensagem() {
        if (this.mensagemForm.valid) {
            const mensagemData = this.mensagemForm.getRawValue() as MensagemModel

            this.mensagemApi.create(this.capsulaId, mensagemData).subscribe({
                complete: () => {
                    this.alert.showSuccess('Mensagem criada com sucesso')
                    this.router.navigateByUrl('/mensagem/list', { state: { capsulaID: this.capsulaId } })
                },
                error: (error) => {
                    console.error('Erro ao criar mensagem:', error)
                    this.alert.showError('Erro ao criar mensagem')
                },
            })
        } else {
            this.alert.showError('Formulário inválido')
        }
    }

    editarMensagem() {
        if (this.mensagemForm.valid) {
            const mensagemData = this.mensagemForm.getRawValue() as MensagemModel
            this.mensagemApi.update(this.capsulaId, this.mensagemId, mensagemData).subscribe({
                complete: () => {
                    this.alert.showSuccess('Mensagem atualizada com sucesso')
                    this.router.navigateByUrl('/mensagem/list', { state: { capsulaID: this.capsulaId } })
                },
                error: (error) => {
                    console.error('Erro ao atualizar mensagem:', error)
                    this.alert.showError('Erro ao atualizar mensagem')
                },
            })
        } else {
            this.alert.showError('Formulário inválido')
        }
    }

    voltar() {
        this.router.navigateByUrl('/mensagem/list', { state: { capsulaID: this.capsulaId } })
    }

    private loadParams() {
        return {
            capsulaID: this.route.snapshot.data['capsulaID'] || null,
            mensagem: (this.route.snapshot.data['mensagem'] as MensagemModel) || null,
            mode: this.route.snapshot.data['mode'] as string,
        }
    }
}
