CREATE TABLE PUBLISHERS (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    LOGO VARCHAR(250),
    DESCRIPTION VARCHAR(250),
    LINK VARCHAR(100) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CATEGORY (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    DESCRIPTION VARCHAR(250),
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NEWS_SOURCES (
    ID SERIAL PRIMARY KEY,
    PUBLISHER_ID INTEGER NOT NULL REFERENCES PUBLISHERS(ID),
    CATEGORY_ID INTEGER NOT NULL REFERENCES CATEGORY(ID),
    NAME VARCHAR(100) NOT NULL,
    DESCRIPTION VARCHAR(250),
    LINK VARCHAR(100) NOT NULL,
    HEADERS TEXT,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NEW_SOURCES_SELECTORS (
    ID SERIAL PRIMARY KEY,
    PUBLISHER_ID INTEGER NOT NULL UNIQUE REFERENCES PUBLISHERS(ID),
    ITEMS TEXT NOT NULL,
    TITLE TEXT NOT NULL,
    IMAGE TEXT NOT NULL,
    POST_LINK TEXT NOT NULL,
    CONTENT TEXT NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);