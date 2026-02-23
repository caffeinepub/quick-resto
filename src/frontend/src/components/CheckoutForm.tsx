import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutFormData {
  deliveryAddress: string;
  phone: string;
  notes: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    deliveryAddress: '',
    phone: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const validate = () => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Delivery Address *</Label>
        <Textarea
          id="deliveryAddress"
          placeholder="Enter your full delivery address"
          value={formData.deliveryAddress}
          onChange={(e) =>
            setFormData({ ...formData, deliveryAddress: e.target.value })
          }
          className={errors.deliveryAddress ? 'border-destructive' : ''}
          rows={3}
        />
        {errors.deliveryAddress && (
          <p className="text-sm text-destructive">{errors.deliveryAddress}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Special Instructions (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special requests or delivery instructions?"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Placing Order...
          </>
        ) : (
          'Place Order'
        )}
      </Button>
    </form>
  );
}
