# Specification

## Summary
**Goal:** Add online ordering functionality to allow users to browse restaurant menus, add items to a cart, checkout with delivery information, and view order history.

**Planned changes:**
- Extend Restaurant type to include orderable menu items with name, description, price, and category
- Add backend methods to manage restaurant menu items and store user orders with delivery details
- Implement shopping cart state management with add/remove items and quantity adjustments
- Create order menu section on restaurant detail pages grouped by category with add-to-cart buttons
- Build cart review interface showing selected items, quantities, and total with adjustment options
- Implement checkout flow collecting delivery address and contact information
- Create order history page displaying past orders with details and status

**User-visible outcome:** Users can browse restaurant menus, add items to their cart, place orders with delivery information, and view their order history. The cart persists across pages during the session and shows real-time totals. Each completed order is stored with a unique ID and status.
