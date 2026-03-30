Hinweis: Als Name für den initialen Branch wurde 'master' benutzt. Dieser
Hinweis: Standard-Branchname kann sich ändern. Um den Namen des initialen Branches
Hinweis: zu konfigurieren, der in allen neuen Repositories verwendet werden soll und
Hinweis: um diese Warnung zu unterdrücken, führen Sie aus:
Hinweis: 
Hinweis: 	git config --global init.defaultBranch <Name>
Hinweis: 
Hinweis: Häufig gewählte Namen statt 'master' sind 'main', 'trunk' und
Hinweis: 'development'. Der gerade erstellte Branch kann mit diesem Befehl
Hinweis: umbenannt werden:
Hinweis: 
Hinweis: 	git branch -m <Name>

DB löschen
sudo -u postgres psql
postgres=# DROP DATABASE "dci-student"; <= löscht DB dci-student
DROP DATABASE <= DB dci-student wurde gelöscht
postgres=# \l  <= zum listen

DB anlegen mit owner david
$ sudo -u postgres psql -c 'CREATE DATABASE shopdrop OWNER "david";'
$ psql -l  <= zum listen

$ sudo -u postgres psql
postgres=# CREATE DATABASE shopdrop OWNER david;
CREATE DATABASE
postgres=# \l
Oder kürze zu Liste DB
$ sudo -u postgres psql -c "\l"

                                                           List of databases
 Name      |Owner    |Encoding|Locale Prov|   Collate   |   Ctype    |ICU Locale|ICU Rules|Access privileges      
-----------+---------+--------+-----------+-------------+------------+----------+---------+-----------------
shopdrop   |david    | UTF8   | libc      | de_DE.UTF-8 |de_DE.UTF-8 |          |         | 
coffee_shop|postgres | UTF8   | libc      | de_DE.UTF-8 |de_DE.UTF-8 |          |         | 
(2 rows)
postgres=#
oder => $ psql -l

$ psql -d postgres -c "\du" 
# List of roles
  Role name  |                         Attributes                         
-------------+------------------------------------------------------------
 anton       | Superuser
 david       | 
 dci-student | 
 postgres    | Superuser, Create role, Create DB, Replication, Bypass RLS
 todo_user   | 

 Um dem Benutzer david diese weitreichenden Rechte (im Grunde volle Admin-Rechte) zu geben, nutzt du den ALTER ROLE-Befehl in PostgreSQL.
$ sudo -u postgres psql -d postgres -c "ALTER ROLE david WITH SUPERUSER CREATEROLE CREATEDB REPLICATION;"
them vao BYPASSRLS
$ sudo -u postgres psql -c "ALTER ROLE david WITH BYPASSRLS;"
ALTER ROLE

User david zum rechtmäßigen Besitzer von allem in der Datenbank shopdrop zu machen:
$ sudo -u postgres psql -d shopdrop -c "ALTER SCHEMA public OWNER TO david; GRANT ALL ON SCHEMA public TO david; ALTER DATABASE shopdrop OWNER TO david;"

$ sudo -u postgres psql -d shopdrop -f schema.sql
Was passiert hier?
sudo -u postgres: Du nimmst die Identität des Datenbank-Administrators an.
psql -d shopdrop: Du verbindest dich direkt mit deiner ShopDrop-Datenbank.
-f schema.sql: Du führst die Datei aus.


Was genau passiert hier?
Hier ist die Aufschlüsselung der Privilegien, die du david gerade gibst:

SUPERUSER: David darf alles (Sicherheitskontrollen ignorieren).

CREATEROLE: David darf neue Benutzer anlegen und löschen.

CREATEDB: David darf neue Datenbanken erstellen.

REPLICATION: David darf Daten-Streaming für Backups/Spiegelung nutzen.

BYPASSRLS: David ignoriert alle Row Level Security Regeln (er sieht jeden Datensatz in jeder Tabelle, egal welche Sicherheitsregeln gelten).

Überprüfen, ob es geklappt hat
Lass dir die Benutzerliste anzeigen. In der Spalte "Attributes" sollten jetzt alle diese Rechte bei david stehen:
$ sudo -u postgres psql -d postgres -c "\du"

3. Die Datei schema.sql in VSCode anlegen:
batch datei schema.sql in PostgreSQL-Datenbank einzulesen (auszuführen)

4. Schema an PostgreSQL schicken:
$ psql -d shopdrop -f schema.sql
als User david ausweisen muss
psql -U david -d deine_datenbank -f schema.sql

Zur Kontrolle:
Wenn es geklappt hat, kannst du in der psql-Konsole mit \dt nachsehen. Dort sollten jetzt deine Tabellen stehen:

dci-student@Lenovo-V15-G4-IRU:~/Antonio/Projekt/shopdrop$ sudo -u postgres psql -d shopdrop -c "\dt"
            List of relations
 Schema |    Name     | Type  |  Owner   
--------+-------------+-------+----------
 public | order_items | table | postgres
 public | orders      | table | postgres
 public | products    | table | postgres
(3 rows)
