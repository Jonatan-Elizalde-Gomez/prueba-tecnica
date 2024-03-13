import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetails } from '../../models/pokemon/pokemon.model';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css'],
})
export class PokemonDetailsComponent implements OnInit {
  pokemonId: number = 0;
  pokemonDetails: PokemonDetails | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.pokemonId = +params['id'];
      this.loadPokemonDetails();
    });
  }

  loadPokemonDetails(): void {
    this.pokemonService
      .getPokemonDetailsById(this.pokemonId)
      .subscribe((details) => {
        this.pokemonDetails = details;
      });
  }

  goBack(): void {
    this.router.navigate(['/pokemon']);
  }
}
