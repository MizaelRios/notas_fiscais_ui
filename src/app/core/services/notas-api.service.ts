import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CadastrarNotaFiscal, NotaFiscal } from '../models/nota-fiscal';

@Injectable({ providedIn: 'root' })
export class NotasApiService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/notas';

  listar(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.url);
  }

  cadastrar(payload: CadastrarNotaFiscal): Observable<NotaFiscal> {
    return this.http.post<NotaFiscal>(this.url, payload);
  }
}
