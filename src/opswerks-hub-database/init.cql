-- Create keyspace
CREATE KEYSPACE IF NOT EXISTS opswerkshubkeyspace 
WITH REPLICATION = {
  'class' : 'SimpleStrategy',
  'replication_factor' : 1
};

-- Create the users table
CREATE TABLE IF NOT EXISTS opswerkshubkeyspace.users (
  email TEXT PRIMARY KEY,
  password TEXT,
  loggedIn BOOLEAN
);

-- Create the liked_posts table
CREATE TABLE IF NOT EXISTS opswerkshubkeyspace.liked_posts (
  postId BIGINT,
  email TEXT,
  PRIMARY KEY (postId, email)
);

-- Create the posts table
CREATE TABLE IF NOT EXISTS opswerkshubkeyspace.posts (
  id BIGINT PRIMARY KEY,       
  username TEXT,               
  title TEXT,                
  content TEXT,               
  like INT,                   
  comments LIST<FROZEN<MAP<TEXT, TEXT>>>
);

