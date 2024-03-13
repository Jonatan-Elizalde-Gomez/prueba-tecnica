import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonListItem } from '../../models/pokemon/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: PokemonListItem[] = [];
  next: string | null = null;

  constructor(private pokemonService: PokemonService) {}

  // Al cargar se manda la peticion com 20 registros
  ngOnInit(): void {
    this.getPokemonListWithDetails('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
  }

  // Funcion para obtener la lista con detalles y añadirlas a la lista
  getPokemonListWithDetails(url:string) {
    this.pokemonService.getPokemonListWithDetails(url).subscribe(detailsList => {
      this.pokemonList = this.pokemonList.concat(detailsList.map(details => ({ name: details.name, url: '' })));
      this.next = this.pokemonService.getNextUrl();
    });
  }

  // Funcion para cargar más pokemons
  loadMore() {
    if (this.next) {
        this.getPokemonListWithDetails(this.next);
    }
  }
}
