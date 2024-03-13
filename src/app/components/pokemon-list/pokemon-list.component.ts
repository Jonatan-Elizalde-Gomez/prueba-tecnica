import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonListItem } from '../../models/pokemon/pokemon.model';
import { PokemonColorService } from '../../services/pokemon-color.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
})
export class PokemonListComponent implements OnInit {
  // Arreglos de Pokémon
  pokemonList: PokemonListItem[] = [];
  originalPokemonList: PokemonListItem[] = [];

  // Variables de control
  offset: number = 0;
  limit: number = 20;
  searchTerm: string = '';
  searching: boolean = false;
  notFound: boolean = false;
  loadingData: boolean = false;

  // Variables de ordenamiento
  sortOrder: string = '';
  sortDirection: string = 'asc';

  constructor(
    private pokemonService: PokemonService,
    public pokemonColorService: PokemonColorService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Inicialización, cargar los primeros Pokémon
    this.pokemonService.getAllPokemons().subscribe(() => {
      this.loadMore();
    });
  }

  // Método para cargar más Pokémon
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

  // Método para buscar Pokémon por nombre
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

  // Método para limpiar búsqueda y restaurar la lista original
  clean(): void {
    this.searchTerm = '';
    this.searching = false;
    this.notFound = false;
    this.pokemonList = this.originalPokemonList.slice(0, this.limit);
    this.resetSortState();
  }

  // Restablecer estado de ordenamiento
  resetSortState(): void {
    this.sortOrder = '';
    this.sortDirection = 'desc';
  }

  // Aplicar ordenamiento
  applySorting(): void {
    switch (this.sortOrder) {
      case 'name':
        this.pokemonList.sort((a, b) => {
          let comparison = 0;
          if (a.name < b.name) {
            comparison = -1;
          } else if (a.name > b.name) {
            comparison = 1;
          }
          return this.sortDirection === 'asc' ? comparison : comparison * -1;
        });
        break;
      case 'type':
        this.pokemonList.sort((a, b) => {
          const typeA = a.types[0] || '';
          const typeB = b.types[0] || '';
          let comparison = typeA.localeCompare(typeB);
          return this.sortDirection === 'asc' ? comparison : comparison * -1;
        });
        break;
      case 'weight':
        this.pokemonList.sort((a, b) => {
          const weightA = a.weight;
          const weightB = b.weight;
          let comparison = weightA - weightB;
          return this.sortDirection === 'asc' ? comparison : comparison * -1;
        });
        break;
      default:
        break;
    }
  }

  // Alternar el criterio de ordenamiento
  toggleSortBy(criteria: string): void {
    if (this.sortOrder === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder = criteria;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  // Obtener color según primer tipo
  getFirstTypeColor(pokemon: PokemonListItem): string {
    const firstType = pokemon.types[0] || '';
    return this.pokemonColorService.getTypeColor(firstType);
  }

  // Obtener borde según primer tipo
  getFirstTypeBorder(pokemon: PokemonListItem): string {
    const color = this.getFirstTypeColor(pokemon);
    return `1px solid ${color}`;
  }

  // Obtener sombra según primer tipo
  getFirstTypeShadow(pokemon: PokemonListItem): string {
    const color = this.getFirstTypeColor(pokemon);
    return `0px 0px 10px -3px ${color}`;
  }

  // Formatear el ID del Pokémon
  formatId(id: number): string {
    return id.toString().padStart(4, '0');
  }

  // Capitalizar la primera letra
  capitalizeFirstLetter(name: string): string {
    return name.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  goToDetails(pokemonId: number): void {
    this.router.navigate(['/pokemon', pokemonId]);
  }
  
}
