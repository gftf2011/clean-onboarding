#!/bin/bash

set -e

# Create Databases
psql $POSTGRES_DB -c "CREATE DATABASE $POSTGRES_DEV_DB WITH ENCODING 'UTF8' TEMPLATE template1"

# Create Users
psql $POSTGRES_DB -c "CREATE USER $POSTGRES_DEV_USER WITH PASSWORD '$POSTGRES_DEV_PASSWORD' VALID UNTIL '2030-01-01' CONNECTION LIMIT $POSTGRES_MAX_CONNECTIONS"

# Create Extentions
psql $POSTGRES_DEV_DB -c "CREATE EXTENSION \"uuid-ossp\""

# Create Schemas
psql $POSTGRES_DEV_DB -c "CREATE SCHEMA IF NOT EXISTS users_schema AUTHORIZATION $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "CREATE SCHEMA IF NOT EXISTS emails_schema AUTHORIZATION $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "CREATE SCHEMA IF NOT EXISTS taxvats_schema AUTHORIZATION $POSTGRES_DEV_USER"

# Create Tables
# psql $POSTGRES_DEV_DB -c "CREATE TABLE IF NOT EXISTS taxvats_schema.taxvat_blacklist(
#   id uuid DEFAULT uuid_generate_v4 (),
#   document VARCHAR(11) UNIQUE NOT NULL,
#   PRIMARY KEY (id)
# )"

# psql $POSTGRES_DEV_DB -c "CREATE TABLE IF NOT EXISTS emails_schema.email_blacklist(
#   id uuid DEFAULT uuid_generate_v4 (),
#   domain TEXT UNIQUE NOT NULL,
#   PRIMARY KEY (id)
# )"

# Insert values to tables
# ========================================

# disposable_emails_file='./documents/disposable-emails.txt'
# blacklist_taxvats_file='./documents/blacklist-taxvats.txt'

# while read line; do
#   psql $POSTGRES_DEV_DB -c "INSERT INTO emails_schema.email_blacklist (domain) VALUES ('$line')"
# done < $disposable_emails_file

# while read line; do
#   psql $POSTGRES_DEV_DB -c "INSERT INTO taxvats_schema.taxvat_blacklist (document) VALUES ('$line')"
# done < $blacklist_taxvats_file
# ========================================

psql $POSTGRES_DEV_DB -c "CREATE TABLE IF NOT EXISTS users_schema.users(
  id uuid NOT NULL,
  document TEXT NOT NULL,
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  locale TEXT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT users_name_check CHECK (LENGTH(CAST(name AS TEXT)) > 1),
  CONSTRAINT users_lastname_check CHECK (LENGTH(CAST(lastname AS TEXT)) > 1),
  CONSTRAINT users_email_check CHECK (email ~ '^[a-zA-Z0-9\._-]+\@[a-zA-Z0-9._-]+\.[a-zA-Z]+\$')
)"

# Create Index for gmail like index domains
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_gmail ON users_schema.users(email) WHERE email LIKE '%gmail.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_outlook ON users_schema.users(email) WHERE email LIKE '%outlook.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_yahoo ON users_schema.users(email) WHERE email LIKE '%yahoo.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_aol ON users_schema.users(email) WHERE email LIKE '%aol.com%'"
psql $POSTGRES_DEV_DB -c "CREATE INDEX IF NOT EXISTS idx_users_email_hotmail ON users_schema.users(email) WHERE email LIKE '%hotmail.com%'"

# Grant Privileges
psql $POSTGRES_DB -c "GRANT CONNECT ON DATABASE $POSTGRES_DEV_DB TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "GRANT USAGE ON SCHEMA users_schema TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "GRANT USAGE ON SCHEMA emails_schema TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "GRANT USAGE ON SCHEMA taxvats_schema TO $POSTGRES_DEV_USER"
psql $POSTGRES_DEV_DB -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA users_schema TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA emails_schema TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA taxvats_schema TO $POSTGRES_DEV_USER"

# Alter Data
psql $POSTGRES_DB -c "ALTER DATABASE $POSTGRES_DEV_DB OWNER TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "ALTER SCHEMA users_schema OWNER TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "ALTER SCHEMA emails_schema OWNER TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "ALTER SCHEMA taxvats_schema OWNER TO $POSTGRES_DEV_USER"

psql $POSTGRES_DEV_DB -c "ALTER TABLE users_schema.users OWNER TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "ALTER TABLE emails_schema.email_blacklist OWNER TO $POSTGRES_DEV_USER"
# psql $POSTGRES_DEV_DB -c "ALTER TABLE taxvats_schema.taxvat_blacklist OWNER TO $POSTGRES_DEV_USER"