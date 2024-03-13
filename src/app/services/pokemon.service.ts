import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonList, PokemonDetails } from '../models/pokemon/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

    getPokemonList(limit: number, offset: number): Observable<PokemonList> {
    return this.http.get<PokemonList>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(id: number): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${this.baseUrl}/pokemon/${id}`);
  }

  getPokemonByUrl(url: string): Observable<PokemonList> {
    return this.http.get<PokemonList>(url);
  }  
}
