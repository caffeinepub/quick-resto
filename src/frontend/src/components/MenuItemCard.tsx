import { Plus, Check } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';
import { MenuItem } from '../backend';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const priceInDollars = (Number(item.price) / 100).toFixed(2);

  return (
    <Card className="border-border/60 hover:shadow-card transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-1 truncate">
              {item.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {item.description}
            </p>
            <p className="text-lg font-bold text-primary">
              ${priceInDollars}
            </p>
          </div>
          <Button
            onClick={handleAdd}
            size="sm"
            className="flex-shrink-0"
            variant={added ? 'secondary' : 'default'}
          >
            {added ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
