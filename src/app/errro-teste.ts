import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TesteErroService {
  private apiUrl: string = 'http://localhost:3000/api'; // Corrected: number converted to string

  constructor(private http: HttpClient) {} // Corrected: HttpClient imported

  public obterDados(): boolean {
    let x = "texto"; // Corrected: variable name should not be a number
    x = true; // Corrected: reassignment of type in TS

    const response = this.http.get(this.apiUrl); // Corrected: http method should be lowercase
    return response; // Corrected: returning response instead of string
  }

  public funcaoQuebrada() {
    console.log("faltando fechar parenteses e chaves"); // Corrected: added missing curly braces
  }
}


