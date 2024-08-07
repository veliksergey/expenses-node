-- delete
DELETE FROM transaction;
DELETE FROM account;
DELETE FROM category;
DELETE FROM person;
DELETE FROM project;
DELETE FROM vendor;
DELETE FROM document;

-- insert
INSERT INTO account (id, "name") VALUES (1, 'checking'), (2, 'saving'), (3, 'cc 1'), (4, 'cc 2');
INSERT INTO category (id, "name", "type") VALUES (1, 'groceries', 2), (2, 'salary', 1), (3, 'rent', 0), (4, 'driving', 3), (5, 'bills', 2);
INSERT INTO person (id, "name") VALUES (1, 'serqio'), (2, 'victor');
INSERT INTO project (id, "name") VALUES (1, 'short term renting'), (2, 'construction'), (3, 'personal');
INSERT INTO vendor (id, "name") VALUES (1, 'walmart'), (2, 'home depot'), (3, 'victor'), (4, 'lowes'), (5, 'PGE'), (6, 'Job');
INSERT INTO transaction
    ("id", "type", "name", "amount", "relatedAmount", "date", "relatedDate", "notes", "accountId", "categoryId", "personId", "projectId", "vendorId")
    VALUES
    (1, 0, 'electricity', 243.54, 0, '2022-01-05', '2022-01-08', 'paying bill for electricity', 1, 5, 1, 1, 5),
    (2, 0, 'framing materials', 1890, 3456.1235, '2021-12-28', null, null, 3, 3, 1, 2, 2),
    (3, 0, 'some null values', 123.456, null, '2020-02-20', null, null, 1, null, 1, 1, 1),
    (4, 0, 'N', 0, null, '2020-02-20', null, null, null, null, null, 2, 2),
    (5, 1, 'salary', 3569, null, '2020-02-1', null, 'My job', 1, 2, null, 3, 6),
    (6, 0, null, 0, null, now(), null, null, null, null, null, null, null);


-- to fix duplicate key bug on .save
SELECT setval(pg_get_serial_sequence('"account"', 'id'),(SELECT MAX("id") FROM "account") + 1);
SELECT setval(pg_get_serial_sequence('"category"', 'id'),(SELECT MAX("id") FROM "category") + 1);
SELECT setval(pg_get_serial_sequence('"person"', 'id'),(SELECT MAX("id") FROM "person") + 1);
SELECT setval(pg_get_serial_sequence('"project"', 'id'),(SELECT MAX("id") FROM "project") + 1);
SELECT setval(pg_get_serial_sequence('"vendor"', 'id'),(SELECT MAX("id") FROM "vendor") + 1);
SELECT setval(pg_get_serial_sequence('"transaction"', 'id'),(SELECT MAX("id") FROM "transaction") + 1);
SELECT setval(pg_get_serial_sequence('"document"', 'id'),(SELECT MAX("id") FROM "document") + 1);

select * from transaction;