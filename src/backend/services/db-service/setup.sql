DROP TABLE
  IF EXISTS accounts;

CREATE TABLE
  IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    username varchar(50) NOT NULL,
    pwhash varchar(255) NOT NULL,
    salt varchar(255) NOT NULL,
    rounds int(11) NOT NULL
  );

INSERT INTO
  accounts(id, username, pwhash, salt, rounds)
VALUES
  (
    1,
    'admin',
    '$2b$10$VfJdaGm1kU5Qw/PU.8IFHeoRh6al08VNWvcIUzP1o7sGYoaV6hj3S',
    '$2b$10$VfJdaGm1kU5Qw/PU.8IFHe',
    10
  );

DROP TABLE
  IF EXISTS services;

CREATE TABLE
  IF NOT EXISTS services (
    id varchar(50) PRIMARY KEY,
    title varchar(50) NOT NULL,
    description text,
    price bigint
  );

INSERT INTO
  services (id, title, description, price)
VALUES
  (
    "0x67656e6572616c207061796d656e740000000000000000000000000000000000",
    "General payment",
    "Generic payment transaction",
    null
  ),
  (
    "0x5469636b65743a205a6f6e65203126322c203930206d696e7574657300000000",
    "Ticket: Zone 1&2, 90 minutes",
    "This service allows an individual on board public transportation inside zones 1 and 2 for 90 minutes from the moment of purchase",
    1000000000000000000
  ),
  (
    "0x5469636b65743a205a6f6e65203126322c203120646179000000000000000000",
    "Ticket: Zone 1&2, 1 day",
    "This service allows an individual on board public transportation inside zones 1 and 2 for 24 hours from the moment of purchase",
    10000000000000000000
  ),
  (
    "0x5469636b65743a205a6f6e65203126322c2031207765656b0000000000000000",
    "Ticket: Zone 1&2, 1 week",
    "This service allows an individual on board public transportation inside zones 1 and 2 for 7 days from the moment of purchase",
    40000000000000000000
  );

DROP TABLE
  IF EXISTS payments;

CREATE TABLE
  IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY,
    status TEXT CHECK(
      status IN ('Created', 'Pending', 'Completed', 'Failed')
    ) NOT NULL DEFAULT 'Created',
    purchaseId varchar(50) NOT NULL UNIQUE,
    serviceId varchar(50) NOT NULL,
    accountAddress varchar(50),
    cardAddress varchar(50),
    signature varchar(50),
    price bigint NOT NULL
  );

SELECT
  *
FROM
  services;