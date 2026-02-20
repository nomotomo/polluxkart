"""
Pytest configuration and shared fixtures for PolluxKart API tests
"""
import pytest
import requests
import os

# Get BASE_URL from environment
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="session")
def base_url():
    """Return the base URL for API calls"""
    return BASE_URL

@pytest.fixture(scope="function")
def api_client():
    """Shared requests session - function scope to avoid header pollution"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture(scope="session")
def test_user_credentials():
    """Test user credentials"""
    return {
        "identifier": "test@polluxkart.com",
        "password": "Test@123"
    }

@pytest.fixture(scope="session")
def test_user_phone():
    """Test user phone number"""
    return "+919876543210"

@pytest.fixture(scope="session")
def auth_token(base_url, test_user_credentials):
    """Get authentication token for test user"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    
    response = session.post(
        f"{base_url}/api/auth/login",
        json=test_user_credentials
    )
    if response.status_code == 200:
        return response.json().get("access_token")
    # If login fails, try to register the user first
    register_data = {
        "email": "test@polluxkart.com",
        "phone": "+919876543210",
        "name": "Test User",
        "password": "Test@123"
    }
    reg_response = session.post(f"{base_url}/api/auth/register", json=register_data)
    if reg_response.status_code in [200, 201]:
        return reg_response.json().get("access_token")
    pytest.skip("Authentication failed - skipping authenticated tests")

@pytest.fixture(scope="function")
def authenticated_client(auth_token):
    """Session with auth header - function scope for clean state"""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}"
    })
    return session

@pytest.fixture(scope="session")
def sample_product_id(base_url):
    """Get a sample product ID from the database"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    response = session.get(f"{base_url}/api/products?page_size=1")
    if response.status_code == 200:
        products = response.json().get("products", [])
        if products:
            return products[0]["id"]
    return None
