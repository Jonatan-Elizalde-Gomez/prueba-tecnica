export interface PokemonList {
  count: number;
  next: string;
  previous: string;
  results: Array<PokemonListItem>;
}

export interface PokemonListItem {
  weight: any;
  name: string;
  url: string;
  types: string[];
}

export interface PokemonDetails {
  abilities: Ability[];
  height: number;
  weight: number;
  name: string;
  types: Type[];
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
