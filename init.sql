CREATE TABLE users (
    Id SERIAL PRIMARY KEY,
    Username varchar(255) NOT NULL,
    Password varchar(255) NOT NULL
);

Insert into users (Username,Password) values ('Admin','Admin123');