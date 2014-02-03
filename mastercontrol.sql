--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = true;

--
-- Name: content; Type: TABLE; Schema: public; Owner: master1; Tablespace: 
--

CREATE TABLE content (
    content json,
    stamps json,
    tags json,
    comments json,
    htmlblob text
);


ALTER TABLE public.content OWNER TO master1;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: master1; Tablespace: 
--

CREATE TABLE sessions (
    session_data json NOT NULL,
    session_ip character(15),
    session_id character(30),
    session_key character(200),
    session_cryptoken character(250),
    session_useroid oid,
    session_timestamp bigint
);


ALTER TABLE public.sessions OWNER TO master1;

--
-- Name: users; Type: TABLE; Schema: public; Owner: master1; Tablespace: 
--

CREATE TABLE users (
    credentials json NOT NULL,
    profile json,
    messages json,
    session json[]
);


ALTER TABLE public.users OWNER TO master1;

--
-- Data for Name: content; Type: TABLE DATA; Schema: public; Owner: master1
--

COPY content (content, stamps, tags, comments, htmlblob) FROM stdin;
{"type":"login"}	\N	\N	\N	'<form class="form form-signup" role="form" ng-submit="loginForm(this.form)">\n  <div class="panel-body span3" style="float: left;width:300px">\n      <div class="form-group">\n\t  <div class="input-group">\n\t      <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>\n\t      <input type="text" class="form-control" placeholder="Username" ng-model="this.form.userName" style="background-color:{{formcolor ? formcolor : 'white'}}"/>\n\t  </div>\n      </div>\n      <div class="form-group">\n\t  <div class="input-group">\n\t      <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span>\n\t      </span>\n\t      <input type="text" class="form-control" placeholder="Email Address" ng-model="this.form.userEmail" style="background-color:{{formcolor ? formcolor : 'white'}}"/>\n\t  </div>\n      </div>\n      <div class="form-group">\n\t  <div class="input-group">\n\t      <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>\n\t      <input type="password" class="form-control" placeholder="Password" ng-model="this.form.userPassword" style="background-color:{{formcolor ? formcolor : 'white'}}"/>\n\t  </div>\n      </div>\n      \n      <a class="btn btn-primary btn-large" ng-click="loginchoice()"><i class="icon-white icon-user"></i>{{loginoption}}</a>\n      <input class="btn btn-primary btn-large" type="submit" value="Submit">\n      <a class="btn btn-primary btn-large"><i class="icon-white icon-user"></i>Email Reset</a>  \t\t\t        \n  </div>\n  <div class="panel-body span3" style="visibility:{{newuserdiv}}">\n      <div class="form-group">\n\t  <div class="input-group">\n\t      <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>\n\t      <input type="text" class="form-control" placeholder="Display Name" ng-model="this.form.displayName" style="background-color:{{formcolor ? formcolor : 'white'}}"/>\n\t  </div>\n      </div>\n      <div class="form-group">\n\t  <div class="input-group">\n\t      <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span>\n\t      </span>\n\t      <input type="text" class="form-control" placeholder="Repeat Email Address" ng-model="this.form.repeatEmail" style="background-color:{{formcolor ? formcolor : 'white'}}"/>\n\t  </div>\n      </div>\n      <div class="form-group">\n\t  <div class="input-group">\n\t      <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>\n\t      <input type="password" class="form-control" placeholder="Repeat Password" ng-model="this.form.repeatPassword" style="background-color:{{formcolor ? formcolor : 'white'}}"/>\n\t  </div>\n      </div>\n  </div>\n</form>'
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: master1
--

