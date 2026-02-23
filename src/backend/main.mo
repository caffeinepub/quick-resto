import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type Definitions
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

  type MenuItem = {
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
  };

  type Restaurant = {
    name : Text;
    cuisineType : Text;
    priceRange : PriceRange;
    rating : Nat;
    address : Text;
    hours : Text;
    menuHighlights : [Text];
    menuItems : [MenuItem];
  };

  type OrderItem = {
    item : MenuItem;
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

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    defaultAddress : Text;
  };

  // Stable variables
  let restaurants = List.empty<Restaurant>();
  let orders = List.empty<Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextOrderId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Restaurant Management
  public shared ({ caller }) func addRestaurant(
    name : Text,
    cuisineType : Text,
    priceRange : PriceRange,
    rating : Nat,
    address : Text,
    hours : Text,
    menuHighlights : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add restaurants");
    };

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
      menuItems = [];
    };

    restaurants.add(restaurant);
  };

  // Public Queries
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

  // Restaurant Menu Management
  public shared ({ caller }) func addMenuItem(
    restaurantName : Text,
    itemName : Text,
    description : Text,
    price : Nat,
    category : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };

    let menuItem : MenuItem = {
      name = itemName;
      description;
      price;
      category;
    };

    var restaurantFound = false;
    let updatedRestaurants = restaurants.map<Restaurant, Restaurant>(
      func(restaurant) {
        if (Text.equal(restaurant.name, restaurantName)) {
          restaurantFound := true;
          {
            restaurant with
            menuItems = restaurant.menuItems.concat([menuItem]);
          };
        } else {
          restaurant;
        };
      }
    );

    if (not restaurantFound) {
      Runtime.trap("Restaurant not found");
    };

    restaurants.clear();
    restaurants.addAll(updatedRestaurants.values());
  };

  public query ({ caller }) func getMenuItems(restaurantName : Text) : async [MenuItem] {
    let restaurant = restaurants.values().find(
      func(r) { Text.equal(r.name, restaurantName) }
    );

    switch (restaurant) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?rest) { rest.menuItems };
    };
  };

  // Order Processing
  public shared ({ caller }) func placeOrder(
    restaurantName : Text,
    items : [OrderItem],
    deliveryAddress : Text,
    contactInfo : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let totalAmount = items.foldRight(
      0,
      func(item, acc) {
        acc + (item.item.price * item.quantity);
      },
    );

    let order : Order = {
      orderId;
      userId = caller;
      restaurantName;
      items;
      totalAmount;
      deliveryAddress;
      contactInfo;
      orderStatus = #pending;
      timestamp = Time.now();
    };

    orders.add(order);
    orderId;
  };

  public query ({ caller }) func getOrderStatus(orderId : Nat) : async OrderStatus {
    let order = orders.values().find(
      func(o) { o.orderId == orderId }
    );

    switch (order) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) {
        if (o.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        o.orderStatus;
      };
    };
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      orders.toArray();
    } else {
      orders.values().filter(
        func(order) {
          order.userId == caller;
        }
      ).toArray();
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    var orderFound = false;
    let updatedOrders = orders.map<Order, Order>(
      func(order) {
        if (order.orderId == orderId) {
          orderFound := true;
          { order with orderStatus = status };
        } else {
          order;
        };
      }
    );

    if (not orderFound) {
      Runtime.trap("Order not found");
    };

    orders.clear();
    orders.addAll(updatedOrders.values());
  };

  public query ({ caller }) func getTotalOrdersCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view total order count");
    };
    orders.size();
  };

  // Additional Functions
  public shared ({ caller }) func addOrderMenuItem(
    restaurantName : Text,
    itemName : Text,
    description : Text,
    price : Nat,
    category : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add order menu items");
    };

    let menuItem : MenuItem = {
      name = itemName;
      description;
      price;
      category;
    };

    var restaurantFound = false;
    let updatedRestaurants = restaurants.map<Restaurant, Restaurant>(
      func(restaurant) {
        if (Text.equal(restaurant.name, restaurantName)) {
          restaurantFound := true;
          {
            restaurant with
            menuItems = restaurant.menuItems.concat([menuItem]);
          };
        } else {
          restaurant;
        };
      }
    );

    if (not restaurantFound) {
      Runtime.trap("Restaurant not found");
    };

    restaurants.clear();
    restaurants.addAll(updatedRestaurants.values());
  };

  public query ({ caller }) func getOrderMenuItems(restaurantName : Text) : async [MenuItem] {
    let restaurant = restaurants.values().find(
      func(r) { Text.equal(r.name, restaurantName) }
    );

    switch (restaurant) {
      case (null) { Runtime.trap("Restaurant not found") };
      case (?rest) { rest.menuItems };
    };
  };

  public query ({ caller }) func getOrderHistoryByUser(userId : Principal) : async [Order] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own order history");
    };

    orders.values().filter(
      func(order) {
        order.userId == userId;
      }
    ).toArray();
  };

  public query ({ caller }) func getOrderHistoryByRestaurant(restaurantName : Text) : async [Order] {
    orders.values().filter(
      func(order) {
        Text.equal(order.restaurantName, restaurantName);
      }
    ).toArray();
  };
};
