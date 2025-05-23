
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import { mockProducts } from '@/data/mockProducts';

const ProductGrid = () => {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    material: '',
    color: ''
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    let filtered = mockProducts;
    
    if (newFilters.category) {
      filtered = filtered.filter(product => product.category === newFilters.category);
    }
    
    if (newFilters.priceRange) {
      const [min, max] = newFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }
    
    if (newFilters.material) {
      filtered = filtered.filter(product => product.material === newFilters.material);
    }
    
    if (newFilters.color) {
      filtered = filtered.filter(product => product.color === newFilters.color);
    }
    
    setFilteredProducts(filtered);
  };

  return (
    <section className="py-16" id="products">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-forest-green text-center mb-12">
          Our Collection
        </h2>
        
        <ProductFilter onFilterChange={handleFilterChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-forest-green/60 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
