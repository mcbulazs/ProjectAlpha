--webpage table
CREATE TABLE webpages (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Name varchar(255) NOT NULL DEFAULT '',
    Owner_Id int NOT NULL,
    Template_Id int NOT NULL DEFAULT 0
);


--files table
CREATE TABLE files (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Type varchar(255) NOT NULL,
    Path varchar(255) NOT NULL,
    AccessUrl varchar(255) NOT NULL,
    CorrId int not null
);

--articles
CREATE TABLE articles (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Title varchar(255) NOT NULL DEFAULT '',
    Date TIMESTAMP ,
    Content varchar NOT NULL DEFAULT ''
);
CREATE INDEX idx_articles_webId ON articles (webId);

--recruitment
CREATE TABLE recruitment (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Class varchar(255) NOT NULL DEFAULT 'any',
    Subclass text[] NOT NULL DEFAULT ARRAY['any']
);
CREATE INDEX idx_recruitment_webId ON recruitment (webId);

--navbar
CREATE TABLE navbar (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL,
    Path varchar(255) NOT NULL,
    Ranking int NOT NULL,
    Enabled BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_navbar_webId ON navbar (webId);

--twitch/youtube
create table channels (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Type varchar(255) NOT NULL,
    Name varchar(255) NOT NULL,
    Link varchar(255) NOT NULL
);
CREATE INDEX idx_channels_webId ON channels (webId);

--progress / raids
create table progress (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL
);
CREATE INDEX idx_progress_webId ON progress (webId);

create table raids (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Progress_Id int NOT NULL,
    Difficulty varchar(255) NOT NULL,
    Max int NOT NULL,
    Current int NOT NULL
);
CREATE INDEX idx_raids_webId ON raids (Progress_Id);

--calendar
create table calendar (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL,
    Date TIMESTAMP NOT NULL,
    Type varchar(255)
);

--rules
create table rules (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Rule varchar NOT NULL DEFAULT ''
);
CREATE INDEX idx_calendar_webId ON calendar (webId);

