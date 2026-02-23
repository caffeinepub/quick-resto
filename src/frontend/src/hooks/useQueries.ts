import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Restaurant, PriceRange, MenuItem, OrderItem, Order, OrderStatus, UserProfile } from '../backend';

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

export function useGetOrderMenuItems(restaurantName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['orderMenuItems', restaurantName],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderMenuItems(restaurantName);
    },
    enabled: !!actor && !isFetching && !!restaurantName,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      restaurantName: string;
      items: OrderItem[];
      deliveryAddress: string;
      contactInfo: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.placeOrder(
        data.restaurantName,
        data.items,
        data.deliveryAddress,
        data.contactInfo
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
    },
  });
}

export function useGetOrderHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orderHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrderStatus(orderId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<OrderStatus>({
    queryKey: ['orderStatus', orderId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getOrderStatus(orderId);
    },
    enabled: !!actor && !isFetching && orderId > 0,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
