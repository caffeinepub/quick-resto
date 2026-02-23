import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePlaceOrder, useGetCallerUserProfile } from '../hooks/useQueries';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2 } from 'lucide-react';
import { OrderItem } from '../backend';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const placeOrderMutation = usePlaceOrder();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (items.length === 0) {
      navigate({ to: '/cart' });
    }
  }, [items.length, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <Button
          onClick={() => navigate({ to: '/cart' })}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <Card className="border-border/60 max-w-2xl mx-auto">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">Login Required</h2>
              <p className="text-muted-foreground text-center">
                Please log in to place your order
              </p>
              <Button
                onClick={login}
                disabled={loginStatus === 'logging-in'}
                className="mt-4"
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleCheckout = async (formData: {
    deliveryAddress: string;
    phone: string;
    notes: string;
  }) => {
    // Group items by restaurant (only one restaurant per order)
    const restaurantName = items[0].restaurantName;
    
    // Check if all items are from the same restaurant
    const allSameRestaurant = items.every(item => item.restaurantName === restaurantName);
    
    if (!allSameRestaurant) {
      alert('Please order from one restaurant at a time');
      return;
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      item: item.item,
      quantity: BigInt(item.quantity),
    }));

    const contactInfo = `${formData.phone}${formData.notes ? ` | Notes: ${formData.notes}` : ''}`;

    try {
      const orderId = await placeOrderMutation.mutateAsync({
        restaurantName,
        items: orderItems,
        deliveryAddress: formData.deliveryAddress,
        contactInfo,
      });

      clearCart();
      navigate({ to: `/order-confirmation/${orderId.toString()}` });
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  return (
    <div className="container py-8">
      <Button
        onClick={() => navigate({ to: '/cart' })}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-2xl">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              {placeOrderMutation.isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>
                    Failed to place order. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              <CheckoutForm
                onSubmit={handleCheckout}
                isSubmitting={placeOrderMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
