--webpage table
CREATE TABLE webpages (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Name varchar(255) NOT NULL DEFAULT 'blank',
    Owner_Id int NOT NULL,
    Preset_Id int NOT NULL DEFAULT 1,
    Logo_Id int not null DEFAULT 0,
    Banner_ID int not null DEFAULT 0
);


--files table
CREATE TABLE files (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Type varchar(255) NOT NULL,
    Path varchar(255) NOT NULL
);

--articles
CREATE TABLE articles (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Title varchar(255) NOT NULL default '',
    Date TIMESTAMP ,
    Content varchar NOT NULL default ''
);

--recruitment
CREATE TABLE recruitment (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Class varchar(255) NOT NULL default 'any',
    Subclass varchar(255) NOT NULL default 'any'
);

--navbar
CREATE TABLE navbar (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL,
    Path varchar(255) NOT NULL,
    Ranking int NOT NULL
);

--twitch/youtube
create table channels (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Type varchar(255) NOT NULL,
    Name varchar(255) NOT NULL,
    Link varchar(255) NOT NULL
);

--progress / raids
create table progress (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL
);

create table raids (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    Progress_Id int NOT NULL,
    Difficulty varchar(255) NOT NULL,
    Max int NOT NULL,
    Current int NOT NULL
);

--calendar
create table calendar (
    Id SERIAL PRIMARY KEY,
    Record_Log TIMESTAMP DEFAULT NULL,
    WebId int NOT NULL,
    Name varchar(255) NOT NULL,
    Date TIMESTAMP NOT NULL,
    Type varchar(255)
);


