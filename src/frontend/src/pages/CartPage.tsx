import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartItemRow from '../components/CartItemRow';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();

  const subtotal = (totalAmount / 100).toFixed(2);

  // Group items by restaurant
  const itemsByRestaurant = items.reduce((acc, item) => {
    if (!acc[item.restaurantName]) {
      acc[item.restaurantName] = [];
    }
    acc[item.restaurantName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Restaurants
        </Button>

        <Card className="border-border/60 max-w-2xl mx-auto">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground text-center">
                Add items from restaurant menus to get started
              </p>
              <Button onClick={() => navigate({ to: '/' })} className="mt-4">
                Browse Restaurants
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        onClick={() => navigate({ to: '/' })}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Restaurants
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Your Cart</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Clear Cart
              </Button>
            </CardHeader>
            <CardContent>
              {Object.entries(itemsByRestaurant).map(([restaurantName, restaurantItems]) => (
                <div key={restaurantName} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-lg text-primary mb-4">
                    {restaurantName}
                  </h3>
                  <div className="space-y-0">
                    {restaurantItems.map((item) => (
                      <CartItemRow
                        key={`${item.restaurantName}-${item.item.name}`}
                        item={item}
                        onUpdateQuantity={(quantity) =>
                          updateQuantity(item.restaurantName, item.item.name, quantity)
                        }
                        onRemove={() => removeItem(item.restaurantName, item.item.name)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-border/60 sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">${subtotal}</span>
              </div>

              <Button
                onClick={() => navigate({ to: '/checkout' })}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
