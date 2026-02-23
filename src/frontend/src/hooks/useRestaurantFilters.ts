import { useState, useMemo } from 'react';
import { Restaurant, PriceRange } from '../backend';

export interface FilterState {
  cuisineType: string;
  priceRange: string;
  minRating: number;
}

export function useRestaurantFilters(restaurants: Restaurant[]) {
  const [filters, setFilters] = useState<FilterState>({
    cuisineType: 'all',
    priceRange: 'all',
    minRating: 0,
  });

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Cuisine filter
      if (filters.cuisineType !== 'all' && restaurant.cuisineType !== filters.cuisineType) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const priceRangeKey = filters.priceRange as keyof typeof PriceRange;
        if (restaurant.priceRange !== PriceRange[priceRangeKey]) {
          return false;
        }
      }

      // Rating filter
      if (filters.minRating > 0 && Number(restaurant.rating) < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [restaurants, filters]);

  const updateFilter = (key: keyof FilterState, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      cuisineType: 'all',
      priceRange: 'all',
      minRating: 0,
    });
  };

  return {
    filters,
    filteredRestaurants,
    updateFilter,
    resetFilters,
  };
}

