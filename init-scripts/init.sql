--user table
CREATE TABLE users (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL
);
--addresses from witch we allow requests
CREATE TABLE allowed_origins (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    Origin varchar(255) NOT NULL,
    WebId int NOT NULL
);

