
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';

interface FilterProps {
  onFilterChange: (filters: { category: string; priceRange: string; material: string; color: string }) => void;
}

const ProductFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="mb-4">
      <label className="block text-sm font-medium text-forest-green mb-2">Category</label>
      <ToggleGroup type="single" value={filters.category} onValueChange={(value) => handleFilterChange('category', value || '')}>
        {categories.map((category) => (
          <ToggleGroupItem key={category} value={category} className={`${filters.category === category ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green'}`}>
            {category || 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  const renderPriceOptions = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-forest-green mb-2">Price Range</label>
      <ToggleGroup type="single" value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value || '')}>
        {priceRanges.map((range) => (
          <ToggleGroupItem key={range} value={range} className={`${filters.priceRange === range ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green'}`}>
            {range ? `$${range.replace('-', '-$')}${range === '2000' ? '+' : ''}` : 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  const renderMaterialOptions = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-forest-green mb-2">Material</label>
      <ToggleGroup type="single" value={filters.material} onValueChange={(value) => handleFilterChange('material', value || '')}>
        {materials.map((material) => (
          <ToggleGroupItem key={material} value={material} className={`${filters.material === material ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green'}`}>
            {material || 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  const renderColorOptions = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-forest-green mb-2">Color</label>
      <ToggleGroup type="single" value={filters.color} onValueChange={(value) => handleFilterChange('color', value || '')}>
        {colors.map((color) => (
          <ToggleGroupItem 
            key={color} 
            value={color} 
            className={`${filters.color === color ? 'bg-forest-green text-cream' : 'bg-cream text-forest-green'}`}
          >
            {color || 'All'}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );

  // For mobile view
  const mobileFilters = () => (
    <div className="md:hidden">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-forest-green text-cream hover:bg-forest-green-light flex items-center justify-center gap-2"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
      </Button>

      {isOpen && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-cream-dark">
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
      )}
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
