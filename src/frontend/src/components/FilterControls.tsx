import { X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FilterState } from '../hooks/useRestaurantFilters';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onReset: () => void;
  availableCuisines: string[];
}

export default function FilterControls({
  filters,
  onFilterChange,
  onReset,
  availableCuisines,
}: FilterControlsProps) {
  const hasActiveFilters =
    filters.cuisineType !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.minRating > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.cuisineType}
        onValueChange={(value) => onFilterChange('cuisineType', value)}
      >
        <SelectTrigger className="w-[180px] bg-card border-border/60">
          <SelectValue placeholder="Cuisine Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cuisines</SelectItem>
          {availableCuisines.map((cuisine) => (
            <SelectItem key={cuisine} value={cuisine}>
              {cuisine}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priceRange}
        onValueChange={(value) => onFilterChange('priceRange', value)}
      >
        <SelectTrigger className="w-[180px] bg-card border-border/60">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="budget">$ Budget</SelectItem>
          <SelectItem value="moderate">$$ Moderate</SelectItem>
          <SelectItem value="expensive">$$$ Expensive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.minRating.toString()}
        onValueChange={(value) => onFilterChange('minRating', parseInt(value))}
      >
        <SelectTrigger className="w-[180px] bg-card border-border/60">
          <SelectValue placeholder="Min Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">All Ratings</SelectItem>
          <SelectItem value="1">1+ Stars</SelectItem>
          <SelectItem value="2">2+ Stars</SelectItem>
          <SelectItem value="3">3+ Stars</SelectItem>
          <SelectItem value="4">4+ Stars</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

