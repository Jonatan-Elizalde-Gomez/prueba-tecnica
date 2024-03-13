import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonListItem } from '../../models/pokemon/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
})
export class PokemonListComponent implements OnInit {
  pokemonList: PokemonListItem[] = [];
  originalPokemonList: PokemonListItem[] = [];
  offset: number = 0;
  limit: number = 20;
  searchTerm: string = '';
  searching: boolean = false;
  notFound: boolean = false;
  loadingData: boolean = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getAllPokemons().subscribe(() => {
      this.loadMore();
    });
  }

  // Metodo para agregar mas elementos a la lista
  loadMore(): void {
    this.loadingData = true;
    this.pokemonService
      .getPokemonDetailsByBatch(this.offset, this.limit)
      .subscribe((detailsList) => {
        this.pokemonList = this.pokemonList.concat(detailsList);
        this.originalPokemonList = this.pokemonList.slice();
        this.offset += this.limit;
        this.loadingData = false;
      });
  }

  // Metodo para buscar por nombre
  searchByName(): void {
    if (this.searchTerm.trim() === '') {
      return;
    }
    this.searching = true;
    this.notFound = false;
    this.loadingData = true;
    this.pokemonService
      .searchPokemonByName(this.searchTerm)
      .subscribe((searchResult) => {
        if (searchResult.length === 0) {
          this.notFound = true; 
          this.pokemonList = [];
        } else {
          this.originalPokemonList = this.pokemonList;
          this.pokemonList = searchResult.slice(0, this.limit);
        }
        this.searching = false;
        this.loadingData = false;
      });
  }
  
  // Método para limpiar busqueda y volver a anterior arreglo
  clean(): void {
    this.searchTerm = '';
    this.searching = false;
    this.notFound = false;
    this.pokemonList = this.originalPokemonList.slice(0, this.limit);
  }

  // Método para ordenar la lista de Pokémon por nombre
  sortBy(name: string): void {
    this.pokemonList.sort((a, b) => {
      if ((a as any)[name] < (b as any)[name]) return -1;
      if ((a as any)[name] > (b as any)[name]) return 1;
      return 0;
    });
  }

  // Método para ordenar la lista de Pokémon por tipo
  sortByType(): void {
    this.pokemonList.sort((a, b) => {
      const typeA = a.types[0] || '';
      const typeB = b.types[0] || '';
      return typeA.localeCompare(typeB);
    });
  }

  // Método para ordenar la lista de Pokémon por peso
  sortByWeight(order: string): void {
    this.pokemonList.sort((a, b) => {
      const weightA = a.weight;
      const weightB = b.weight;
      return order === 'asc' ? weightA - weightB : weightB - weightA;
    });
  }
}
