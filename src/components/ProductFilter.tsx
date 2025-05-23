
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';

interface FilterProps {
  onFilterChange: (filters: { category: string; priceRange: string; material: string; color: string }) => void;
}

const ProductFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    material: '',
    color: ''
  });

  const categories = ['', 'Ring', 'Necklace', 'Earrings', 'Bracelet'];
  const priceRanges = ['', '0-500', '500-1000', '1000-2000', '2000'];
  const materials = ['', 'Gold', 'Silver', 'Platinum', 'Diamond'];
  const colors = ['', 'Yellow', 'White', 'Rose', 'Black', 'Blue'];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: '', priceRange: '', material: '', color: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const renderCategoryOptions = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-forest-green mb-3">Category</label>
      <ToggleGroup type="single" value={filters.category} onValueChange={(value) => handleFilterChange('category', value || '')} className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <ToggleGroupItem key={category} value={category} className={`${filters.category === category ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green border border-forest-green'} px-3 py-2 rounded-md text-sm`}>
            {category || 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  const renderPriceOptions = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-forest-green mb-3">Price Range</label>
      <ToggleGroup type="single" value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value || '')} className="flex flex-wrap gap-2">
        {priceRanges.map((range) => (
          <ToggleGroupItem key={range} value={range} className={`${filters.priceRange === range ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green border border-forest-green'} px-3 py-2 rounded-md text-sm`}>
            {range ? `$${range.replace('-', '-$')}${range === '2000' ? '+' : ''}` : 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  const renderMaterialOptions = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-forest-green mb-3">Material</label>
      <ToggleGroup type="single" value={filters.material} onValueChange={(value) => handleFilterChange('material', value || '')} className="flex flex-wrap gap-2">
        {materials.map((material) => (
          <ToggleGroupItem key={material} value={material} className={`${filters.material === material ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green border border-forest-green'} px-3 py-2 rounded-md text-sm`}>
            {material || 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  const renderColorOptions = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-forest-green mb-3">Color</label>
      <ToggleGroup type="single" value={filters.color} onValueChange={(value) => handleFilterChange('color', value || '')} className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <ToggleGroupItem 
            key={color} 
            value={color} 
            className={`${filters.color === color ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green border border-forest-green'} px-3 py-2 rounded-md text-sm`}
          >
            {color || 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  // For mobile view - using Sheet component
  const mobileFilters = () => (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full bg-forest-green text-cream hover:bg-forest-green/90 flex items-center justify-center gap-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="bg-cream">
          <SheetHeader>
            <SheetTitle className="text-forest-green text-left">Filter Products</SheetTitle>
            <SheetDescription className="text-forest-green/70 text-left">
              Choose your preferences to find the perfect jewelry
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {renderCategoryOptions()}
            {renderPriceOptions()}
            {renderMaterialOptions()}
            {renderColorOptions()}
            <Button 
              onClick={clearFilters} 
              className="w-full bg-cream border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-cream transition-colors duration-300"
            >
              Clear Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  // For desktop view
  const desktopFilters = () => (
    <div className="hidden md:flex justify-center space-x-4 mb-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-cream border-forest-green text-forest-green hover:bg-forest-green hover:text-cream">
            Categories
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white border-forest-green">
          {renderCategoryOptions()}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-cream border-forest-green text-forest-green hover:bg-forest-green hover:text-cream">
            Price Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white border-forest-green">
          {renderPriceOptions()}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-cream border-forest-green text-forest-green hover:bg-forest-green hover:text-cream">
            Material
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white border-forest-green">
          {renderMaterialOptions()}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-cream border-forest-green text-forest-green hover:bg-forest-green hover:text-cream">
            Color
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white border-forest-green">
          {renderColorOptions()}
        </PopoverContent>
      </Popover>

      {(filters.category || filters.priceRange || filters.material || filters.color) && (
        <Button 
          onClick={clearFilters} 
          variant="outline" 
          className="bg-cream border-forest-green text-forest-green hover:bg-forest-green hover:text-cream"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mb-8">
      {mobileFilters()}
      {desktopFilters()}
    </div>
  );
};

export default ProductFilter;
