import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetails, Type } from '../../models/pokemon/pokemon.model';
import { PokemonColorService } from '../../services/pokemon-color.service';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css'],
})
export class PokemonDetailsComponent implements OnInit {
  pokemonId: number = 0;
  pokemonDetails: PokemonDetails | null = null;
  evolutionChain: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    public pokemonColorService: PokemonColorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.pokemonId = +params['id'];
      this.loadPokemonDetails();
    });
  }

  loadPokemonDetails(): void {
    // Limpiar detalles anteriores al cargar un nuevo Pokémon
    this.pokemonDetails = null;
    this.evolutionChain = [];
    this.pokemonService
      .getPokemonDetailsById(this.pokemonId)
      .subscribe((details) => {
        this.pokemonDetails = details;
        this.loadEvolutionChain(details.species.url);
      });
  }

  loadEvolutionChain(speciesUrl: string): void {
    this.pokemonService
      .getPokemonSpecies(speciesUrl)
      .subscribe((species: any) => {
        const evolutionChainUrl = species.evolution_chain.url;
        this.pokemonService
          .getPokemonEvolutionChain(evolutionChainUrl)
          .subscribe((chain: any) => {
            this.retrieveEvolutions(chain.chain);
          });
      });
  }

  retrieveEvolutions(chain: any): void {
    if (chain) {
      this.extractEvolutions(chain);
      this.loadEvolutionImages();
    }
  }

  extractEvolutions(chain: any): void {
    if (chain) {
      const species = {
        name: chain.species.name,
        url: chain.species.url,
      };
      this.evolutionChain.push(species);
      if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evolution: any) => {
          this.extractEvolutions(evolution);
        });
      }
    }
  }

  loadEvolutionImages(): void {
    this.evolutionChain.forEach((evolution) => {
      this.pokemonService
        .getPokemonDetailsByName(evolution.name.toLowerCase())
        .subscribe((pokemon: any) => {
          evolution.image = pokemon.sprites.front_default;
        });
    });
  }

  formatId(id: number): string {
    return id.toString().padStart(4, '0');
  }

  capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getFirstTypeColor(pokemon: any): string {
    const firstType = pokemon[0].type.name || '';
    return this.pokemonColorService.getTypeColor(firstType);
  }

  getFirstTypeBorder(pokemon: Type[]): string {
    const color = this.getFirstTypeColor(pokemon);
    return `2px solid ${color}`;
  }

  getFirstTypeShadow(pokemon: any): string {
    const color = this.getFirstTypeColor(pokemon);
    return `0px 0px 20px -3px ${color}`;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  navigateToPreviousPokemon(): void {
    const previousPokemonId = this.pokemonId - 1;
    if (previousPokemonId >= 1) {
      this.router.navigate(['/pokemon', previousPokemonId]);
    }
  }

  navigateToNextPokemon(): void {
    const nextPokemonId = this.pokemonId + 1;
    this.router.navigate(['/pokemon', nextPokemonId]);
  }

  navigateToEvolutionDetail(name: string): void {
    const evolutionName = name.toLowerCase();
    this.pokemonService
      .getPokemonDetailsByName(evolutionName)
      .subscribe((pokemon: any) => {
        const evolutionId = pokemon.id;
        this.router.navigate(['/pokemon', evolutionId]);
      });
  }
}
