
import React, { useState } from 'react';
import { Filter } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: { category: string; priceRange: string; material: string }) => void;
}

const ProductFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    material: ''
  });

  const categories = ['', 'Ring', 'Necklace', 'Earrings', 'Bracelet'];
  const priceRanges = ['', '0-500', '500-1000', '1000-2000', '2000'];
  const materials = ['', 'Gold', 'Silver', 'Platinum', 'Diamond'];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: '', priceRange: '', material: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full bg-forest-green text-cream py-3 px-4 rounded-lg flex items-center justify-center space-x-2 mb-4"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block bg-white rounded-lg shadow-lg p-6 mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-forest-green mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category || 'All Categories'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-green mb-2">Price Range</label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {priceRanges.map((range) => (
                <option key={range} value={range}>
                  {range ? `$${range.replace('-', ' - $')}${range === '2000' ? '+' : ''}` : 'All Prices'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-green mb-2">Material</label>
            <select
              value={filters.material}
              onChange={(e) => handleFilterChange('material', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {materials.map((material) => (
                <option key={material} value={material}>
                  {material || 'All Materials'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={clearFilters}
              className="w-full bg-cream border-2 border-forest-green text-forest-green py-3 px-4 rounded-lg hover:bg-forest-green hover:text-cream transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
