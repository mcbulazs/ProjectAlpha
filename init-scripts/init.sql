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


--creating default values

INSERT INTO USERS VALUES (DEFAULT, DEFAULT, 'admin','$2a$08$LZ8Hmw5hGlRZENJwReQcx.hx1vEDP0xpjMA29pNXinqfW32kg/C7i');
INSERT INTO allowed_origins VALUES (DEFAULT, DEFAULT, 'http://localhost:4200');