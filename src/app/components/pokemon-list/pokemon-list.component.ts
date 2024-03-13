import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonList, PokemonDetails, PokemonListItem } from '../../models/pokemon/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: PokemonListItem[] = [];
  next: string | null = null;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonList(20, 0);
  }

  getPokemonList(limit: number, offset: number) {
    this.pokemonService.getPokemonList(limit, offset).subscribe(data => {
      this.pokemonList = data.results;
      this.next = data.next;
    });
  }

  loadMore() {
    if (this.next) {
      this.pokemonService.getPokemonByUrl(this.next).subscribe(data => {
        this.pokemonList = [...this.pokemonList, ...data.results];
        this.next = data.next;
      });
    }
  }
}
