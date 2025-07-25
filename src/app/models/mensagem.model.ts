export interface MensagemModel {
	id: string
	conteudo: string
	nomeCriador: string
	emailCriador: string
	capsulaId: string
	dataEnvio: Date
	dataCriacao: Date
	eviada: boolean
}