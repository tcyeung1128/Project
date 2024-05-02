drop table Subscribe_question_analysis;
drop table Subscribe_question;
drop table question_list;
drop table question_type;
drop table problem_set;
drop table personal_information;
drop table permission_name;

CREATE TABLE permission_name(
permission_name_id bigserial primary key,
permission_name_guid varchar(255) not null unique,
permission_name varchar(255) not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp
);

INSERT INTO permission_name (permission_name_guid, permission_name)
VALUES
  ('84a74633365227b345060f5629e06713', 'User');/*,
  ('0888710835fa234af23b382d845509e5', 'Permission 2'),
  ('guid3', 'Permission 3');*/

CREATE TABLE personal_information (
  personal_information_id bigserial primary key,
  personal_information_guid varchar(255) not null unique,
  personal_account varchar(255) not null unique,
  personal_password varchar(255) not null,
  last_login timestamp default current_timestamp,
  secret_key varchar(255),
  failed_attempts integer not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  permission_name_id_fk bigserial references permission_name(permission_name_id),
  permission_name_guid_fk varchar(255) references permission_name(permission_name_guid)
);
/*
INSERT INTO personal_information (personal_information_guid, personal_account, personal_password, secret_key, permission_name_id_fk, permission_name_guid_fk)
VALUES
  ('guid1', 'john123', 'password1', 'key1', 1, '84a74633365227b345060f5629e06713'),
  ('guid2', 'jane456', 'password2', 'key2', 1, '0888710835fa234af23b382d845509e5'),
  ('guid3', 'bob789', 'password3', 'key3', 3, 'guid3');
  */

CREATE TABLE problem_set(
problem_set_id bigserial primary key,
problem_set_guid varchar(255) not null unique,
problem_set_name varchar(255) not null,
problem_set_description varchar(255) not null,
problem_set_is_enable boolean not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp,
personal_information_id_fk bigserial references personal_information(personal_information_id),
personal_information_guid_fk varchar(255) references personal_information(personal_information_guid)
);
 /*
INSERT INTO problem_set (problem_set_guid, problem_set_name, problem_set_description, problem_set_is_enable, personal_information_id_fk, personal_information_guid_fk)
VALUES
  ('guid1', 'Problem Set 1', 'problem_set_description 1', true , 1, 'guid1'),
  ('guid2', 'Problem Set 2', 'problem_set_description 2', true , 2, 'guid2'),
  ('guid3', 'Problem Set 3', 'problem_set_description 3', true , 3, 'guid3');
 */
CREATE TABLE question_type(
question_type_id bigserial primary key,
question_type_guid varchar(255) not null unique,
question_type_name varchar(255) not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp
);

INSERT INTO question_type (question_type_guid, question_type_name)
VALUES 
  ('bebcf9872373583fc9530410edcdd19c', 'Multiple Choice'),
  ('f26e6f5f6f347636432e4ef891d774d8', 'Long Question');

CREATE TABLE question_list(
question_list_id bigserial primary key,
question_list_guid varchar(255) not null unique,
question_list_choice jsonb,
question_list_question varchar(255) not null,
question_list_answer varchar(255) not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp,
problem_set_id_fk bigserial references problem_set(problem_set_id),
problem_set_guid_fk varchar(255) references problem_set(problem_set_guid),
question_type_id_fk bigserial references question_type(question_type_id),
question_type_guid_fk varchar(255) references question_type(question_type_guid)
);
/*
INSERT INTO question_list (
  question_list_guid,
  question_list_choice,
  question_list_question,
  question_list_answer,
  problem_set_id_fk,
  problem_set_guid_fk,
  question_type_id_fk,
  question_type_guid_fk
) VALUES (
  'guid1',
  '{"choices": ["Option A", "Option B", "Option C"]}',
  'What is the capital of France?',
  'Option A',
  1,
  'guid1',
  1,
  'guid1'
), (
  'guid2',
  '{"choices": ["Option X", "Option Y", "Option Z"]}',
  'What is the largest planet in our solar system?',
  'Option Y',
  1,
  'guid1',
  1,
  'guid1'
), (
  'guid3',
  '{"choices": ["Option X", "Option Y", "Option Z"]}',
  'What is the largest planet in our solar system?',
  'Option Y',
  2,
  'guid2',
  1,
  'guid1'
),(
  'guid4',
  '{"choices": ["Option X", "Option Y", "Option Z"]}',
  'What is the largest planet in our solar system?',
  'Option Y',
  3,
  'guid3',
  1,
  'guid1'
);*/

CREATE TABLE Subscribe_question(
subscribe_question_id bigserial primary key,
subscribe_question_guid varchar(255) not null unique,
Subscribe_question_is_enable boolean not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp,
personal_information_id_fk bigserial references personal_information(personal_information_id),
personal_information_guid_fk varchar(255) references personal_information(personal_information_guid),
problem_set_id_fk bigserial references problem_set(problem_set_id),
problem_set_guid_fk varchar(255) references problem_set(problem_set_guid)
);
/*
INSERT INTO Subscribe_question (subscribe_question_guid, Subscribe_question_is_enable, personal_information_id_fk, 
personal_information_guid_fk, problem_set_id_fk, problem_set_guid_fk)
VALUES
  ('guid1', true, 1, 'guid1',  1, 'guid1'),
  ('guid2', true, 2, 'guid2',  2, 'guid2'),
  ('guid3', true, 3, 'guid3',  2, 'guid2');
 */
CREATE table Subscribe_question_analysis(
Subscribe_question_analysis_id bigserial primary key,
Subscribe_question_analysis_guid varchar(255) not null unique,
Subscribe_question_analysis_total_answer_count integer not null,
Subscribe_question_analysis_correct_answer_count integer not null,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp,
question_list_id_fk bigserial references question_list(question_list_id),
question_list_guid_fk  varchar(255) references question_list(question_list_guid),
subscribe_question_id_fk bigserial references Subscribe_question(subscribe_question_id),
subscribe_question_guid_fk varchar(255) references Subscribe_question(subscribe_question_guid)
);
/*
INSERT INTO Subscribe_question_analysis (Subscribe_question_analysis_guid, Subscribe_question_analysis_total_answer_count,
Subscribe_question_analysis_correct_answer_count, question_list_id_fk,
question_list_guid_fk, subscribe_question_id_fk, subscribe_question_guid_fk)
VALUES
  ('guid1', 10, 8, 1, 'guid1', 1, 'guid1'),
  ('guid2', 30, 8, 2, 'guid2', 1, 'guid1'),
  ('guid3', 60, 8, 1, 'guid1', 2, 'guid2'),
  ('guid4', 10, 8, 2, 'guid2', 2, 'guid2'),
  ('guid5', 15, 12, 1, 'guid1', 3, 'guid3');*/

