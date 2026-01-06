import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb';
import ProductCard from '../components/products/ProductCard';
import ProductService from '../services/productService';
// Fallback mock data
import { products as mockProducts, categories as mockCategories } from '../data/products';

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 500;

// Flag to enable/disable API integration (set to true when your backend is running)
const USE_API = true; // Change to false to use mock data

const StorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search states - separate input value from the actual filter value
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchFilterValue, setSearchFilterValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef(null);
  
  // API data state
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected filters
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handle search input change with debounce
  const handleSearchChange = useCallback((value) => {
    setSearchInputValue(value);
    
    // Clear any existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // If value is empty, update immediately
    if (!value) {
      setSearchFilterValue('');
      setIsSearching(false);
      setCurrentPage(1);
      return;
    }
    
    // Show searching indicator
    setIsSearching(true);
    
    // Set new timer to update filter after delay
    searchTimerRef.current = setTimeout(() => {
      setSearchFilterValue(value);
      setIsSearching(false);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Load products from API
  const loadProducts = useCallback(async () => {
    if (!USE_API) {
      // Use mock data
      setProducts(mockProducts);
      setTotalCount(mockProducts.length);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Map sort options to API format
      const sortMap = {
        'default': 'default',
        'price-asc': 'priceAsc',
        'price-desc': 'priceDesc',
        'rating': 'name', // or your API's rating sort
        'newest': 'name',
      };

      const response = await ProductService.getAllProducts(
        currentPage,
        ITEMS_PER_PAGE,
        selectedBrandId,
        selectedTypeId,
        sortMap[sortBy] || 'default',
        null // Search is handled locally via filteredProducts
      );

      // Transform API data to match our component format
      const transformedProducts = (response.data || []).map(product => ({
        id: product.id,
        name: product.name,
        category: product.type?.name || product.typeName || 'General',
        price: product.price,
        originalPrice: product.originalPrice || null,
        rating: product.rating || 4.5,
        reviews: product.reviews || Math.floor(Math.random() * 1000) + 100,
        image: product.imageFile || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        images: product.images || [product.imageFile || product.image],
        description: product.description || product.summary || '',
        features: product.features || [],
        inStock: product.inStock !== false,
        badge: product.badge || null,
        // Keep original data for API operations
        _original: product,
      }));

      setProducts(transformedProducts);
      setTotalCount(response.count || transformedProducts.length);
      console.log('Loaded products:', transformedProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Using offline data.');
      // Fallback to mock data
      setProducts(mockProducts);
      setTotalCount(mockProducts.length);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedBrandId, selectedTypeId, sortBy]); // Removed searchFilterValue - filtering is done locally

  // Load brands from API
  const loadBrands = useCallback(async () => {
    if (!USE_API) return;

    try {
      const response = await ProductService.getAllBrands();
      setBrands(response || []);
    } catch (err) {
      console.error('Failed to load brands:', err);
    }
  }, []);

  // Load types/categories from API
  const loadTypes = useCallback(async () => {
    if (!USE_API) return;

    try {
      const response = await ProductService.getAllTypes();
      setTypes(response || []);
    } catch (err) {
      console.error('Failed to load types:', err);
    }
  }, []);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const typeId = searchParams.get('typeId');
    const brandId = searchParams.get('brandId');
    
    if (category) {
      setSelectedCategories([category]);
    }
    if (search) {
      setSearchInputValue(search);
      setSearchFilterValue(search);
    }
    if (page) {
      setCurrentPage(parseInt(page));
    }
    if (typeId) {
      setSelectedTypeId(typeId);
    }
    if (brandId) {
      setSelectedBrandId(brandId);
    }
  }, [searchParams]);

  // Load initial data
  useEffect(() => {
    loadBrands();
    loadTypes();
  }, [loadBrands, loadTypes]);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Filter products locally for mock data (API handles filtering server-side)
  const filteredProducts = useMemo(() => {
    // Always apply local filtering since API might fail and we fall back to mock data
    let result = [...products];

    // Apply search filter - use searchFilterValue (the debounced value)
    if (searchFilterValue) {
      const query = searchFilterValue.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query))
      );
    }

    // Apply category filter (for mock data)
    if (!USE_API && selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Apply price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    return result;
  }, [products, searchFilterValue, selectedCategories, priceRange, sortBy]);

  // Pagination
  const totalPages = USE_API 
    ? Math.ceil(totalCount / ITEMS_PER_PAGE)
    : Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    
  const paginatedProducts = useMemo(() => {
    if (USE_API) {
      return filteredProducts; // API handles pagination
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category/type toggle
  const toggleCategory = (categoryId) => {
    if (USE_API) {
      // For API, set the type ID directly
      setSelectedTypeId(selectedTypeId === categoryId ? null : categoryId);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((c) => c !== categoryId)
          : [...prev, categoryId]
      );
    }
    setCurrentPage(1);
  };

  // Handle brand toggle
  const toggleBrand = (brandId) => {
    setSelectedBrandId(selectedBrandId === brandId ? null : brandId);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrandId(null);
    setSelectedTypeId(null);
    setPriceRange([0, 1500]);
    setSearchInputValue('');
    setSearchFilterValue('');
    setIsSearching(false);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    setSortBy('default');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Combine categories from API types and mock data
  const displayCategories = USE_API && types.length > 0 
    ? types.map(t => ({ id: t.id, name: t.name, count: t.count || 0 }))
    : mockCategories;

  const activeFiltersCount =
    (USE_API ? (selectedBrandId ? 1 : 0) + (selectedTypeId ? 1 : 0) : selectedCategories.length) +
    (priceRange[0] > 0 || priceRange[1] < 1500 ? 1 : 0) +
    (searchFilterValue ? 1 : 0);

  // Filter Sidebar Content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchInputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            data-testid="store-search-input"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {searchInputValue && (
          <p className="text-xs text-muted-foreground mt-1">
            {isSearching ? 'Searching...' : `Showing results for "${searchFilterValue}"`}
          </p>
        )}
      </div>

      <Separator />

      {/* Brands (from API) */}
      {USE_API && brands.length > 0 && (
        <>
          <div>
            <Label className="text-sm font-medium mb-3 block">Brands</Label>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrandId === brand.id}
                    onCheckedChange={() => toggleBrand(brand.id)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Categories/Types */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Categories</Label>
        <div className="space-y-3">
          {displayCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={USE_API ? selectedTypeId === category.id : selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-normal cursor-pointer flex-1 flex justify-between items-center"
              >
                <span>{category.name}</span>
                {category.count > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({category.count})
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-4 block">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value);
            setCurrentPage(1);
          }}
          max={1500}
          step={10}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Store</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">All Products</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? 'Loading...' : `Showing ${paginatedProducts.length} of ${USE_API ? totalCount : filteredProducts.length} products`}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-heading font-semibold mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h2>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-80px)] pr-4">
                    <div className="py-6">
                      <FilterContent />
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Active Filters Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedBrandId && brands.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedBrandId(null)}
                  >
                    {brands.find((b) => b.id === selectedBrandId)?.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {selectedTypeId && types.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSelectedTypeId(null)}
                  >
                    {types.find((t) => t.id === selectedTypeId)?.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {!USE_API && selectedCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => toggleCategory(cat)}
                  >
                    {mockCategories.find((c) => c.id === cat)?.name}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>

              {/* Sort & View Options */}
              <div className="flex items-center gap-4 ml-auto">
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-r-none ${
                      viewMode === 'grid' ? 'bg-muted' : ''
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-l-none ${
                      viewMode === 'list' ? 'bg-muted' : ''
                    }`}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading products...</span>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                {/* Products Grid */}
                <div
                  className={`grid gap-4 md:gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
