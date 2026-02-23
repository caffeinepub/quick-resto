import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Receipt } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetOrderHistory, useGetCallerUserProfile } from '../hooks/useQueries';
import OrderHistoryCard from '../components/OrderHistoryCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Loader2 } from 'lucide-react';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: orders = [], isLoading } = useGetOrderHistory();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-border/60 max-w-2xl mx-auto">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">Login Required</h2>
              <p className="text-muted-foreground text-center">
                Please log in to view your order history
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

  if (isLoading || profileLoading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading order history...</p>
        </div>
      </div>
    );
  }

  // Sort orders by timestamp (newest first)
  const sortedOrders = [...orders].sort((a, b) => {
    return Number(b.timestamp) - Number(a.timestamp);
  });

  return (
    <div className="container py-8">
      <Button
        onClick={() => navigate({ to: '/' })}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Receipt className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-display text-foreground">
            Order History
          </h1>
        </div>

        {sortedOrders.length === 0 ? (
          <Card className="border-border/60">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <Receipt className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-bold text-foreground">No orders yet</h2>
                <p className="text-muted-foreground text-center">
                  Start ordering from your favorite restaurants
                </p>
                <Button onClick={() => navigate({ to: '/' })} className="mt-4">
                  Browse Restaurants
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <OrderHistoryCard key={order.orderId.toString()} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
