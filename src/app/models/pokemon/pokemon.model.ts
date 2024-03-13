export interface PokemonList {
  count: number;
  next: string;
  previous: string;
  results: Array<PokemonListItem>;
}

export interface PokemonListItem {
  sprites: string;
  id: number;
  weight: number;
  name: string;
  url: string;
  types: string[];
  abilities: string[];
}

export interface PokemonDetails {
  sprites: {
    front_default: string | null;
  };
  id: number;
  abilities: Ability[];
  height: number;
  weight: number;
  name: string;
  types: Type[];
  stats: Stat[];
  species: {
    url: string;
  };
  evolution_chain: EvolutionChain;
}


export interface Ability {
  ability: AbilityDetail;
  is_hidden: boolean;
  slot: number;
}

export interface AbilityDetail {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: TypeDetail;
}


export interface TypeDetail {
  name: string;
  url: string;
}



export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}


export interface EvolutionChain {
  url: string;
}
