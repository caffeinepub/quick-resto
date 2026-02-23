import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronUp, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Order, OrderStatus } from '../backend';
import { Separator } from './ui/separator';

interface OrderHistoryCardProps {
  order: Order;
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.pending:
      return 'bg-muted text-muted-foreground';
    case OrderStatus.confirmed:
      return 'bg-accent/20 text-accent-foreground';
    case OrderStatus.preparing:
      return 'bg-primary/20 text-primary';
    case OrderStatus.outForDelivery:
      return 'bg-chart-2/20 text-chart-2';
    case OrderStatus.delivered:
      return 'bg-chart-5/20 text-chart-5';
    case OrderStatus.cancelled:
      return 'bg-destructive/20 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function formatStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.pending:
      return 'Pending';
    case OrderStatus.confirmed:
      return 'Confirmed';
    case OrderStatus.preparing:
      return 'Preparing';
    case OrderStatus.outForDelivery:
      return 'Out for Delivery';
    case OrderStatus.delivered:
      return 'Delivered';
    case OrderStatus.cancelled:
      return 'Cancelled';
    default:
      return status;
  }
}

export default function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const orderDate = new Date(Number(order.timestamp) / 1000000);
  const totalInDollars = (Number(order.totalAmount) / 100).toFixed(2);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2">
              Order #{order.orderId.toString()}
            </CardTitle>
            <p className="text-sm font-medium text-primary mb-1">
              {order.restaurantName}
            </p>
            <p className="text-sm text-muted-foreground">
              {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusColor(order.orderStatus)}>
              {formatStatus(order.orderStatus)}
            </Badge>
            <p className="text-lg font-bold text-foreground">${totalInDollars}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-sm font-medium">
            {expanded ? 'Hide Details' : 'View Details'}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expanded && (
          <div className="mt-4 space-y-4">
            <Separator />
            
            <div>
              <h4 className="font-semibold text-sm mb-3">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity.toString()}x {item.item.name}
                    </span>
                    <span className="font-medium">
                      ${((Number(item.item.price) * Number(item.quantity)) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm text-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Contact
                  </p>
                  <p className="text-sm text-foreground">{order.contactInfo}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
