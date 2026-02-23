import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  type PriceRange = {
    #budget;
    #moderate;
    #expensive;
  };

  type Restaurant = {
    name : Text;
    cuisineType : Text;
    priceRange : PriceRange;
    rating : Nat;
    address : Text;
    hours : Text;
    menuHighlights : [Text];
  };

  let restaurants = List.empty<Restaurant>();

  public shared ({ caller }) func addRestaurant(
    name : Text,
    cuisineType : Text,
    priceRange : PriceRange,
    rating : Nat,
    address : Text,
    hours : Text,
    menuHighlights : [Text],
  ) : async () {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5 stars");
    };

    let restaurant : Restaurant = {
      name;
      cuisineType;
      priceRange;
      rating;
      address;
      hours;
      menuHighlights;
    };

    restaurants.add(restaurant);
  };

  public query ({ caller }) func getAllRestaurants() : async [Restaurant] {
    restaurants.toArray();
  };

  public query ({ caller }) func filterByCuisineType(cuisineType : Text) : async [Restaurant] {
    restaurants.values().filter(
      func(restaurant) {
        Text.equal(restaurant.cuisineType, cuisineType);
      }
    ).toArray();
  };

  public query ({ caller }) func filterByPriceRange(priceRange : PriceRange) : async [Restaurant] {
    restaurants.values().filter(
      func(restaurant) {
        restaurant.priceRange == priceRange;
      }
    ).toArray();
  };

  public query ({ caller }) func filterByMinimumRating(minRating : Nat) : async [Restaurant] {
    if (minRating < 1 or minRating > 5) {
      Runtime.trap("Minimum rating must be between 1 and 5");
    };

    restaurants.values().filter(
      func(restaurant) {
        restaurant.rating >= minRating;
      }
    ).toArray();
  };
};
