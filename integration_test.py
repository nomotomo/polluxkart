#!/usr/bin/env python3
"""
Integration Test - Brand with Products
Test scenarios around brands that have products
"""

import asyncio
import aiohttp
import json
from typing import Dict, Any, Optional
import uuid
import sys

BASE_URL = "https://admin-brand-feature.preview.emergentagent.com/api"
TEST_ADMIN = {
    "identifier": "test@polluxkart.com",
    "password": "Test@123"
}

class BrandProductIntegrationTester:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.token: Optional[str] = None
        self.test_brand_id: Optional[str] = None
        self.test_product_id: Optional[str] = None
        self.test_category_id: Optional[str] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            connector=aiohttp.TCPConnector(ssl=False)
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def make_request(self, method: str, endpoint: str, data: Dict[Any, Any] = None, auth: bool = True) -> tuple:
        """Make HTTP request"""
        url = f"{BASE_URL}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if auth and self.token:
            headers["Authorization"] = f"Bearer {self.token}"

        try:
            async with self.session.request(
                method=method,
                url=url,
                headers=headers,
                json=data if data else None
            ) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                return response.status, response_data
        except Exception as e:
            return 0, {"error": f"Request failed: {str(e)}"}

    async def login(self):
        """Login as admin"""
        status, data = await self.make_request("POST", "/auth/login", TEST_ADMIN, auth=False)
        if status == 200 and "access_token" in data:
            self.token = data["access_token"]
            return True
        return False

    async def setup_test_data(self):
        """Create test category, brand, and product"""
        print("=== Setting up test data ===")
        
        # Create test category first
        category_data = {
            "name": f"TestCategory_{uuid.uuid4().hex[:6]}",
            "description": "Test category for brand integration",
            "is_active": True
        }
        
        status, data = await self.make_request("POST", "/admin/categories", category_data)
        if status == 201:
            self.test_category_id = data.get("id")
            print(f"✅ Created test category: {self.test_category_id}")
        else:
            print(f"❌ Failed to create category: {status}")
            return False
        
        # Create test brand
        brand_data = {
            "name": f"IntegrationBrand_{uuid.uuid4().hex[:6]}",
            "description": "Test brand for integration testing",
            "is_active": True
        }
        
        status, data = await self.make_request("POST", "/admin/brands", brand_data)
        if status == 201:
            self.test_brand_id = data.get("id")
            self.test_brand_name = data.get("name")
            print(f"✅ Created test brand: {self.test_brand_name}")
        else:
            print(f"❌ Failed to create brand: {status}")
            return False
        
        # Create test product with the brand
        product_data = {
            "name": f"TestProduct_{uuid.uuid4().hex[:6]}",
            "description": "Product for brand integration testing",
            "price": 99.99,
            "original_price": 149.99,
            "category_id": self.test_category_id,
            "brand": self.test_brand_name,
            "stock": 100,
            "images": ["https://example.com/test-product.jpg"],
            "features": ["Test Feature 1", "Test Feature 2"],
            "is_active": True
        }
        
        status, data = await self.make_request("POST", "/admin/products", product_data)
        if status == 201:
            self.test_product_id = data.get("id")
            print(f"✅ Created test product: {self.test_product_id}")
            return True
        else:
            print(f"❌ Failed to create product: {status} - {data}")
            return False

    async def test_brand_with_products(self):
        """Test brand operations when products exist"""
        print("\n=== Testing Brand Operations with Products ===")
        
        # Test: Get brands - should show product count
        print("\n1. Testing brand with product count...")
        status, data = await self.make_request("GET", "/admin/brands")
        
        if status == 200 and isinstance(data, list):
            test_brand = next((b for b in data if b.get("id") == self.test_brand_id), None)
            if test_brand:
                product_count = test_brand.get("product_count", 0)
                print(f"   ✅ Brand shows product count: {product_count}")
                if product_count > 0:
                    print(f"   ✅ Product count is correctly updated: {product_count}")
                else:
                    print(f"   ⚠️ Product count might be 0, should be at least 1")
            else:
                print("   ❌ Test brand not found in response")
        else:
            print(f"   ❌ Failed to get brands: Status {status}")

        # Test: Try to delete brand with products (should fail)
        print("\n2. Testing delete brand with products...")
        status, data = await self.make_request("DELETE", f"/admin/brands/{self.test_brand_id}")
        
        if status == 400:
            error_message = data.get("detail", str(data))
            if "products" in error_message.lower():
                print(f"   ✅ Correctly prevented deletion: {error_message}")
            else:
                print(f"   ⚠️ Got 400 but unexpected message: {error_message}")
        else:
            print(f"   ❌ Expected 400 error, got Status {status}: {data}")

        # Test: Public brands endpoint
        print("\n3. Testing public brands endpoint...")
        status, data = await self.make_request("GET", "/products/brands", auth=False)
        
        if status == 200 and isinstance(data, list):
            if self.test_brand_name in data:
                print(f"   ✅ Brand appears in public brands list")
            else:
                print(f"   ⚠️ Brand not found in public list. Available: {data}")
        else:
            print(f"   ❌ Failed to get public brands: Status {status}")

        # Test: Update brand (should work fine)
        print("\n4. Testing update brand with products...")
        update_data = {
            "description": "Updated description for brand with products"
        }
        
        status, data = await self.make_request("PUT", f"/admin/brands/{self.test_brand_id}", update_data)
        
        if status == 200:
            if data.get("description") == update_data["description"]:
                print("   ✅ Brand update successful with products attached")
            else:
                print("   ⚠️ Brand updated but description not changed")
        else:
            print(f"   ❌ Failed to update brand: Status {status}")

    async def cleanup_test_data(self):
        """Clean up test data"""
        print("\n=== Cleaning up test data ===")
        
        # Delete product first
        if self.test_product_id:
            status, _ = await self.make_request("DELETE", f"/admin/products/{self.test_product_id}")
            print(f"   Product cleanup: Status {status}")
        
        # Delete brand
        if self.test_brand_id:
            status, _ = await self.make_request("DELETE", f"/admin/brands/{self.test_brand_id}")
            print(f"   Brand cleanup: Status {status}")
        
        # Delete category
        if self.test_category_id:
            status, _ = await self.make_request("DELETE", f"/admin/categories/{self.test_category_id}")
            print(f"   Category cleanup: Status {status}")

    async def run_integration_tests(self):
        """Run all integration tests"""
        print("Starting Brand-Product Integration Tests...")
        
        if not await self.login():
            print("❌ Failed to login")
            return False
        
        if not await self.setup_test_data():
            print("❌ Failed to setup test data")
            return False
        
        try:
            await self.test_brand_with_products()
        finally:
            await self.cleanup_test_data()
        
        print("\n✅ Integration tests completed")
        return True

async def main():
    """Main test runner"""
    try:
        async with BrandProductIntegrationTester() as tester:
            await tester.run_integration_tests()
    except Exception as e:
        print(f"❌ Test execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())