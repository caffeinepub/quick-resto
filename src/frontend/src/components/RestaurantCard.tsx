import { useNavigate } from '@tanstack/react-router';
import { Star, MapPin } from 'lucide-react';
import { Restaurant, PriceRange } from '../backend';
import { getRestaurantImage } from '../utils/restaurantImages';
import { Card, CardContent } from './ui/card';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

function getPriceDisplay(priceRange: PriceRange): string {
  switch (priceRange) {
    case PriceRange.budget:
      return '$';
    case PriceRange.moderate:
      return '$$';
    case PriceRange.expensive:
      return '$$$';
    default:
      return '$$';
  }
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();
  const imageUrl = getRestaurantImage(restaurant);
  const rating = Number(restaurant.rating);

  const handleClick = () => {
    navigate({
      to: '/restaurant/$restaurantName',
      params: { restaurantName: encodeURIComponent(restaurant.name) },
    });
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-card"
      onClick={handleClick}
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {getPriceDisplay(restaurant.priceRange)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
            {restaurant.cuisineType}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? 'fill-primary text-primary'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
            <span className="ml-1 text-muted-foreground font-medium">
              {rating}.0
            </span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 mt-3 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}

