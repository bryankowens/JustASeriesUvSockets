

-- Table: content

-- DROP TABLE content;

CREATE TABLE content
(
  content json,
  stamps json,
  tags json,
  comments json
)
WITH (
  OIDS=TRUE
);
ALTER TABLE content
  OWNER TO master1;
  
C:\zabbix\zabbix_agentd.exe --config C:\zabbix\zabbix.conf --install  
  
  
  -- Table: users

-- DROP TABLE users;

CREATE TABLE users
(
  credentials json NOT NULL,
  profile json,
  messages json
)
WITH (
  OIDS=TRUE
);
ALTER TABLE users
  OWNER TO master1;

-- Index: users_expr_idx

-- DROP INDEX users_expr_idx;

CREATE INDEX users_expr_idx
  ON users
  USING btree
  ((credentials ->> 'username'::text) COLLATE pg_catalog."default");

  