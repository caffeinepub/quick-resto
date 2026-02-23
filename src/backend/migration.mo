import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type PriceRange = {
    #budget;
    #moderate;
    #expensive;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  type RichMenuItem = {
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
  };

  type OrderItem = {
    item : RichMenuItem;
    quantity : Nat;
  };

  type Order = {
    orderId : Nat;
    userId : Principal;
    restaurantName : Text;
    items : [OrderItem];
    totalAmount : Nat;
    deliveryAddress : Text;
    contactInfo : Text;
    orderStatus : OrderStatus;
    timestamp : Time.Time;
  };

  // Old types
  type OldRestaurant = {
    name : Text;
    cuisineType : Text;
    priceRange : PriceRange;
    rating : Nat;
    address : Text;
    hours : Text;
    menuHighlights : [Text];
  };

  type OldActor = {
    restaurants : List.List<OldRestaurant>;
  };

  // New types
  type NewRestaurant = {
    name : Text;
    cuisineType : Text;
    priceRange : PriceRange;
    rating : Nat;
    address : Text;
    hours : Text;
    menuHighlights : [Text];
    menuItems : [RichMenuItem];
  };

  type NewActor = {
    restaurants : List.List<NewRestaurant>;
    orders : List.List<Order>;
    nextOrderId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newRestaurants = old.restaurants.map<OldRestaurant, NewRestaurant>(
      func(oldR) {
        {
          oldR with
          menuItems = [];
        };
      }
    );

    {
      restaurants = newRestaurants;
      orders = List.empty<Order>();
      nextOrderId = 1;
    };
  };
};
