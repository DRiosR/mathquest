import React from "react";

export default function PokemonList({ pokemonList = [] }) { // Evita undefined
    if (!pokemonList.length) {
        return <p className="text-center text-gray-500">No hay Pokémon disponibles.</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {pokemonList.map((pokemon) => (
                <div key={pokemon.id} className="border p-4 rounded-lg shadow-md text-center">
                    <img 
                        src={pokemon.image} 
                        alt={pokemon.name} 
                        className="w-24 h-24 mx-auto"
                    />
                    <h3 className="text-lg font-bold">#{pokemon.id} {pokemon.name}</h3>
                </div>
            ))}
        </div>
    );
}
