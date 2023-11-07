-- Part 1: Physical Database Design
-- A - Implementing the Database (2 marks)
-- You have to implement your database, based on your assigned topic, into the physical
-- database.
-- Giving the full explanation of your choices of data types, data length, and
-- constraints in your database.

/*
    TABLE: PATIENT
*/

drop table if exists patient CASCADE;

create table if not exists patient (
    unique_number VARCHAR(255) PRIMARY KEY,
    identity_number VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(6), -- Only male or female
    addr VARCHAR(255) NOT NULL,
    phone CHARACTER(10) NOT NULL UNIQUE
);

alter table patient owner to postgres;

-- Restrict gender column to male and female
ALTER TABLE patient ADD CONSTRAINT gender_constraint CHECK (gender IN ('Male', 'Female'));

/*
    TABLE: EMPLOYEE
*/

drop table if exists employee CASCADE;

create table if not exists employee (
    e_id VARCHAR(255) PRIMARY KEY,
    e_type VARCHAR(255) NOT NULL,
    is_head BOOLEAN
);

ALTER TABLE employee ADD CONSTRAINT e_type_constraint CHECK (e_type IN ('Doctor', 'Nurse', 'Staff', 'Volunteer', 'Manager'));

-- Only allow at most one doctor to be head
CREATE UNIQUE INDEX one_head_doctor ON employee (is_head) WHERE e_type = 'Doctor';

/*
    TABLE: PATIENT INSTANCE
*/

drop table if exists patient_instance CASCADE;

create table if not exists patient_instance (
    unique_number VARCHAR(255) NOT NULL REFERENCES patient(unique_number),
    location_before_admission VARCHAR(255) NOT NULL,
    admission_time TIMESTAMP NOT NULL,
    nurse_assigned VARCHAR(255) NOT NULL REFERENCES employee(e_id),
    patient_order INT NOT NULL, -- Order of admission
    PRIMARY KEY (unique_number, patient_order)
);

alter table if exists patient_instance owner to postgres;

-- ensure that nurse_assigned only points to nurse
/*
CREATE OR REPLACE FUNCTION check_nurse_assigned() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM employee WHERE e_type = 'Nurse' AND e_id = NEW.nurse_assigned) THEN
        RAISE EXCEPTION 'Invalid FK';
    END IF;
	RETURN NEW;
END;
$$

CREATE TRIGGER nurse_assigned
BEFORE INSERT OR UPDATE ON patient_instance
FOR EACH ROW
EXECUTE PROCEDURE check_nurse_assigned();
*/

/*
    TABLES: TESTINFO & 4 TEST TYPES
*/

drop table if exists test_info CASCADE;

