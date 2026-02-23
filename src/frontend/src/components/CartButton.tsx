import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function CartButton() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate({ to: '/cart' })}
      variant="outline"
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
}
