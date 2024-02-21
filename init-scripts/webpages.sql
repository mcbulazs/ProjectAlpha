--webpage table
CREATE TABLE webpages (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    Name varchar(255) NOT NULL DEFAULT '',
    Owner_Id int NOT NULL,
    Template_Id int NOT NULL DEFAULT 0,
    Preset_Id int NOT NULL DEFAULT 0,
    Custom_Css varchar not null DEFAULT '',
    Logo_AccessUrl varchar(255) NOT NULL DEFAULT '',
    Banner_AccessUrl varchar(255) NOT NULL DEFAULT '',
    Rules varchar NOT NULL DEFAULT ''
);


--files table
CREATE TABLE files (
    Id SERIAL PRIMARY KEY, 
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    Path varchar(255) NOT NULL,
    AccessUrl varchar(255) NOT NULL, 
    WebId int NOT NULL,
    Extension varchar(255),
    Type varchar(255) DEFAULT null
);

CREATE OR REPLACE FUNCTION set_default_values()
RETURNS TRIGGER AS $$
BEGIN
    NEW.Path := '/app/files/' || NEW.WebId::TEXT || '/images/' || COALESCE(NEW.Type || '/', '') || NEW.Id::TEXT  || COALESCE('.' || NEW.Extension, '');
    NEW.AccessUrl := 'images/' || COALESCE(NEW.Type || '/', '') || NEW.Id::TEXT   || COALESCE('.' || NEW.Extension, '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_values_trigger
BEFORE INSERT ON files
FOR EACH ROW
EXECUTE FUNCTION set_default_values();

--articles
CREATE TABLE articles (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Title varchar(255) NOT NULL DEFAULT '',
    Date TIMESTAMP ,
    Content varchar NOT NULL DEFAULT ''
);
CREATE INDEX idx_articles_webId ON articles (webId);

--recruitment
CREATE TABLE recruitment (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Class varchar(255) NOT NULL DEFAULT 'any',
    Subclass text[] NOT NULL DEFAULT ARRAY['any']
);
CREATE INDEX idx_recruitment_webId ON recruitment (webId);

--navbar
CREATE TABLE navbar (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL,
    Path varchar(255) NOT NULL,
    Ranking int NOT NULL,
    Enabled BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_navbar_webId ON navbar (webId);

--channels
create table channels (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Site varchar(255) NOT NULL,
    Name varchar(255) NOT NULL,
    Link varchar(255) NOT NULL
);
CREATE INDEX idx_channels_webId ON channels (webId);

--progress
create table progress (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL,
    Background_AccessUrl varchar(255) NOT NULL DEFAULT '',
    Raids JSONB NOT NULL DEFAULT '[]'
);
CREATE INDEX idx_progress_webId ON progress (webId);

--calendar
create table calendar (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL,
    Date TIMESTAMP NOT NULL,
    Type varchar(255)
);

--rules
/*
create table rules (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Rule varchar NOT NULL DEFAULT ''
);
CREATE INDEX idx_calendar_webId ON calendar (webId);*/

