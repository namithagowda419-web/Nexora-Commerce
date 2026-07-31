import React from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  brands = [],
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  onResetFilters
}) => {
  return (
    <div className="bg-white dark:bg-darkbg-card rounded-3xl p-6 border border-lilac-soft dark:border-darkbg-border shadow-luxury space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-lilac-soft/60 dark:border-darkbg-border">
        <div className="flex items-center gap-2 font-playfair font-bold text-lg text-plum-primary dark:text-lavender-soft">
          <Filter className="w-5 h-5" />
          <span>Filter Catalogue</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-mauve-dusty hover:text-plum-primary flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-playfair font-semibold text-sm text-charcoal dark:text-white uppercase tracking-wider">
          Categories
        </h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-left text-xs px-3 py-2 rounded-xl font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-plum-primary text-white font-semibold'
                : 'text-charcoal-muted dark:text-gray-300 hover:bg-cream-warm dark:hover:bg-darkbg-input'
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`text-left text-xs px-3 py-2 rounded-xl font-medium transition flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-plum-primary text-white font-semibold'
                  : 'text-charcoal-muted dark:text-gray-300 hover:bg-cream-warm dark:hover:bg-darkbg-input'
              }`}
            >
              <span>{cat.name}</span>
              {cat.productCount !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-lilac-soft dark:bg-darkbg-border text-charcoal'
                }`}>
                  {cat.productCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter Slider */}
      <div className="space-y-3 pt-4 border-t border-lilac-soft/60 dark:border-darkbg-border">
        <div className="flex justify-between items-center text-xs font-semibold text-charcoal dark:text-white">
          <span className="font-playfair uppercase tracking-wider">Max Price</span>
          <span className="text-plum-primary dark:text-lavender-soft font-bold">${priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="100"
          max="20000"
          step="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-plum-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>$100</span>
          <span>$20,000+</span>
        </div>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-lilac-soft/60 dark:border-darkbg-border">
          <h4 className="font-playfair font-semibold text-sm text-charcoal dark:text-white uppercase tracking-wider">
            Maison Brands
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`w-full text-left text-xs px-2 py-1.5 rounded-lg ${
                selectedBrand === 'all' ? 'text-plum-primary font-bold' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition ${
                  selectedBrand === b
                    ? 'text-plum-primary font-bold bg-plum-primary/10'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-cream-warm dark:hover:bg-darkbg-input'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div className="space-y-3 pt-4 border-t border-lilac-soft/60 dark:border-darkbg-border">
        <h4 className="font-playfair font-semibold text-sm text-charcoal dark:text-white uppercase tracking-wider">
          Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
              className={`w-full flex items-center justify-between text-xs p-2 rounded-xl transition ${
                selectedRating === r
                  ? 'bg-plum-primary/10 text-plum-primary font-bold border border-plum-primary/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-cream-warm dark:hover:bg-darkbg-input'
              }`}
            >
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{r} Stars & Above</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
