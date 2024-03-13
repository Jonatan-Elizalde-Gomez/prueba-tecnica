import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  PokemonList,
  PokemonDetails,
  PokemonListItem,
} from '../models/pokemon/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private allPokemons: PokemonListItem[] = [];

  constructor(private http: HttpClient) {}

  // Función para obtener todos los Pokémon
  getAllPokemons(): Observable<PokemonList> {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=1320';
    return this.http.get<PokemonList>(url).pipe(
      tap((list) => (this.allPokemons = list.results)) // Guarda todos los pokemons en la propiedad
    );
  }

  // Función para obtener detalles de los Pokémon de manera paginada
  getPokemonDetailsByBatch(
    offset: number,
    limit: number = 20
  ): Observable<PokemonListItem[]> {
    const pokemonsForDetails = this.allPokemons.slice(offset, offset + limit);
    return forkJoin(
      pokemonsForDetails.map((pokemon) =>
        this.getPokemonDetailsByUrl(pokemon.url)
      )
    );
  }

  // Función para realizar la búsqueda de Pokémon por nombre
  searchPokemonByName(name: string): Observable<PokemonListItem[]> {
    const searchTerm = name.trim().toLowerCase();
    const searchResult = this.allPokemons
      .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm))
      .slice(0, 20);
    if (searchResult.length === 0) {
      return of([]); // Retorna un observable vacío si no hay resultados
    } else {
      return forkJoin(
        searchResult.map((pokemon) => this.getPokemonDetailsByUrl(pokemon.url))
      );
    }
  }

  // Función para obtener el detalle de un Pokémon por su URL
  private getPokemonDetailsByUrl(url: string): Observable<PokemonListItem> {
    return this.http.get<PokemonDetails>(url).pipe(
      map((details) => ({
        name: details.name,
        url: url,
        abilities: details.abilities,
        height: details.height,
        weight: details.weight,
        types: details.types.map((type) => type.type.name),
      }))
    );
  }
}
