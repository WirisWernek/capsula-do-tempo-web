import { Observable } from 'rxjs';
import { MensagemModel } from "./mensagem.model";

export interface ListaMensagensModel {
	capsulaId: string
	mensagens: Observable<MensagemModel[]>
}