COPY sessions (session_data, session_ip, session_id, session_key, session_cryptoken, session_useroid, session_timestamp) FROM stdin;
{"somedata":"Now with values!"}	127.0.0.1      	2UKvI1TUyjWGixQzqiih          	ecde7855-c230-c8d5-ef67-897e3ebefdbdd572f946-ca49-822e-aa23-e26ab7a135d7                                                                                                                                	U2FsdGVkX1/zSOr/mP7PZwRsJ0U1rt6LWDJaT+qsepEh4ydG330EjjMAW4vZN8WD                                                                                                                                                                                          	24589	1391194696162
{"somedata":"Now with values!"}	127.0.0.1      	Nwudl17fCNqM_B4vrTKN          	ab95b66c-57b2-43ef-73f4-866aad1d12ee4c9b937a-1710-5c5d-01ea-2aabd409ecc6                                                                                                                                	U2FsdGVkX1+fO4PVLP7w5YXst9735oTackY36WhqfZfwIquLqGnPw6HYpBEhRRcN                                                                                                                                                                                          	24589	\N
{"somedata":"Now with values!"}	127.0.0.1      	Kf6MqpcItLOt0-Hzvsq8          	283027be-a882-4ea8-a234-a180e1d053a04a4ccabb-146a-3703-ee8c-c21a38b280d0                                                                                                                                	U2FsdGVkX19uB/r2nZjxVcMs+bQ3KZs4utFS0bnHDSR8/N/jAQfb/Y5kGJX5+reu                                                                                                                                                                                          	24589	\N
{"somedata":"Now with values!"}	               	aLk6h6u6o5QrEv0QScPo          	d1c7723b-6a51-10ca-0348-4124007e8174eea2d582-6b21-e3e8-28ce-ba18ce7c0306                                                                                                                                	U2FsdGVkX1/TU6YWgih+feuqoPHypIl3BaP228zKkql5t5Vo/3YTtNTK+cABRQ+I                                                                                                                                                                                          	24589	1391121401051
{"somedata":"Now with values!"}	127.0.0.1      	yu0GDc47UXocaSxgMA4O          	5030ed5b-82d6-79be-e158-79d87113941de18a95d3-e525-4a43-5f11-97529cbba2ac                                                                                                                                	U2FsdGVkX1+X0InmDQmI/c1yVr+Gk5Afc4kBkxnAFWb8O/y2KUph8R71x2dzRBTJ                                                                                                                                                                                          	24589	1391187263446
{"somedata":"Now with values!"}	127.0.0.1      	MX-5FLMa2ylu8EltP_wD          	cd470c20-b78a-d7c1-84c4-5496d96b8ffd40f5a1d7-a944-52ab-7974-f628bf065301                                                                                                                                	U2FsdGVkX1/Zgx7wZFbgmhINS+3h9oCPq8Efb6od839X7gpQ48pwBttNDO5S+fQ8                                                                                                                                                                                          	24589	1391187747280
{"somedata":"Now with values!"}	127.0.0.1      	1qtaIPjqxNgWeF0AZw5p          	5b4e1e50-ddc9-109f-8594-8d1c87a17cd0cecb466e-c046-1b40-ddcb-68fe2c6d100f                                                                                                                                	U2FsdGVkX18ViOWz9truoxnRi83JJ5eODZT+J8uhsdauN5DRI9eeTX9C7YqasR5/                                                                                                                                                                                          	24589	1391190295429
{"somedata":"Now with values!"}	127.0.0.1      	xc4LRjtcOSfjI_FPo8qn          	5d14db50-2659-5031-fffa-e5cb7b3b02c2b47d599b-1ec4-c409-38da-efe18942010d                                                                                                                                	U2FsdGVkX1+8IWrm78y9EpxxKTHf1Z5Fd8xcaP2RIAWP9piyPdm3WF/b/6pUbHEn                                                                                                                                                                                          	24589	1391194271961
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: master1
--

COPY users (credentials, profile, messages, session) FROM stdin;
{"username":"Batman","password":"password","email":"batman@gmail.com","magiccrypto":"1235eryrthsdbgt45gw34egfghdfgw", "group":"Administrator"}	{"displayname":"Batman","icon":"http://coolawesomemovies.com/wp-content/uploads/2012/08/batman-logo.gif","slogan":"Holy bat shitman!"}	\N	\N
\.


--
-- Name: users_expr_idx; Type: INDEX; Schema: public; Owner: master1; Tablespace: 
--

CREATE INDEX users_expr_idx ON users USING btree (((credentials ->> 'username'::text)));


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

