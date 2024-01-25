--user table
CREATE TABLE users (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL
);
--addresses from witch we allow requests
CREATE TABLE allowed_origins (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Origin varchar(255) NOT NULL
);

