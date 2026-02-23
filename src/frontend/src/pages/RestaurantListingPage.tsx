import { useState, useMemo } from 'react';
import { useGetAllRestaurants } from '../hooks/useQueries';
import { useRestaurantSearch } from '../hooks/useRestaurantSearch';
import { useRestaurantFilters } from '../hooks/useRestaurantFilters';
import SearchBar from '../components/SearchBar';
import FilterControls from '../components/FilterControls';
import RestaurantGrid from '../components/RestaurantGrid';
import { Loader2 } from 'lucide-react';

export default function RestaurantListingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: restaurants = [], isLoading, error } = useGetAllRestaurants();

  // Get unique cuisines for filter dropdown
  const availableCuisines = useMemo(() => {
    const cuisines = new Set(restaurants.map((r) => r.cuisineType));
    return Array.from(cuisines).sort();
  }, [restaurants]);

  // Apply search
  const searchedRestaurants = useRestaurantSearch(restaurants, searchQuery);

  // Apply filters
  const { filters, filteredRestaurants, updateFilter, resetFilters } =
    useRestaurantFilters(searchedRestaurants);

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <p className="text-lg text-destructive">Failed to load restaurants</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Discover Great Restaurants
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Find your next favorite dining spot. Browse by cuisine, price, and rating.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterControls
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          availableCuisines={availableCuisines}
        />
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredRestaurants.length}</span>{' '}
          {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
        </p>
      </div>

      {/* Restaurant Grid */}
      <RestaurantGrid restaurants={filteredRestaurants} />
    </div>
  );
}

