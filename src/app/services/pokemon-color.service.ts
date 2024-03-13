import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PokemonColorService {
  typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    unknown: '#68A090',
    shadow: '#705898',
  };

  constructor() {}

  // Método para obtener el color correspondiente a un tipo de Pokémon
  getTypeColor(type: string): string {
    return this.typeColors[type.toLowerCase()] || '#000000'; // Si el tipo no está definido, retorna negro
  }
}
