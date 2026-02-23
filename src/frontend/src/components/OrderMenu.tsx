import { useGetOrderMenuItems } from '../hooks/useQueries';
import { useCart } from '../contexts/CartContext';
import MenuItemCard from './MenuItemCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, UtensilsCrossed } from 'lucide-react';
import { MenuItem } from '../backend';

interface OrderMenuProps {
  restaurantName: string;
}

export default function OrderMenu({ restaurantName }: OrderMenuProps) {
  const { data: menuItems = [], isLoading } = useGetOrderMenuItems(restaurantName);
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (menuItems.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Order Menu</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No menu items available for ordering at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categories = Object.keys(itemsByCategory).sort();

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl">Order Menu</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-foreground mb-4 capitalize">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itemsByCategory[category].map((item) => (
                <MenuItemCard
                  key={item.name}
                  item={item}
                  onAddToCart={(item) => addItem(restaurantName, item)}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
