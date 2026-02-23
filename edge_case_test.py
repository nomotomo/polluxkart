#!/usr/bin/env python3
"""
Extended Brand API Tests - Edge cases and error conditions
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
    "identifier": "test@polluxkart.com",
    "password": "Test@123"
}

class ExtendedBrandTester:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.token: Optional[str] = None
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

    async def login(self):
        """Login as admin"""
        status, data = await self.make_request("POST", "/auth/login", TEST_ADMIN, auth=False)
        if status == 200 and "access_token" in data:
            self.token = data["access_token"]
            return True
        return False

    async def test_edge_cases(self):
        """Test various edge cases and error conditions"""
        print("=== Testing Brand API Edge Cases ===\n")

        # Test 1: Create brand with duplicate name
        print("1. Testing duplicate brand name...")
        brand_name = f"EdgeTest_{uuid.uuid4().hex[:6]}"
        
        brand_data = {
            "name": brand_name,
            "description": "First brand",
            "is_active": True
        }
        
        # Create first brand
        status1, data1 = await self.make_request("POST", "/admin/brands", brand_data)
        print(f"   First brand creation: Status {status1}")
        
        if status1 == 201:
            brand_id = data1.get("id")
            
            # Try to create duplicate
            status2, data2 = await self.make_request("POST", "/admin/brands", brand_data)
            if status2 == 400 and "already exists" in str(data2):
                print("   ✅ Duplicate name correctly rejected")
            else:
                print(f"   ❌ Expected 400 error, got Status {status2}: {data2}")
            
            # Clean up
            await self.make_request("DELETE", f"/admin/brands/{brand_id}")
        
        # Test 2: Update to existing name
        print("\n2. Testing update to existing name...")
        brand1_data = {"name": f"Brand1_{uuid.uuid4().hex[:6]}", "is_active": True}
        brand2_data = {"name": f"Brand2_{uuid.uuid4().hex[:6]}", "is_active": True}
        
        status1, data1 = await self.make_request("POST", "/admin/brands", brand1_data)
        status2, data2 = await self.make_request("POST", "/admin/brands", brand2_data)
        
        if status1 == 201 and status2 == 201:
            brand1_id = data1.get("id")
            brand2_id = data2.get("id")
            
            # Try to update brand2 name to brand1's name
            update_data = {"name": brand1_data["name"]}
            status, data = await self.make_request("PUT", f"/admin/brands/{brand2_id}", update_data)
            
            if status == 400 and "already exists" in str(data):
                print("   ✅ Update to duplicate name correctly rejected")
            else:
                print(f"   ❌ Expected 400 error, got Status {status}: {data}")
            
            # Clean up
            await self.make_request("DELETE", f"/admin/brands/{brand1_id}")
            await self.make_request("DELETE", f"/admin/brands/{brand2_id}")

        # Test 3: Invalid brand ID operations
        print("\n3. Testing invalid brand ID operations...")
        fake_id = str(uuid.uuid4())
        
        # Get non-existent brand
        status, data = await self.make_request("PUT", f"/admin/brands/{fake_id}", {"name": "Test"})
        if status == 404 or (status == 200 and not data):
            print("   ✅ Update non-existent brand handled correctly")
        else:
            print(f"   ⚠️ Unexpected response for non-existent brand: Status {status}")
        
        # Delete non-existent brand
        status, data = await self.make_request("DELETE", f"/admin/brands/{fake_id}")
        if status == 404 or status == 200:
            print("   ✅ Delete non-existent brand handled correctly")
        else:
            print(f"   ⚠️ Unexpected response: Status {status}")

        # Test 4: Empty/invalid data
        print("\n4. Testing empty/invalid data...")
        
        # Empty name
        status, data = await self.make_request("POST", "/admin/brands", {"name": "", "is_active": True})
        if status == 422 or status == 400:
            print("   ✅ Empty name correctly rejected")
        else:
            print(f"   ⚠️ Empty name response: Status {status}")
        
        # Missing required fields
        status, data = await self.make_request("POST", "/admin/brands", {"description": "No name"})
        if status == 422:
            print("   ✅ Missing name field correctly rejected")
        else:
            print(f"   ⚠️ Missing name response: Status {status}")

        # Test 5: Authentication required
        print("\n5. Testing authentication requirements...")
        temp_token = self.token
        self.token = None  # Remove auth
        
        status, data = await self.make_request("GET", "/admin/brands")
        if status == 401 or status == 403:
            print("   ✅ Authentication required for admin endpoints")
        else:
            print(f"   ❌ Expected auth error, got Status {status}")
        
        self.token = temp_token  # Restore auth

        # Test 6: Brand filtering and pagination
        print("\n6. Testing brand filtering...")
        
        # Test include_inactive parameter
        status, data = await self.make_request("GET", "/admin/brands?include_inactive=true")
        if status == 200:
            print(f"   ✅ Include inactive parameter works (returned {len(data) if isinstance(data, list) else 'unknown'} brands)")
        else:
            print(f"   ⚠️ Include inactive failed: Status {status}")

        print("\n=== Edge Case Testing Complete ===")

async def main():
    """Main test runner"""
    try:
        async with ExtendedBrandTester() as tester:
            if await tester.login():
                print("✅ Logged in successfully")
                await tester.test_edge_cases()
            else:
                print("❌ Failed to login")
                sys.exit(1)
    except Exception as e:
        print(f"❌ Test execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())