create table if not exists test_info (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP NOT NULL,
    PRIMARY KEY (unique_number, patient_order, test_order),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table if exists test_info owner to postgres;

/* TABLE: SPO2 TEST */

drop table if exists spo2_test CASCADE;

create table if not exists spo2_test (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP not null,
    spo2_rate real	not null check(spo2_rate <= 1) check(spo2_rate >= 0),
    primary key(unique_number, patient_order, test_order),
    foreign key(unique_number, patient_order, test_order) references test_info(unique_number, patient_order, test_order)
);

alter table spo2_test owner to postgres;

/* TABLE: QUICK TEST */

drop table if exists quick_test CASCADE;

create table if not exists quick_test (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP not null,
    result BOOLEAN NOT NULL,
    ct_threshold INT NOT NULL,
    primary key(unique_number, patient_order, test_order),
    foreign key(unique_number, patient_order, test_order) references test_info(unique_number, patient_order, test_order)
);

alter table if exists quick_test owner to postgres;

/* TABLE: PCR TEST */

drop table if exists pcr_test CASCADE;

create table if not exists pcr_test (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP not null,
    result BOOLEAN NOT NULL,
    ct_threshold INT NOT NULL,
    primary key(unique_number, patient_order, test_order),
    foreign key(unique_number, patient_order, test_order) references test_info(unique_number, patient_order, test_order)
);

alter table pcr_test owner to postgres;

/* TABLE: RESPIRATORY RATE TEST*/

drop table if exists respiratory_rate_test CASCADE;

create table if not exists respiratory_rate_test (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP not null,
    respiratory_bpm INT NOT NULL,
    primary key(unique_number, patient_order, test_order),
    foreign key(unique_number, patient_order, test_order) references test_info(unique_number, patient_order, test_order)
);

alter table if exists respiratory_rate_test owner to postgres;

/*
    TABLE: COMORBIDITY
*/

drop table if exists cormobidity CASCADE;

create table if not exists cormobidity (
    c_id VARCHAR(255) PRIMARY KEY,
    c_description VARCHAR(255) NOT NULL,
    seriousness VARCHAR(255) NOT NULL
);

alter table cormobidity owner to postgres;

/*
    TABLE: SYMPTOM
*/

drop table if exists symptom CASCADE;

create table if not exists symptom (
    s_id VARCHAR(255) PRIMARY KEY,
    s_description VARCHAR(255) NOT NULL,
    seriousness VARCHAR(255) NOT NULL
);

alter table symptom owner to postgres;

/*
    TABLE: BUILDING
*/

drop table if exists building CASCADE;

create table if not exists building (
    building_id VARCHAR(255) PRIMARY KEY
);

alter table if exists building owner to postgres;

/*
    TABLE: FLOOR
*/

drop table if exists floor CASCADE;

create table if not exists floor (
    floor_id VARCHAR(255),
    building_id VARCHAR(255) NOT NULL REFERENCES building(building_id),
    primary key (building_id, floor_id)
);

alter table if exists floor owner to postgres;

/*
    TABLE: ROOM
*/

drop table if exists room CASCADE;

create table if not exists room (
    building_id VARCHAR(255) NOT NULL,
    floor_id VARCHAR(255) NOT NULL,
    room_id VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(255) NOT NULL,
    primary key (building_id, floor_id, room_id),
    foreign key (building_id, floor_id) references floor(building_id, floor_id)
);

alter table room owner to postgres;

ALTER TABLE room ADD CONSTRAINT room_type_constraint CHECK (room_type IN ('Normal', 'Emergency', 'Recuperation'));

/*
    TABLE: MEDICATION
*/

drop table if exists medication CASCADE;

create table if not exists medication (
    medication_id VARCHAR(255) PRIMARY KEY,
    medication_name VARCHAR(255) NOT NULL,
    price MONEY NOT NULL,
    exp_date DATE NOT NULL
);

alter table medication owner to postgres;

/*
    MULTIVALUED ATTRIBUTE: MEDICATION EFFECT
*/

drop table if exists medication_effect CASCADE;

create table if not exists medication_effect (
    medication_id VARCHAR(255) NOT NULL REFERENCES medication(medication_id),
	medication_effect_id VARCHAR(255),
    effect VARCHAR(255) NOT NULL,
	PRIMARY KEY (medication_id, medication_effect_id)
);

alter table medication_effect owner to postgres;

/*
///////////////////////////////////////////////////////
//////////////////// RELATIONSHIPS ////////////////////
///////////////////////////////////////////////////////
*/

/*
    RELATIONSHIP: HAS COMORBIDITY
*/

drop table if exists has_cormobidity CASCADE;

create table if not exists has_cormobidity (
    c_id VARCHAR(255) NOT NULL REFERENCES cormobidity(c_id),
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    PRIMARY KEY (unique_number, patient_order, c_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table has_cormobidity owner to postgres;

/*
    RELATIONSHIP: HAS SYMPTOM
*/

drop table if exists has_symptom CASCADE;

create table if not exists has_symptom (
    s_id VARCHAR(255) NOT NULL REFERENCES symptom(s_id),
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    PRIMARY KEY (unique_number, patient_order, s_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table has_symptom owner to postgres;

/*
    MULTIVALUED ATTRIBUTE: SYMPTOM PERIOD
*/

drop table if exists symptom_period CASCADE;

create table if not exists symptom_period (
    s_id VARCHAR(255) NOT NULL REFERENCES symptom(s_id),
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    FOREIGN KEY (unique_number, patient_order, s_id) REFERENCES has_symptom(unique_number, patient_order, s_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table symptom_period owner to postgres;

/*
    RELATIONSHIP: MOVES
*/

drop table if exists moves CASCADE;

create table if not exists moves (
    e_id VARCHAR(255) NOT NULL REFERENCES employee(e_id),
    building_id VARCHAR(255) NOT NULL,
    floor_id VARCHAR(255) NOT NULL,
    room_id VARCHAR(255) NOT NULL,
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    move_time TIMESTAMP NOT NULL,
    reason VARCHAR(255) NOT NULL,
    PRIMARY KEY (unique_number, patient_order, move_time),

    FOREIGN KEY (building_id, floor_id, room_id) REFERENCES room(building_id, floor_id, room_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table moves owner to postgres;

/*
    RELATIONSHIP: ADMITS
*/

drop table if exists admits CASCADE;

create table if not exists admits (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    building_id VARCHAR(255) NOT NULL,
    floor_id VARCHAR(255) NOT NULL,
    room_id VARCHAR(255) NOT NULL,
    e_id VARCHAR(255) NOT NULL REFERENCES employee(e_id),

    PRIMARY KEY (unique_number, patient_order),

    FOREIGN KEY (building_id, floor_id, room_id) REFERENCES room(building_id, floor_id, room_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table admits owner to postgres;

/*
    RELATIONSHIP: VOLUNTEER TAKES CARE
*/

drop table if exists volunteer_takes_care CASCADE;

create table if not exists volunteer_takes_care (
    e_id VARCHAR(255) NOT NULL REFERENCES employee(e_id),
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table if exists volunteer_takes_care owner to postgres;

-- Ensure that e_id of volunteer_takes_care points to a volunteer
/*
CREATE TRIGGER check_volunteer_takes_care BEFORE INSERT OR UPDATE ON volunteer_takes_care
    FOR EACH ROW
    BEGIN
        if not exists (SELECT 1 FROM employee WHERE e_type = 'Volunteer' AND e_id = new.e_id)  then
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid FK';
        end if;
    END;
*/

/*
    RELATIONSHIP: DISCHARGES
*/

drop table if exists discharges CASCADE;

create table if not exists discharges (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,

    e_id VARCHAR(255) NOT NULL REFERENCES employee(e_id),
    discharge_time TIMESTAMP NOT NULL,

    primary key(unique_number, patient_order),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

alter table if exists discharges owner to postgres;

-- Ensure that a person is only discharged by a doctor
/*
CREATE TRIGGER check_discharge BEFORE INSERT OR UPDATE ON discharges
    FOR EACH ROW
    BEGIN
        if not exists (SELECT 1 FROM employee WHERE e_type = 'Doctor' AND e_id = new.e_id)  then
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid FK';
        end if;
    END;
*/

/*
    RELATIONSHIP: TREATS
*/

drop table if exists treats CASCADE;

create table if not exists treats (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,

    e_id VARCHAR(255) NOT NULL REFERENCES employee(e_id),
    result VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    PRIMARY KEY (unique_number, patient_order, e_id, start_time, end_time),

    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

-- Ensure that a person is only treated by a doctor
/*
CREATE TRIGGER check_treats BEFORE INSERT OR UPDATE ON treats
    FOR EACH ROW
    BEGIN
        if not exists (SELECT 1 FROM employee WHERE e_type = 'Doctor' AND e_id = new.e_id)  then
            SET MESSAGE_TEXT = 'Invalid FK';
        end if;
    END;
*/

alter table if exists treats owner to postgres;

DROP TABLE IF EXISTS medications_in_treatment CASCADE;

CREATE TABLE IF NOT EXISTS medications_in_treatment (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    e_id VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    medication_id VARCHAR(255) NOT NULL REFERENCES medication(medication_id),

    FOREIGN KEY (unique_number, patient_order, e_id, start_time, end_time) REFERENCES treats(unique_number, patient_order, e_id, start_time, end_time)
);
