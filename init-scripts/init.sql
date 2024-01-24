CREATE OR REPLACE FUNCTION SET_RECORD_LOG()
RETURNS TRIGGER AS $$
BEGIN
    NEW.Record_Log := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--user table
CREATE TABLE users (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL
);

CREATE TRIGGER USERS_SET_RECORD_LOG
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION SET_RECORD_LOG();


--addresses from witch we allow requests
CREATE TABLE allowed_origins (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Origin varchar(255) NOT NULL
);



CREATE TRIGGER ALLOWED_ORIGINS_SET_RECORD_LOG
BEFORE INSERT ON allowed_origins
FOR EACH ROW
EXECUTE FUNCTION SET_RECORD_LOG();

--creating default values

INSERT INTO USERS VALUES (DEFAULT, DEFAULT, 'admin','$2a$08$LZ8Hmw5hGlRZENJwReQcx.hx1vEDP0xpjMA29pNXinqfW32kg/C7i');
INSERT INTO allowed_origins VALUES (DEFAULT, DEFAULT, 'http://localhost:4200');