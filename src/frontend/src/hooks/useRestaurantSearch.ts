import { useMemo } from 'react';
import { Restaurant } from '../backend';

export function useRestaurantSearch(restaurants: Restaurant[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim()) {
      return restaurants;
    }

    const query = searchQuery.toLowerCase();
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query)
    );
  }, [restaurants, searchQuery]);
}

