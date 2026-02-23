import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Restaurant, PriceRange } from '../backend';

export function useGetAllRestaurants() {
  const { actor, isFetching } = useActor();

  return useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRestaurants();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddRestaurant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      cuisineType: string;
      priceRange: PriceRange;
      rating: bigint;
      address: string;
      hours: string;
      menuHighlights: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addRestaurant(
        data.name,
        data.cuisineType,
        data.priceRange,
        data.rating,
        data.address,
        data.hours,
        data.menuHighlights
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
}

