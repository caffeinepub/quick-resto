import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Star, MapPin, Clock, UtensilsCrossed } from 'lucide-react';
import { useGetAllRestaurants } from '../hooks/useQueries';
import { getRestaurantImage } from '../utils/restaurantImages';
import { PriceRange } from '../backend';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Loader2 } from 'lucide-react';
import OrderMenu from '../components/OrderMenu';

function getPriceDisplay(priceRange: PriceRange): string {
  switch (priceRange) {
    case PriceRange.budget:
      return '$ Budget-Friendly';
    case PriceRange.moderate:
      return '$$ Moderate';
    case PriceRange.expensive:
      return '$$$ Fine Dining';
    default:
      return '$$ Moderate';
  }
}

export default function RestaurantDetailPage() {
  const navigate = useNavigate();
  const { restaurantName } = useParams({ strict: false });
  const { data: restaurants = [], isLoading } = useGetAllRestaurants();

  const decodedName = restaurantName ? decodeURIComponent(restaurantName) : '';
  const restaurant = restaurants.find((r) => r.name === decodedName);

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Restaurant not found</p>
          <Button onClick={() => navigate({ to: '/' })} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Restaurants
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = getRestaurantImage(restaurant);
  const rating = Number(restaurant.rating);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container -mt-20 relative z-10 pb-16">
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="outline"
          className="mb-6 bg-card/95 backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Restaurants
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="font-display text-3xl md:text-4xl mb-2">
                      {restaurant.name}
                    </CardTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                        {restaurant.cuisineType}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        {getPriceDisplay(restaurant.priceRange)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < rating
                            ? 'fill-primary text-primary'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Location</h3>
                  </div>
                  <p className="text-foreground ml-7">{restaurant.address}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Hours</h3>
                  </div>
                  <p className="text-foreground ml-7">{restaurant.hours}</p>
                </div>
              </CardContent>
            </Card>

            {/* Menu Highlights */}
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Menu Highlights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {restaurant.menuHighlights.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-foreground"
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Order Menu */}
            <OrderMenu restaurantName={restaurant.name} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border/60 sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Cuisine Type
                  </p>
                  <p className="text-foreground font-medium">
                    {restaurant.cuisineType}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Price Range
                  </p>
                  <p className="text-foreground font-medium">
                    {getPriceDisplay(restaurant.priceRange)}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Rating
                  </p>
                  <div className="flex items-center gap-2">
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
                    </div>
                    <span className="text-foreground font-medium">
                      {rating}.0 / 5.0
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
