#!/usr/bin/env python3
"""
Backend API Test Suite for Brand CRUD Operations
Tests all brand-related APIs with proper authentication
"""

import asyncio
import aiohttp
import json
from typing import Dict, Any, Optional
import uuid
import sys
import os

# Configuration
BASE_URL = "https://admin-brand-feature.preview.emergentagent.com/api"
TEST_ADMIN = {
    "identifier": "test@polluxkart.com",  # Can be email or phone
    "password": "Test@123"
}

class BrandAPITester:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.token: Optional[str] = None
        self.test_brand_id: Optional[str] = None
        self.results = {
            "auth_login": False,
            "get_brands": False,
            "create_brand": False,
            "update_brand": False,
            "delete_brand": False,
            "migrate_brands": False,
            "products_brands": False
        }
        self.errors = []

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            connector=aiohttp.TCPConnector(ssl=False)
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   Details: {message}")
        if not success:
            self.errors.append(f"{test_name}: {message}")
        self.results[test_name] = success

    async def make_request(self, method: str, endpoint: str, data: Dict[Any, Any] = None, auth: bool = True) -> tuple:
        """Make HTTP request with proper error handling"""
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

    async def check_admin_setup_status(self):
        """Check if admin setup is needed"""
        print("\n=== Checking Admin Setup Status ===")
        
        status, data = await self.make_request("GET", "/admin/setup/status", auth=False)
        
        if status == 200:
            admin_exists = data.get("admin_exists", False)
            setup_available = data.get("setup_available", False)
            
            print(f"   Admin exists: {admin_exists}")
            print(f"   Setup available: {setup_available}")
            
            if not admin_exists and setup_available:
                return await self.create_initial_admin()
            elif admin_exists:
                return await self.check_existing_admins()
            else:
                self.log_result("setup_check", False, "Unknown setup state")
                return False
        else:
            self.log_result("setup_check", False, f"Status {status}: {data}")
            return False

    async def check_existing_admins(self):
        """Check existing admin users"""
        print("\n=== Checking Existing Admins ===")
        
        status, data = await self.make_request("GET", "/admin/setup/admin-info", auth=False)
        
        if status == 200:
            admin_count = data.get("admin_count", 0)
            admins = data.get("admins", [])
            
            print(f"   Found {admin_count} admin(s)")
            for admin in admins:
                print(f"   - {admin.get('email', 'No email')} ({admin.get('role', 'unknown role')})")
            
            return admin_count > 0
        else:
            print(f"   Could not check admins: Status {status}")
            return False

    async def create_initial_admin(self):
        """Create initial admin user"""
        print("\n=== Creating Initial Admin ===")
        
        admin_data = {
            "email": "test@polluxkart.com",
            "phone": "9876543210",
            "name": "Test Admin",
            "password": "Test@123",
            "setup_key": "POLLUXKART_INITIAL_ADMIN_2025"
        }
        
        status, data = await self.make_request("POST", "/admin/setup/initial-admin", admin_data, auth=False)
        
        if status == 201:
            print(f"   ✅ Created admin user: {data.get('user', {}).get('email', 'Unknown')}")
            return True
        else:
            print(f"   ❌ Failed to create admin: Status {status}, Response: {data}")
            return False
        """Test admin login and get JWT token"""
        print("\n=== Testing Admin Authentication ===")
        
        status, data = await self.make_request(
            "POST", 
            "/auth/login", 
            TEST_ADMIN, 
            auth=False
        )
        
        if status == 200 and isinstance(data, dict) and "access_token" in data:
            self.token = data["access_token"]
            user_role = data.get("user", {}).get("role", "")
            if user_role in ["admin", "super_admin"]:
                self.log_result("auth_login", True, f"Successfully logged in as {user_role}")
            else:
                self.log_result("auth_login", False, f"User role is '{user_role}', not admin")
        else:
            self.log_result("auth_login", False, f"Login failed: Status {status}, Response: {data}")

    async def test_get_brands(self):
        """Test GET /api/admin/brands"""
        print("\n=== Testing GET All Brands ===")
        
        status, data = await self.make_request("GET", "/admin/brands")
        
        if status == 200:
            if isinstance(data, list):
                self.log_result("get_brands", True, f"Retrieved {len(data)} brands")
                if data:
                    print(f"   Sample brand: {data[0].get('name', 'Unknown')}")
            else:
                self.log_result("get_brands", False, f"Expected list, got: {type(data)}")
        else:
            self.log_result("get_brands", False, f"Status {status}: {data}")

    async def test_create_brand(self):
        """Test POST /api/admin/brands"""
        print("\n=== Testing Create Brand ===")
        
        brand_data = {
            "name": f"TestBrand_{uuid.uuid4().hex[:8]}",
            "description": "A premium test brand for automated testing",
            "logo": "https://example.com/logo.png",
            "website": "https://testbrand.com",
            "is_active": True
        }
        
        status, data = await self.make_request("POST", "/admin/brands", brand_data)
        
        if status == 201:
            if isinstance(data, dict) and "id" in data:
                self.test_brand_id = data["id"]
                brand_name = data.get("name", "Unknown")
                self.log_result("create_brand", True, f"Created brand '{brand_name}' with ID: {self.test_brand_id}")
            else:
                self.log_result("create_brand", False, f"Expected brand object, got: {data}")
        else:
            self.log_result("create_brand", False, f"Status {status}: {data}")

    async def test_update_brand(self):
        """Test PUT /api/admin/brands/{brand_id}"""
        print("\n=== Testing Update Brand ===")
        
        if not self.test_brand_id:
            self.log_result("update_brand", False, "No test brand ID available")
            return
        
        update_data = {
            "description": "Updated description for automated test brand",
            "website": "https://updated-testbrand.com"
        }
        
        status, data = await self.make_request(
            "PUT", 
            f"/admin/brands/{self.test_brand_id}", 
            update_data
        )
        
        if status == 200:
            if isinstance(data, dict) and data.get("id") == self.test_brand_id:
                updated_desc = data.get("description", "")
                if "Updated description" in updated_desc:
                    self.log_result("update_brand", True, f"Successfully updated brand")
                else:
                    self.log_result("update_brand", False, "Description was not updated properly")
            else:
                self.log_result("update_brand", False, f"Unexpected response: {data}")
        else:
            self.log_result("update_brand", False, f"Status {status}: {data}")

    async def test_migrate_brands(self):
        """Test POST /api/admin/brands/migrate"""
        print("\n=== Testing Migrate Brands ===")
        
        status, data = await self.make_request("POST", "/admin/brands/migrate")
        
        if status == 200:
            if isinstance(data, dict) and "details" in data:
                details = data["details"]
                migrated = details.get("migrated", 0)
                skipped = details.get("skipped", 0)
                total = details.get("total_brands", 0)
                self.log_result("migrate_brands", True, 
                    f"Migration completed: {migrated} migrated, {skipped} skipped, {total} total")
            else:
                self.log_result("migrate_brands", False, f"Unexpected response format: {data}")
        else:
            self.log_result("migrate_brands", False, f"Status {status}: {data}")

    async def test_products_brands(self):
        """Test GET /api/products/brands (public endpoint)"""
        print("\n=== Testing Public Brands List ===")
        
        status, data = await self.make_request("GET", "/products/brands", auth=False)
        
        if status == 200:
            if isinstance(data, list):
                self.log_result("products_brands", True, f"Retrieved {len(data)} brand names")
                if data:
                    print(f"   Sample brands: {data[:3]}")
            else:
                self.log_result("products_brands", False, f"Expected list, got: {type(data)}")
        else:
            self.log_result("products_brands", False, f"Status {status}: {data}")

    async def test_delete_brand(self):
        """Test DELETE /api/admin/brands/{brand_id}"""
        print("\n=== Testing Delete Brand ===")
        
        if not self.test_brand_id:
            self.log_result("delete_brand", False, "No test brand ID available")
            return
        
        status, data = await self.make_request("DELETE", f"/admin/brands/{self.test_brand_id}")
        
        if status == 200:
            if isinstance(data, dict) and "message" in data:
                message = data["message"]
                if "deleted successfully" in message.lower():
                    self.log_result("delete_brand", True, f"Brand deleted: {message}")
                else:
                    self.log_result("delete_brand", False, f"Unexpected message: {message}")
            else:
                self.log_result("delete_brand", False, f"Unexpected response: {data}")
        elif status == 400:
            # Brand might have products - this is expected behavior
            error_msg = data.get("detail", str(data))
            if "products" in error_msg.lower():
                self.log_result("delete_brand", True, f"Expected error - cannot delete brand with products: {error_msg}")
            else:
                self.log_result("delete_brand", False, f"Unexpected error: {error_msg}")
        else:
            self.log_result("delete_brand", False, f"Status {status}: {data}")

    def print_summary(self):
        """Print test results summary"""
        print("\n" + "="*60)
        print("BRAND API TEST SUMMARY")
        print("="*60)
        
        passed = sum(1 for result in self.results.values() if result)
        total = len(self.results)
        
        for test_name, result in self.results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status}: {test_name}")
        
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if self.errors:
            print("\n❌ FAILED TESTS:")
            for error in self.errors:
                print(f"   - {error}")
        else:
            print("\n🎉 All tests passed!")
        
        return passed == total

    async def run_all_tests(self):
        """Run all brand API tests in sequence"""
        print("Starting Brand CRUD API Tests...")
        print(f"Target URL: {BASE_URL}")
        
        # Run tests in logical order
        setup_success = await self.check_admin_setup_status()
        await self.test_admin_login()
        
        if not self.token:
            print("❌ Cannot proceed without authentication")
            return False
        
        await self.test_get_brands()
        await self.test_migrate_brands()  # Run migrate first to ensure brands exist
        await self.test_create_brand()
        await self.test_update_brand()
        await self.test_products_brands()
        await self.test_delete_brand()
        
        return self.print_summary()


async def main():
    """Main test runner"""
    try:
        async with BrandAPITester() as tester:
            success = await tester.run_all_tests()
            sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Test execution failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())