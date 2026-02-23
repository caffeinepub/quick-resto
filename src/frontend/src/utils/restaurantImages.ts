import { Restaurant } from '../backend';

const cuisineImageMap: Record<string, string> = {
  Italian: '/assets/generated/italian-restaurant.dim_800x600.png',
  Sushi: '/assets/generated/sushi-restaurant.dim_800x600.png',
  Japanese: '/assets/generated/sushi-restaurant.dim_800x600.png',
  Mexican: '/assets/generated/mexican-restaurant.dim_800x600.png',
  French: '/assets/generated/french-restaurant.dim_800x600.png',
  Thai: '/assets/generated/thai-restaurant.dim_800x600.png',
  American: '/assets/generated/steakhouse.dim_800x600.png',
  Steakhouse: '/assets/generated/steakhouse.dim_800x600.png',
};

export function getRestaurantImage(restaurant: Restaurant): string {
  const cuisineType = restaurant.cuisineType;
  return cuisineImageMap[cuisineType] || '/assets/generated/italian-restaurant.dim_800x600.png';
}

