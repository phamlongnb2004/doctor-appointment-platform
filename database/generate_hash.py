import bcrypt

# Generate hash for 'password123'
password = "password123".encode('utf-8')
hashed = bcrypt.hashpw(password, bcrypt.gensalt(10))
print("BCrypt hash:", hashed.decode('utf-8'))
