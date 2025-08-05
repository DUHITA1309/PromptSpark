-- Get your user ID from the auth.users table
-- Replace 'your-email@example.com' with your actual email address

SELECT id as user_id, email 
FROM auth.users 
WHERE email = 'your-email@example.com';
