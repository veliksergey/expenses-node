-- delete
DELETE FROM transaction_related_transaction;
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
INSERT INTO vendor (id, "name") VALUES (1, 'walmart'), (2, 'home depot'), (3, 'victor'), (4, 'lowes'), (5, 'PGE');
INSERT INTO transaction
    ("id", "name", "amount", "relatedAmount", "date", "relatedDate", "nonTaxable", "notes", "accountId", "categoryId", "personId", "projectId", "vendorId")
    VALUES
    (1, 'electricity', 243.54, 0, '2022-01-05', '2022-01-08', false, 'paying bill for electricity', 1, 5, 1, 1, 5),
    (2, 'framing materials', 1890, 3456.1235, '2021-12-28', null, false, null, 3, 3, 1, 2, 2),
    (3, 'testing nulls', 123.456, null, '2020-02-20', null, true, null, 1, null, 1, 1, 1),
    (4, 'nn', 0, null, '2020-02-20', null, false, null, 2, null, 2, 2, 2);