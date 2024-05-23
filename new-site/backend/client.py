import requests
import hashlib
import secrets
# Example code to call the Node.js API endpoint from Python
url = 'http://localhost:3000/api/create-profile'
payload = {'username': 'example_user', 'email': 'example@example.com', 'password': 'password123'}
response = requests.post(url, json=payload)

# Check response status and data
if response.status_code == 200:
    print('Profile created successfully')
else:
    print('Error creating profile:', response.text)

# Function to hash and salt the password
def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_bytes(16)  # Generate a random salt
    else:
        salt = bytes.fromhex(salt)  # Convert salt from hex string to bytes
    # Hash the password with SHA-256
    hashed_password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return hashed_password.hex(), salt.hex()  # Return hashed password and salt as hex strings

# Example of create_profile function in Python
def create_profile(username, password):
    # Perform validation checks (e.g., check if username and email are unique)
    # Generate a unique user ID
    user_id = username;
    # Hash and salt the password
    hashed_password, salt = hash_password(password)

    # Insert user data into a database (replace this with your database logic)
    # Example: db.insert('users', {'user_id': user_id, 'username': username, 'email': email, 'hashed_password': hashed_password, 'salt': salt})
    db.insert('users', {'user_id': user_id, 'username':username, 'hashed_password':hashed_password, 'salt':salt})
    # Return a response indicating success
    return {'success': True, 'message': 'Profile created successfully', 'user_id': user_id}

# Function to generate a unique user ID (replace this with your logic)
def generate_unique_id():
    # Implement your logic to generate a unique user ID (e.g., using UUID)
    pass