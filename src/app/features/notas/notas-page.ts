import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrosApi, NotaFiscal } from '../../core/models/nota-fiscal';
import { NotasApiService } from '../../core/services/notas-api.service';

type OrdenacaoValor = 'asc' | 'desc' | null;

@Component({
  selector: 'app-notas-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './notas-page.html',
  styleUrl: './notas-page.css',
})
export class NotasPage implements OnInit {
  private readonly api = inject(NotasApiService);
  private readonly fb = inject(FormBuilder);

  protected readonly notas = signal<NotaFiscal[]>([]);
  protected readonly filtroCliente = signal('');
  protected readonly ordenacaoValor = signal<OrdenacaoValor>(null);
  protected readonly enviando = signal(false);
  protected readonly erroApi = signal<string | null>(null);
  protected readonly sucesso = signal<string | null>(null);
  protected readonly carregando = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    numero: ['', Validators.required],
    cliente: ['', Validators.required],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    dataEmissao: ['', Validators.required],
  });

  protected readonly notasExibidas = computed(() => {
    const termo = this.filtroCliente().trim().toLowerCase();
    let lista = this.notas();

    if (termo) {
      lista = lista.filter((nota) => nota.cliente.toLowerCase().includes(termo));
    }

    const ordem = this.ordenacaoValor();
    if (!ordem) {
      return lista;
    }

    return [...lista].sort((a, b) =>
      ordem === 'asc' ? a.valor - b.valor : b.valor - a.valor,
    );
  });

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    this.carregando.set(true);
    this.api.listar().subscribe({
      next: (notas) => {
        this.notas.set(notas);
        this.carregando.set(false);
      },
      error: () => {
        this.erroApi.set('Não foi possível carregar as notas fiscais.');
        this.carregando.set(false);
      },
    });
  }

  protected cadastrar(): void {
    this.erroApi.set(null);
    this.sucesso.set(null);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { numero, cliente, valor, dataEmissao } = this.formulario.getRawValue();
    this.enviando.set(true);

    this.api
      .cadastrar({
        numero: numero.trim(),
        cliente: cliente.trim(),
        valor: Number(valor),
        dataEmissao,
      })
      .subscribe({
        next: (nota) => {
          this.notas.update((atuais) => [nota, ...atuais]);
          this.formulario.reset();
          this.sucesso.set(`Nota ${nota.numero} cadastrada.`);
          this.enviando.set(false);
        },
        error: (erro: HttpErrorResponse) => {
          this.erroApi.set(this.lerErro(erro));
          this.enviando.set(false);
        },
      });
  }

  protected atualizarFiltro(valor: string): void {
    this.filtroCliente.set(valor);
  }

  protected alternarOrdenacaoValor(): void {
    const atual = this.ordenacaoValor();
    this.ordenacaoValor.set(atual === 'asc' ? 'desc' : atual === 'desc' ? null : 'asc');
  }

  protected campoInvalido(nome: 'numero' | 'cliente' | 'valor' | 'dataEmissao'): boolean {
    const campo = this.formulario.controls[nome];
    return campo.invalid && campo.touched;
  }

  private lerErro(erro: HttpErrorResponse): string {
    const corpo = erro.error as ErrosApi | undefined;
    if (corpo?.erros?.length) {
      return corpo.erros.join(' ');
    }

    return 'Não foi possível cadastrar a nota fiscal.';
  }
}
