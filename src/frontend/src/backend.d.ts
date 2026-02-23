import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Restaurant {
    hours: string;
    name: string;
    cuisineType: string;
    priceRange: PriceRange;
    address: string;
    rating: bigint;
    menuHighlights: Array<string>;
}
export enum PriceRange {
    expensive = "expensive",
    budget = "budget",
    moderate = "moderate"
}
export interface backendInterface {
    addRestaurant(name: string, cuisineType: string, priceRange: PriceRange, rating: bigint, address: string, hours: string, menuHighlights: Array<string>): Promise<void>;
    filterByCuisineType(cuisineType: string): Promise<Array<Restaurant>>;
    filterByMinimumRating(minRating: bigint): Promise<Array<Restaurant>>;
    filterByPriceRange(priceRange: PriceRange): Promise<Array<Restaurant>>;
    getAllRestaurants(): Promise<Array<Restaurant>>;
}
