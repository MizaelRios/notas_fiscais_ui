export interface NotaFiscal {
  id: string;
  numero: string;
  cliente: string;
  valor: number;
  valorFormatado: string;
  dataEmissao: string;
  dataCadastro: string;
}

export interface CadastrarNotaFiscal {
  numero: string;
  cliente: string;
  valor: number;
  dataEmissao: string;
}

export interface ErrosApi {
  erros?: string[];
}
