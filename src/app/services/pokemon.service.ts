import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PokemonList, PokemonDetails, PokemonListItem } from '../models/pokemon/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private nextUrl: string | null = null;

  constructor(private http: HttpClient) { }

  // Funcion para obtener la lista de pokemons con los detalles de cada uno
  getPokemonListWithDetails(url:string): Observable<PokemonListItem[]> {
    return this.http.get<PokemonList>(url).pipe(
      switchMap(list => {
        this.nextUrl = list.next;
        const detailsRequests = list.results.map(pokemon => this.getPokemonDetailsByUrl(pokemon.url));
        return forkJoin(detailsRequests);
      })
    );
  }

  // Funcion para obtener el detalle de un pokemon
  getPokemonDetailsByUrl(url: string): Observable<PokemonListItem> {
    return this.http.get<PokemonDetails>(url).pipe(
      map(details => ({
        name: details.name,
        url: url,
        abilities: details.abilities,
        height: details.height,
        weight: details.weight,
        types: details.types
      }))
    );
  }
  
  // Funcion para obtener el valor de nextUrl
  getNextUrl(): string | null {
    return this.nextUrl;
  }

}
