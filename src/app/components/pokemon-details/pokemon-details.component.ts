import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetails, Type } from '../../models/pokemon/pokemon.model';
import { PokemonColorService } from '../../services/pokemon-color.service';
import { forkJoin } from 'rxjs';

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
    this.pokemonService
      .getPokemonDetailsById(this.pokemonId)
      .subscribe((details) => {
        this.pokemonDetails = details;
        this.loadEvolutionChain(details.species.url);
      });
  }
  

  loadEvolutionChain(speciesUrl: string): void {
    this.pokemonService.getPokemonSpecies(speciesUrl).subscribe((species: any) => {
      const evolutionChainUrl = species.evolution_chain.url;
      this.pokemonService
        .getPokemonEvolutionChain(evolutionChainUrl)
        .subscribe((chain: any) => {
          this.retrieveEvolutions(chain.chain);
        });
    });
  }

  processEvolutionChain(chain: any): void {
    // Procesar la cadena de evolución recursivamente
    this.extractEvolutions(chain);
  }

  extractEvolutions(chain: any): void {
    if (chain) {
      // Obtener el nombre y la URL de cada especie en la cadena de evolución
      const species = {
        name: chain.species.name,
        url: chain.species.url
      };
      // Agregar la especie a la lista de evoluciones
      this.evolutionChain.push(species);
      // Verificar si hay evoluciones adicionales
      if (chain.evolves_to && chain.evolves_to.length > 0) {
        // Procesar cada evolución adicional recursivamente
        chain.evolves_to.forEach((evolution: any) => {
          this.extractEvolutions(evolution);
        });
      }
    }
  }
  

  retrieveEvolutions(chain: any): void {
    this.extractEvolutions(chain);
    this.loadEvolutionImages();
  }
  
  

  loadEvolutionImages(): void {
    this.evolutionChain.forEach(evolution => {
      this.pokemonService.getPokemonDetailsByName(evolution.name.toLowerCase()).subscribe((pokemon: any) => {
        evolution.image = pokemon.sprites.front_default;
      });
    });
  }
  
  
  retrieveEvolutionImages(chain: any, evolution: any): void {
    const evolutionSpeciesUrl = evolution.species.url;
    const pokemonName = evolutionSpeciesUrl.split('/').slice(-2, -1)[0];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonName}.png`;
    evolution.image = imageUrl;
  }
  
  
  

  retrieveChainRecursive(chain: any): void {
    if (chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution: any) => {
        const id = evolution.species.url.split('/').slice(-2, -1)[0];
        this.evolutionChain.push({
          id: +id,
          name: this.capitalizeFirstLetter(evolution.species.name),
        });
        this.retrieveChainRecursive(evolution);
      });
    }
  }
  // Formatear el ID del Pokémon
  formatId(id: number): string {
    return id.toString().padStart(4, '0');
  }

  capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Obtener color según primer tipo
  getFirstTypeColor(pokemon: any): string {
    const firstType = pokemon[0].type.name || '';
    return this.pokemonColorService.getTypeColor(firstType);
  }

  // Obtener borde según primer tipo
  getFirstTypeBorder(pokemon: Type[]): string {
    const color = this.getFirstTypeColor(pokemon);
    return `2px solid ${color}`;
  }

  // Obtener sombra según primer tipo
  getFirstTypeShadow(pokemon: any): string {
    const color = this.getFirstTypeColor(pokemon);
    return `0px 0px 20px -3px ${color}`;
  }

  goBack(): void {
    this.router.navigate(['/pokemon']);
  }
}
