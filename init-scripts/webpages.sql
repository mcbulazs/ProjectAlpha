--webpage table
CREATE TABLE webpages (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Name varchar(255) NOT NULL DEFAULT 'blank',
    Owner_Id int NOT NULL,
    Preset_Id int NOT NULL DEFAULT 1,
    Logo_Id int DEFAULT NULL
);


--files table
CREATE TABLE files (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Type varchar(255) NOT NULL,
    Path varchar(255) NOT NULL
);
