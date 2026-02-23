import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { CartItem } from '../types/cart';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const priceInDollars = (Number(item.item.price) / 100).toFixed(2);
  const lineTotal = ((Number(item.item.price) * item.quantity) / 100).toFixed(2);

  return (
    <div className="flex items-start gap-4 py-4 border-b border-border/40 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1">{item.restaurantName}</p>
        <h4 className="font-semibold text-foreground mb-1">{item.item.name}</h4>
        <p className="text-sm text-muted-foreground mb-2">{item.item.description}</p>
        <p className="text-sm font-medium text-foreground">${priceInDollars} each</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-bold text-foreground">${lineTotal}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
