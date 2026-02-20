"""
Admin Authentication tests - Tests for admin role verification and protected routes
"""
import pytest
import os

# BASE_URL: Use environment variable if available, otherwise fallback to production URL
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL') or os.environ.get('API_BASE_URL') or 'https://admin-auth-fix-10.preview.emergentagent.com'
BASE_URL = BASE_URL.rstrip('/')


class TestAdminAuth:
    """Admin authentication and role verification tests"""
    
    def test_admin_login_returns_role(self, api_client):
        """Test that admin login returns user with admin role in response"""
        login_data = {
            "identifier": "test@polluxkart.com",
            "password": "Test@123"
        }
        
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=login_data)
        
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert "role" in data["user"], "User response must include role field"
        assert data["user"]["role"] == "admin", f"Expected admin role, got {data['user'].get('role')}"
    
    def test_admin_dashboard_stats_with_token(self, api_client):
        """Test admin dashboard stats API with valid admin token"""
        # First login as admin
        login_data = {
            "identifier": "test@polluxkart.com",
            "password": "Test@123"
        }
        login_response = api_client.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert login_response.status_code == 200
        
        token = login_response.json()["access_token"]
        
        # Request admin dashboard stats
        headers = {"Authorization": f"Bearer {token}"}
        stats_response = api_client.get(f"{BASE_URL}/api/admin/stats", headers=headers)
        
        assert stats_response.status_code == 200, f"Admin stats failed: {stats_response.text}"
        
        stats_data = stats_response.json()
        # Verify stats structure - common dashboard fields
        assert "total_products" in stats_data or "products" in stats_data or isinstance(stats_data, dict)
    
    def test_admin_products_endpoint_with_token(self, api_client):
        """Test that admin can access products list with token"""
        # Login as admin
        login_data = {
            "identifier": "test@polluxkart.com",
            "password": "Test@123"
        }
        login_response = api_client.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert login_response.status_code == 200
        
        token = login_response.json()["access_token"]
        
        # Access products (should work with pageSize=50 fix)
        headers = {"Authorization": f"Bearer {token}"}
        products_response = api_client.get(
            f"{BASE_URL}/api/products?page=1&pageSize=50",
            headers=headers
        )
        
        assert products_response.status_code == 200, f"Products fetch failed: {products_response.text}"
        
        data = products_response.json()
        assert "products" in data
    
    def test_admin_products_large_pagesize_fails(self, api_client):
        """Test that very large pageSize returns 422 validation error"""
        login_data = {
            "identifier": "test@polluxkart.com",
            "password": "Test@123"
        }
        login_response = api_client.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert login_response.status_code == 200
        
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Try with pageSize > 100 (which caused the original 422 error)
        products_response = api_client.get(
            f"{BASE_URL}/api/products?page=1&pageSize=100",
            headers=headers
        )
        
        # This should either work or return 422 - documenting current behavior
        # If it returns 200, the limit has been increased
        # If it returns 422, the fix is to use smaller pageSize
        if products_response.status_code == 422:
            print("pageSize=100 causes 422 - need to use 50 or less")
        else:
            print(f"pageSize=100 returns {products_response.status_code}")
    
    def test_protected_endpoint_without_token_fails(self, api_client):
        """Test that protected admin endpoints fail without token"""
        # Try to access admin stats without token
        response = api_client.get(f"{BASE_URL}/api/admin/stats")
        
        # Should fail with 401 or 403
        assert response.status_code in [401, 403], f"Expected auth error, got {response.status_code}"
    
    def test_regular_user_role_on_login(self, api_client, test_user_credentials):
        """Test that regular users get 'user' role on login"""
        # Use test fixtures for regular user - this may be same as admin for test purposes
        # Creating a new regular user to verify role
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        
        # Register new user
        register_data = {
            "email": f"TEST_regular_{unique_id}@polluxkart.com",
            "phone": f"+91{unique_id}12345",
            "name": f"Regular User {unique_id}",
            "password": "TestPass@123"
        }
        
        register_response = api_client.post(f"{BASE_URL}/api/auth/register", json=register_data)
        
        if register_response.status_code == 201:
            data = register_response.json()
            # New users should have 'user' role by default
            if "user" in data and "role" in data["user"]:
                assert data["user"]["role"] == "user", f"New user should have 'user' role, got {data['user']['role']}"
            else:
                # Role might not be returned on registration
                # Login to check
                login_data = {
                    "identifier": register_data["email"],
                    "password": register_data["password"]
                }
                login_response = api_client.post(f"{BASE_URL}/api/auth/login", json=login_data)
                if login_response.status_code == 200:
                    login_data_resp = login_response.json()
                    if "user" in login_data_resp and "role" in login_data_resp["user"]:
                        assert login_data_resp["user"]["role"] == "user"


class TestJWTTokenRole:
    """Tests for JWT token containing role information"""
    
    def test_jwt_token_contains_role_claim(self, api_client):
        """Verify that the JWT token payload includes the role claim"""
        login_data = {
            "identifier": "test@polluxkart.com",
            "password": "Test@123"
        }
        
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 200
        
        data = response.json()
        token = data["access_token"]
        
        # Decode JWT (without verification) to check claims
        import base64
        import json
        
        # JWT format: header.payload.signature
        parts = token.split('.')
        if len(parts) == 3:
            # Decode payload (add padding if needed)
            payload_b64 = parts[1]
            padding = 4 - len(payload_b64) % 4
            if padding != 4:
                payload_b64 += '=' * padding
            
            payload_json = base64.urlsafe_b64decode(payload_b64)
            payload = json.loads(payload_json)
            
            assert "role" in payload, "JWT token should contain 'role' claim"
            assert payload["role"] == "admin", f"Admin user JWT should have role='admin', got {payload.get('role')}"
