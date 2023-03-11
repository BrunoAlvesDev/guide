import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  /* Foi necessário utilizar a ferramenta 'alloworigins.win' pois o Yahoo Finance possui
  regras de segurança que impedem a API de ser acessada de forma externa (CORS) */

  /* Foi criado a interface para a requisição dos dados do ativo, porém o retorno da propriedade
  'contents' está sendo feito no formato de string, há a possibilidade de contornarmos isso criando
  um objeto com duas tipagens, mas para evitar possíveis inconsistências futuras, preferi usar
  'any'. Nesse caso, a solução ideal seria que o endpoint retornasse o objeto sem estar convertido
  para string */

  public getStockData(): Observable<any> {
    return this.http.get(
      'https://api.allorigins.win/get?url=' +
        environment.api +
        'v8/finance/chart/TAEE11.SA'
    );
  }
}
