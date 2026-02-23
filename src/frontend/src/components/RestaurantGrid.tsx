import { Restaurant } from '../backend';
import RestaurantCard from './RestaurantCard';

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export default function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">No restaurants found matching your criteria.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant, index) => (
        <RestaurantCard key={`${restaurant.name}-${index}`} restaurant={restaurant} />
      ))}
    </div>
  );
}

