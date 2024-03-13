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
        id: details.id,
        name: details.name,
        url: url,
        sprites: details.sprites.front_default || "https://preview.redd.it/what-does-this-mean-v0-hyx2v97q0whb1.png?auto=webp&s=6ab725893f7a62e1be0b24e45397d268e4833eac", 
        abilities: details.abilities.map((ability) => ability.ability.name).slice(0, 4),
        height: details.height,
        weight: details.weight,
        types: details.types.map((type) => type.type.name),
      }))
    );
  }
  
}
