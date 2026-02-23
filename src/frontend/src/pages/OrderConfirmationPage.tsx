import { useNavigate, useParams } from '@tanstack/react-router';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGetOrderStatus } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false });
  const orderIdBigInt = orderId ? BigInt(orderId) : BigInt(0);
  
  const { data: orderStatus, isLoading } = useGetOrderStatus(orderIdBigInt);

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <Card className="border-border/60 max-w-2xl mx-auto">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-accent" />
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Your order has been placed successfully
              </p>
            </div>

            <Card className="w-full border-border/60 bg-muted/30">
              <CardHeader>
                <CardTitle className="text-center text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-bold text-foreground">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-primary capitalize">
                    {orderStatus ? orderStatus.toString() : 'Pending'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center max-w-md">
              You can track your order status in your order history. We'll prepare your order
              and deliver it to your address soon.
            </p>

            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => navigate({ to: '/orders' })}
                variant="outline"
              >
                <Receipt className="h-4 w-4 mr-2" />
                View Order History
              </Button>
              <Button onClick={() => navigate({ to: '/' })}>
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
