#! /bin/sh

# backup DB
pg_dump --file "./DB_BACKUP" --password --format=c --blobs --host localhost --user postgres --blobs --encoding "UTF8" "expenses"


#/usr/bin/pg_dump --file "/home/serqio/expenses_backup_test" --host "localhost"
#--port "5432" --username "postgres" --no-password --verbose --format=c --blobs --encoding "UTF8" "expenses"