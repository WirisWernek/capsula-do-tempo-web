import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ActivatedRoute, Router } from '@angular/router'
import { CapsulaApi } from '../../../api/capsula'
import { CapsulaModel } from '../../../models/capsula.model'
import { ModoEnum } from '../../../models/enums/modo.enum'
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
    private readonly capsulaApi = inject(CapsulaApi)
    private readonly router = inject(Router)
    private readonly route = inject(ActivatedRoute)
    private readonly alert = inject(Alert)
    private capsulaId = ''
    mode: ModoEnum = ModoEnum.CREATE
    capsulaForm: FormGroup

    constructor() {
        this.capsulaForm = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3)]],
            dataExpiracao: ['', Validators.required],
        })
    }

    ngAfterViewInit(): void {
        const params = this.loadParams()
        this.loadByMode(params)
    }

    loadByMode(params: { capsula: CapsulaModel | null; mode: string }) {
        switch (params.mode) {
            case 'edit':
                this.mode = ModoEnum.EDIT
                this.patchData(params.capsula)
                break
            case 'view':
                this.mode = ModoEnum.VIEW
                this.patchData(params.capsula)
                this.capsulaForm.disable()
                break
            case 'create':
                this.mode = ModoEnum.CREATE
                break
            default:
                this.alert.showError('Modo inválido para o formulário de cápsula')
                this.router.navigateByUrl('/mensagem/list', { state: { capsulaID: this.capsulaId } })
                break
        }
    }

    patchData(capsula: CapsulaModel | null = null) {
        if (!capsula) {
            this.alert.showError('Cápsula não encontrada')
            this.router.navigateByUrl('/capsula/list', { state: { capsulaID: this.capsulaId } })
            return
        }
        this.capsulaId = capsula.id
        const dataExpiracao = new Date(capsula.dataExpiracao)
        dataExpiracao.setHours(dataExpiracao.getHours() + 3) // Adjusting for timezone if necessary

        this.capsulaForm.patchValue({
            nome: capsula.nome,
            dataExpiracao: dataExpiracao,
        })
    }

    enviar() {
        switch (this.mode) {
            case ModoEnum.CREATE:
                this.criarCapsula()
                break
            case ModoEnum.EDIT:
                this.editarCapsula()
                break
            default:
                this.alert.showError('Modo inválido para o envio da cápsula')
                break
        }
    }

    criarCapsula() {
        if (this.capsulaForm.valid) {
            const capsulaData = this.capsulaForm.getRawValue() as CapsulaModel

            this.capsulaApi.create(capsulaData).subscribe({
                complete: () => {
                    this.alert.showSuccess('Cápsula criada com sucesso')
                    this.router.navigateByUrl('/capsula/list')
                },
                error: (error) => {
                    console.error('Erro ao criar cápsula:', error)
                    this.alert.showError('Erro ao criar cápsula')
                },
            })
        } else {
            this.alert.showError('Formulário inválido')
        }
    }

    editarCapsula() {
        if (this.capsulaForm.valid) {
            const capsulaData = this.capsulaForm.getRawValue() as CapsulaModel

            this.capsulaApi.update(this.capsulaId, capsulaData).subscribe({
                complete: () => {
                    this.alert.showSuccess('Cápsula editada com sucesso')
                    this.router.navigateByUrl('/capsula/list')
                },
                error: (error) => {
                    console.error('Erro ao editar cápsula:', error)
                    this.alert.showError('Erro ao editar cápsula')
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
            capsula: (this.route.snapshot.data['capsula'] as CapsulaModel) || null,
            mode: this.route.snapshot.data['mode'] as string,
        }
    }
}
