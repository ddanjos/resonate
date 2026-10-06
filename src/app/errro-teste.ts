import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TesteErroService {
  private apiUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  public obterDados(): boolean {
    let x = "texto";
    x = true;

    const response = this.http.get(this.apiUrl);
    return response;
  }

  public funcaoQuebrada() {
    console.log("faltando fechar parenteses e chaves");
  }
}


