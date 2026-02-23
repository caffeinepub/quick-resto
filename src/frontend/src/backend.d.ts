import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    category: string;
    price: bigint;
}
export type Time = bigint;
export interface OrderItem {
    item: MenuItem;
    quantity: bigint;
}
export interface Restaurant {
    hours: string;
    name: string;
    cuisineType: string;
    menuItems: Array<MenuItem>;
    priceRange: PriceRange;
    address: string;
    rating: bigint;
    menuHighlights: Array<string>;
}
export interface Order {
    deliveryAddress: string;
    contactInfo: string;
    orderStatus: OrderStatus;
    userId: Principal;
    orderId: bigint;
    totalAmount: bigint;
    restaurantName: string;
    timestamp: Time;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    defaultAddress: string;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    outForDelivery = "outForDelivery",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum PriceRange {
    expensive = "expensive",
    budget = "budget",
    moderate = "moderate"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(restaurantName: string, itemName: string, description: string, price: bigint, category: string): Promise<void>;
    addOrderMenuItem(restaurantName: string, itemName: string, description: string, price: bigint, category: string): Promise<void>;
    addRestaurant(name: string, cuisineType: string, priceRange: PriceRange, rating: bigint, address: string, hours: string, menuHighlights: Array<string>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    filterByCuisineType(cuisineType: string): Promise<Array<Restaurant>>;
    filterByMinimumRating(minRating: bigint): Promise<Array<Restaurant>>;
    filterByPriceRange(priceRange: PriceRange): Promise<Array<Restaurant>>;
    getAllRestaurants(): Promise<Array<Restaurant>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMenuItems(restaurantName: string): Promise<Array<MenuItem>>;
    getOrderHistory(): Promise<Array<Order>>;
    getOrderHistoryByRestaurant(restaurantName: string): Promise<Array<Order>>;
    getOrderHistoryByUser(userId: Principal): Promise<Array<Order>>;
    getOrderMenuItems(restaurantName: string): Promise<Array<MenuItem>>;
    getOrderStatus(orderId: bigint): Promise<OrderStatus>;
    getTotalOrdersCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(restaurantName: string, items: Array<OrderItem>, deliveryAddress: string, contactInfo: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
}
