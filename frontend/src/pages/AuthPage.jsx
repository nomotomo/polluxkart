import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Phone, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Logo from '../components/brand/Logo';
import { countryCodes, getCountryByCode } from '../data/countryCodes';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [loginCountryCode, setLoginCountryCode] = useState('+91');
  const [signupCountryCode, setSignupCountryCode] = useState('+91');
  
  const [loginData, setLoginData] = useState({ 
    email: '', 
    phone: '',
    password: '' 
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const loginCountry = getCountryByCode(loginCountryCode);
  const signupCountry = getCountryByCode(signupCountryCode);

  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = loginMethod === 'email' ? loginData.email : `${loginCountryCode}${loginData.phone}`;
    
    if (!loginData.email && loginMethod === 'email') {
      toast.error('Please enter your email');
      return;
    }
    
    if (!loginData.phone && loginMethod === 'phone') {
      toast.error('Please enter your phone number');
      return;
    }
    
    if (!loginData.password) {
      toast.error('Please enter your password');
      return;
    }
    
    // Validate phone number format based on country
    if (loginMethod === 'phone') {
      const phoneDigits = loginData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > loginCountry.maxLength) {
        toast.error(`Please enter a valid phone number (${loginCountry.maxLength} digits for ${loginCountry.country})`);
        return;
      }
    }
    
    try {
      await login(identifier, loginData.password, loginMethod);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.phone || !signupData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate phone number based on country
    const phoneDigits = signupData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > signupCountry.maxLength) {
      toast.error(`Please enter a valid phone number (${signupCountry.maxLength} digits for ${signupCountry.country})`);
      return;
    }
    
    // Validate email if provided
    if (signupData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (!signupData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    
    try {
      const fullPhone = `${signupCountryCode}${signupData.phone}`;
      await signup(signupData.name, signupData.email, fullPhone, signupData.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  const CountryCodeSelector = ({ value, onChange, id }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 px-2 h-10 rounded-r-none border-r-0 bg-muted/50 hover:bg-muted min-w-[90px]"
          data-testid={`country-code-${id}`}
        >
          <span className="text-base">{getCountryByCode(value).flag}</span>
          <span className="text-sm font-medium">{value}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <ScrollArea className="h-[300px]">
          {countryCodes.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onClick={() => onChange(country.code)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span className="text-lg">{country.flag}</span>
              <span className="flex-1 text-sm">{country.country}</span>
              <span className="text-sm text-muted-foreground">{country.code}</span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 min-h-[calc(100vh-200px)]">
          {/* Left Side - Branding */}
          <div className="flex-1 max-w-md text-center lg:text-left">
            <Link to="/" className="inline-block mb-6">
              <Logo size="large" />
            </Link>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Welcome to PolluxKart
            </h1>
            <p className="text-muted-foreground mb-8">
              Your one-stop destination for electronics, fashion, home essentials, and more.
              Join thousands of happy customers shopping with us.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success">✓</span>
                </div>
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success">✓</span>
                </div>
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success">✓</span>
                </div>
                Easy Returns
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-xl">
              <Tabs defaultValue="login" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
                    <TabsTrigger value="signup" data-testid="signup-tab">Sign Up</TabsTrigger>
                  </TabsList>
                </div>

                <CardContent className="pt-6">
                  {/* Login Tab */}
                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-4" data-testid="login-form">
                      {/* Login Method Selection */}
                      <div className="space-y-3">
                        <Label>Login with</Label>
                        <RadioGroup
                          value={loginMethod}
                          onValueChange={setLoginMethod}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="login-email-method" />
                            <Label htmlFor="login-email-method" className="font-normal cursor-pointer">
                              Email
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="login-phone-method" />
                            <Label htmlFor="login-phone-method" className="font-normal cursor-pointer">
                              Phone
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Email/Phone Input */}
                      {loginMethod === 'email' ? (
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="Enter your email"
                              value={loginData.email}
                              onChange={(e) =>
                                setLoginData({ ...loginData, email: e.target.value })
                              }
                              className="pl-10"
                              data-testid="login-email-input"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="login-phone">Phone Number</Label>
                          <div className="flex">
                            <CountryCodeSelector
                              value={loginCountryCode}
                              onChange={setLoginCountryCode}
                              id="login"
                            />
                            <Input
                              id="login-phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={loginData.phone}
                              onChange={(e) =>
                                setLoginData({ ...loginData, phone: e.target.value.replace(/\D/g, '').slice(0, loginCountry.maxLength) })
                              }
                              className="rounded-l-none"
                              maxLength={loginCountry.maxLength}
                              data-testid="login-phone-input"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password">Password</Label>
                          <Link
                            to="#"
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) =>
                              setLoginData({ ...loginData, password: e.target.value })
                            }
                            className="pl-10 pr-10"
                            data-testid="login-password-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark"
                        disabled={isLoading}
                        data-testid="login-submit-btn"
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>

                    <div className="mt-6">
                      <div className="relative">
                        <Separator />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                          OR
                        </span>
                      </div>

                      <div className="mt-6 space-y-3">
                        <Button variant="outline" className="w-full" type="button">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Continue with Google
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup" className="mt-0">
                    <form onSubmit={handleSignup} className="space-y-4" data-testid="signup-form">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name <span className="text-destructive">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={signupData.name}
                            onChange={(e) =>
                              setSignupData({ ...signupData, name: e.target.value })
                            }
                            className="pl-10"
                            data-testid="signup-name-input"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone Number <span className="text-destructive">*</span></Label>
                        <div className="flex">
                          <CountryCodeSelector
                            value={signupCountryCode}
                            onChange={setSignupCountryCode}
                            id="signup"
                          />
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={signupData.phone}
                            onChange={(e) =>
                              setSignupData({ ...signupData, phone: e.target.value.replace(/\D/g, '').slice(0, signupCountry.maxLength) })
                            }
                            className="rounded-l-none"
                            maxLength={signupCountry.maxLength}
                            data-testid="signup-phone-input"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">We'll send OTP for verification</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email (optional)"
                            value={signupData.email}
                            onChange={(e) =>
                              setSignupData({ ...signupData, email: e.target.value })
                            }
                            className="pl-10"
                            data-testid="signup-email-input"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password <span className="text-destructive">*</span></Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={signupData.password}
                            onChange={(e) =>
                              setSignupData({ ...signupData, password: e.target.value })
                            }
                            className="pl-10 pr-10"
                            data-testid="signup-password-input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password <span className="text-destructive">*</span></Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            value={signupData.confirmPassword}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="pl-10"
                            data-testid="signup-confirm-password-input"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={signupData.agreeTerms}
                          onCheckedChange={(checked) =>
                            setSignupData({ ...signupData, agreeTerms: checked })
                          }
                          data-testid="signup-terms-checkbox"
                        />
                        <Label htmlFor="terms" className="text-sm font-normal">
                          I agree to the{' '}
                          <Link to="#" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="#" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark"
                        disabled={isLoading}
                        data-testid="signup-submit-btn"
                      >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
