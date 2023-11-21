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
    is_head BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE employee ADD CONSTRAINT e_type_constraint CHECK (e_type IN ('Doctor', 'Nurse', 'Staff', 'Volunteer', 'Manager'));

-- Only allow at most one doctor to be head
CREATE UNIQUE INDEX one_head_doctor ON employee (is_head) WHERE e_type = 'Doctor' AND is_head=TRUE;

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
	is_warning BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (unique_number, patient_order)
);

-- ensure that nurse_assigned only points to nurse
CREATE OR REPLACE FUNCTION check_nurse_assigned()
RETURNS TRIGGER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM employee WHERE e_type = 'Nurse' AND e_id = NEW.nurse_assigned) THEN
        RAISE EXCEPTION 'Invalid FK';
    END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER nurse_assigned
BEFORE INSERT OR UPDATE ON patient_instance
FOR EACH ROW
EXECUTE PROCEDURE check_nurse_assigned();

/*
    TABLES: TESTINFO & 4 TEST TYPES
*/

drop table if exists test_info CASCADE;

create table if not exists test_info (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP NOT NULL,

    test_type VARCHAR(30) NOT NULL,
    spo2_rate real DEFAULT NULL,
    result BOOLEAN DEFAULT NULL,
    ct_threshold INT DEFAULT NULL,
    respiratory_bpm INT DEFAULT NULL,

    PRIMARY KEY (unique_number, patient_order, test_order),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

ALTER TABLE test_info ADD CONSTRAINT test_type_constraint CHECK (test_type IN ('SPO2 Test', 'Quick Test', 'PCR Test', 'Respiratory Rate Test'));
ALTER TABLE test_info ADD CONSTRAINT spo2_constraint CHECK (test_type != 'SPO2 Test' OR NOT(spo2_rate > 1 OR spo2_rate < 0));
ALTER TABLE test_info ADD CONSTRAINT result_constraint CHECK (NOT(test_type = 'Quick Test' OR test_type = 'PCR Test') OR result = FALSE OR result = TRUE);
ALTER TABLE test_info ADD CONSTRAINT ct_threshold_constraint CHECK (NOT(test_type = 'Quick Test' OR test_type = 'PCR Test') OR result = FALSE OR ct_threshold>=0);
ALTER TABLE test_info ADD CONSTRAINT respiratory_bpm_constraint CHECK (test_type != 'Respiratory Rate Test' OR respiratory_bpm>=0);

/*
    TABLE: COMORBIDITY
*/

drop table if exists comorbidity CASCADE;

create table if not exists comorbidity (
    c_id VARCHAR(255) PRIMARY KEY,
    c_description VARCHAR(255) NOT NULL
);

/*
    TABLE: SYMPTOM
*/

drop table if exists symptom CASCADE;

create table if not exists symptom (
    s_id VARCHAR(255) PRIMARY KEY,
    s_description VARCHAR(255) NOT NULL
);

/*
    TABLE: BUILDING
*/

drop table if exists building CASCADE;

create table if not exists building (
    building_id VARCHAR(255) PRIMARY KEY
);

/*
    TABLE: FLOOR
*/

drop table if exists floor CASCADE;

create table if not exists floor (
    floor_id VARCHAR(255),
    building_id VARCHAR(255) NOT NULL REFERENCES building(building_id),
    primary key (building_id, floor_id)
);

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

/*
///////////////////////////////////////////////////////
//////////////////// RELATIONSHIPS ////////////////////
///////////////////////////////////////////////////////
*/

/*
	RELATIONSHIP: MANAGES
*/

drop table if exists manages CASCADE;

create table if not exists manages (
	e_id VARCHAR(255) NOT NULL PRIMARY KEY,
	manager_id VARCHAR(255) NOT NULL
);

CREATE OR REPLACE FUNCTION check_manager_assigned()
RETURNS TRIGGER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM employee WHERE e_type = 'Manager' AND e_id = NEW.manager_id) THEN
        RAISE EXCEPTION 'Invalid FK';
    END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER manages_assigned
BEFORE INSERT OR UPDATE ON manages
FOR EACH ROW
EXECUTE PROCEDURE check_manager_assigned();

ALTER TABLE manages ADD CONSTRAINT e_manager_constraint UNIQUE (e_id, manager_id);

/*
    RELATIONSHIP: HAS COMORBIDITY
*/

drop table if exists has_comorbidity CASCADE;

create table if not exists has_comorbidity (
    c_id VARCHAR(255) NOT NULL REFERENCES comorbidity(c_id),
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
	seriousness VARCHAR(255) NOT NULL,
    PRIMARY KEY (unique_number, patient_order, c_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

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

/*
    MULTIVALUED ATTRIBUTE: SYMPTOM PERIOD
*/

drop table if exists symptom_period CASCADE;

create table if not exists symptom_period (
    s_id VARCHAR(255) NOT NULL REFERENCES symptom(s_id),
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,

	seriousness VARCHAR(255) NOT NULL,

    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    FOREIGN KEY (unique_number, patient_order, s_id) REFERENCES has_symptom(unique_number, patient_order, s_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order),
	PRIMARY KEY (unique_number, patient_order, s_id, start_date, end_date)
);

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

-- Ensure that e_id of volunteer_takes_care points to a volunteer
CREATE OR REPLACE FUNCTION check_volunteer_takes_care()
RETURNS TRIGGER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM employee WHERE e_type = 'Volunteer' AND e_id = NEW.e_id) THEN
        RAISE EXCEPTION 'Invalid FK';
    END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER volunteer_takes_care
BEFORE INSERT OR UPDATE ON volunteer_takes_care
FOR EACH ROW
EXECUTE PROCEDURE check_volunteer_takes_care();

/*
    RELATIONSHIP: DISCHARGES
*/

drop table if exists discharges CASCADE;

create table if not exists discharges (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    e_id VARCHAR(255) REFERENCES employee(e_id),
	test_order INT NOT NULL,
    discharge_time TIMESTAMP NOT NULL,

    PRIMARY KEY(unique_number, patient_order),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order),
    FOREIGN KEY (unique_number, patient_order, test_order) REFERENCES test_info(unique_number, patient_order, test_order)
);

-- Ensure that a person is only discharged by a doctor
CREATE OR REPLACE FUNCTION check_discharge()
RETURNS TRIGGER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM employee WHERE e_type = 'Doctor' AND (NEW.e_id IS NULL OR e_id=NEW.e_id)) THEN
        RAISE EXCEPTION 'Invalid FK';
    END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER discharge
BEFORE INSERT OR UPDATE ON discharges
FOR EACH ROW
EXECUTE PROCEDURE check_discharge();

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
CREATE OR REPLACE FUNCTION check_treats()
RETURNS TRIGGER
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM employee WHERE e_type = 'Doctor' AND e_id = NEW.e_id) THEN
        RAISE EXCEPTION 'Invalid FK';
    END IF;
	RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER treats
BEFORE INSERT OR UPDATE ON treats
FOR EACH ROW
EXECUTE PROCEDURE check_treats();

/*
	TABLE: MEDICATION IN TREATMENT
*/

DROP TABLE IF EXISTS medication_in_treatment CASCADE;

CREATE TABLE IF NOT EXISTS medication_in_treatment (
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    e_id VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    medication_id VARCHAR(255) NOT NULL REFERENCES medication(medication_id),

    FOREIGN KEY (unique_number, patient_order, e_id, start_time, end_time) REFERENCES treats(unique_number, patient_order, e_id, start_time, end_time)
);