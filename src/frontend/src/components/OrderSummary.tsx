import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useCart } from '../contexts/CartContext';

export default function OrderSummary() {
  const { items, totalAmount } = useCart();

  const subtotal = (totalAmount / 100).toFixed(2);

  // Group items by restaurant
  const itemsByRestaurant = items.reduce((acc, item) => {
    if (!acc[item.restaurantName]) {
      acc[item.restaurantName] = [];
    }
    acc[item.restaurantName].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(itemsByRestaurant).map(([restaurantName, restaurantItems]) => (
          <div key={restaurantName} className="space-y-2">
            <p className="font-semibold text-sm text-primary">{restaurantName}</p>
            {restaurantItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.item.name}
                </span>
                <span className="font-medium">
                  ${((Number(item.item.price) * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ))}

        <Separator />

        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-primary">${subtotal}</span>
        </div>
      </CardContent>
    </Card>
  );
}
