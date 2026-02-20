import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Package, Grid3X3, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { categories } from '../../data/products';
import Logo from '../brand/Logo';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Orders', path: '/orders' },
  ];

  const isActive = (path) => location.pathname === path;

  // Category icons map
  const categoryIcons = {
    electronics: '💻',
    fashion: '👗',
    home: '🏠',
    grocery: '🍎',
    beauty: '✨',
    sports: '🏋️',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo size="default" showText={true} className="hidden sm:flex" />
            <Logo size="small" showText={false} className="sm:hidden" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-muted hover:text-primary ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary bg-transparent hover:bg-muted data-[state=open]:bg-muted"
                    data-testid="categories-nav-trigger"
                  >
                    <Grid3X3 className="h-4 w-4 mr-1.5" />
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] p-4" data-testid="categories-nav-content">
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <NavigationMenuLink key={category.id} asChild>
                            <Link
                              to={`/store?category=${category.id}`}
                              className="group flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors"
                              data-testid={`nav-category-${category.id}`}
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
                                {categoryIcons[category.id] || '📦'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                  {category.name}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {category.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {category.subcategories?.slice(0, 2).map((sub) => (
                                    <span 
                                      key={sub.id}
                                      className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                                    >
                                      {sub.name}
                                    </span>
                                  ))}
                                  {category.subcategories?.length > 2 && (
                                    <span className="text-[10px] px-1.5 py-0.5 text-primary">
                                      +{category.subcategories.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <Link
                          to="/store"
                          className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-dark font-medium py-2 hover:bg-primary/5 rounded-lg transition-colors"
                          data-testid="view-all-categories"
                        >
                          View All Products
                          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                data-testid="search-input"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              data-testid="mobile-search-toggle"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden sm:flex"
              onClick={() => navigate('/wishlist')}
              data-testid="header-wishlist-btn"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
              data-testid="cart-btn"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="user-menu-btn">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email || user.phone}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/cart')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
                className="hidden sm:flex"
                data-testid="login-btn"
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu-btn">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-6">
                  <Link to="/">
                    <Logo size="default" />
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`text-base font-medium transition-colors hover:text-primary p-2 rounded-md ${
                          isActive(link.path)
                            ? 'text-primary bg-primary/5'
                            : 'text-foreground'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    
                    {/* Mobile Categories */}
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold text-muted-foreground mb-2 px-2">Categories</p>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/store?category=${category.id}`}
                          className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          <span>{categoryIcons[category.id] || '📦'}</span>
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    
                    <Link
                      to="/wishlist"
                      className={`text-base font-medium transition-colors hover:text-primary flex items-center gap-2 p-2 rounded-md ${
                        isActive('/wishlist') ? 'text-primary bg-primary/5' : 'text-foreground'
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Link>
                  </nav>
                  {!isAuthenticated && (
                    <Button onClick={() => navigate('/auth')} className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Login / Sign Up
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-3 border-t border-border">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4"
                  autoFocus
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
