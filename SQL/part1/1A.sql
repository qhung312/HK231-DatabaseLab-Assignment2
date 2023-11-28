-- Part 1: Physical Database Design
-- A - Implementing the Database (2 marks)
-- You have to implement your database, based on your assigned topic, into the physical
-- database.
-- Giving the full explanation of your choices of data types, data length, and
-- constraints in your database.

/*
    TABLE: PATIENT
*/

DROP TABLE IF EXISTS patient CASCADE;

CREATE TABLE IF NOT EXISTS patient (
    unique_number VARCHAR(10) PRIMARY KEY CHECK (unique_number ~ '^[0-9]+$'),
    identity_number VARCHAR(12) UNIQUE NOT NULL CHECK (identity_number ~ '^[0-9]+$'),
    full_name VARCHAR(30) NOT NULL CHECK (full_name ~ '^[a-zA-Z ]+$'),
    gender VARCHAR(6), -- Only male or female
    addr VARCHAR(255) NOT NULL,
    phone CHARACTER(10) NOT NULL CHECK (phone ~ '^[0-9]{10}$')
);

ALTER TABLE patient owner to postgres;

-- Restrict gender column to male and female
ALTER TABLE patient ADD CONSTRAINT gender_constraint CHECK (gender IN ('Male', 'Female'));

/*
    TABLE: EMPLOYEE
*/

DROP TABLE IF EXISTS employee CASCADE;

CREATE TABLE IF NOT EXISTS employee (
    e_id VARCHAR(10) PRIMARY KEY,
	e_name VARCHAR(30) NOT NULL CHECK (e_name ~ '^[a-zA-Z ]+$'),
    e_type VARCHAR(9) NOT NULL,
    is_head BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE employee ADD CONSTRAINT e_type_constraint CHECK (e_type IN ('Doctor', 'Nurse', 'Staff', 'Volunteer', 'Manager'));

-- Only allow at most one doctor to be head
CREATE UNIQUE INDEX one_head_doctor ON employee (is_head) WHERE e_type = 'Doctor' AND is_head=TRUE;

/*
    TABLE: PATIENT INSTANCE
*/

DROP TABLE IF EXISTS patient_instance CASCADE;

CREATE TABLE IF NOT EXISTS patient_instance (
    unique_number VARCHAR(10) NOT NULL REFERENCES patient(unique_number),
    location_before_admission VARCHAR(255) NOT NULL,
    admission_time TIMESTAMP NOT NULL,
    nurse_assigned VARCHAR(9) NOT NULL REFERENCES employee(e_id),
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

DROP TABLE IF EXISTS test_info CASCADE;

CREATE TABLE IF NOT EXISTS test_info (
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP NOT NULL,
    test_type VARCHAR(21) NOT NULL,
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

DROP TABLE IF EXISTS comorbidity CASCADE;

CREATE TABLE IF NOT EXISTS comorbidity (
    c_id VARCHAR(10) PRIMARY KEY,
    c_description VARCHAR(255) NOT NULL
);

/*
    TABLE: SYMPTOM
*/

DROP TABLE IF EXISTS symptom CASCADE;

CREATE TABLE IF NOT EXISTS symptom (
    s_id VARCHAR(10) PRIMARY KEY,
    s_description VARCHAR(255) NOT NULL
);

/*
    TABLE: BUILDING
*/

DROP TABLE IF EXISTS building CASCADE;

CREATE TABLE IF NOT EXISTS building (
    building_id VARCHAR(5) PRIMARY KEY
);

/*
    TABLE: FLOOR
*/

DROP TABLE IF EXISTS floor CASCADE;

CREATE TABLE IF NOT EXISTS floor (
    floor_id VARCHAR(5),
    building_id VARCHAR(5) NOT NULL REFERENCES building(building_id),
    primary key (building_id, floor_id)
);

/*
    TABLE: ROOM
*/

DROP TABLE IF EXISTS room CASCADE;

CREATE TABLE IF NOT EXISTS room (
    building_id VARCHAR(5) NOT NULL,
    floor_id VARCHAR(5) NOT NULL,
    room_id VARCHAR(5) NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(12) NOT NULL,
    primary key (building_id, floor_id, room_id),
    foreign key (building_id, floor_id) references floor(building_id, floor_id)
);

ALTER TABLE room owner to postgres;

ALTER TABLE room ADD CONSTRAINT room_type_constraint CHECK (room_type IN ('Normal', 'Emergency', 'Recuperation'));

/*
    TABLE: MEDICATION
*/

DROP TABLE IF EXISTS medication CASCADE;

CREATE TABLE IF NOT EXISTS medication (
    medication_id VARCHAR(10) PRIMARY KEY,
    medication_name VARCHAR(30) NOT NULL,
    price MONEY NOT NULL,
    exp_date DATE NOT NULL
);

/*
    MULTIVALUED ATTRIBUTE: MEDICATION EFFECT
*/

DROP TABLE IF EXISTS medication_effect CASCADE;

CREATE TABLE IF NOT EXISTS medication_effect (
    medication_id VARCHAR(10) NOT NULL REFERENCES medication(medication_id),
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

DROP TABLE IF EXISTS manages CASCADE;

CREATE TABLE IF NOT EXISTS manages (
	e_id VARCHAR(10) NOT NULL PRIMARY KEY,
	manager_id VARCHAR(10) NOT NULL
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

DROP TABLE IF EXISTS has_comorbidity CASCADE;

CREATE TABLE IF NOT EXISTS has_comorbidity (
    c_id VARCHAR(10) NOT NULL REFERENCES comorbidity(c_id),
    unique_number VARCHAR(10) NOT NULL REFERENCES patient(unique_number),
    seriousness VARCHAR(255) NOT NULL,
    PRIMARY KEY (unique_number, c_id)
);

/*
    RELATIONSHIP: HAS SYMPTOM
*/

DROP TABLE IF EXISTS has_symptom CASCADE;

CREATE TABLE IF NOT EXISTS has_symptom (
    s_id VARCHAR(10) NOT NULL REFERENCES symptom(s_id),
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
	seriousness VARCHAR(255) NOT NULL,
    PRIMARY KEY (unique_number, patient_order, s_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

/*
    RELATIONSHIP: MOVES
*/

DROP TABLE IF EXISTS moves CASCADE;

CREATE TABLE IF NOT EXISTS moves (
    e_id VARCHAR(10) NOT NULL REFERENCES employee(e_id),
    building_id VARCHAR(5) NOT NULL,
    floor_id VARCHAR(5) NOT NULL,
    room_id VARCHAR(5) NOT NULL,
    unique_number VARCHAR(10) NOT NULL,
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

DROP TABLE IF EXISTS admits CASCADE;

CREATE TABLE IF NOT EXISTS admits (
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    building_id VARCHAR(5) NOT NULL,
    floor_id VARCHAR(5) NOT NULL,
    room_id VARCHAR(5) NOT NULL,
    e_id VARCHAR(10) NOT NULL REFERENCES employee(e_id),

    PRIMARY KEY (unique_number, patient_order),

    FOREIGN KEY (building_id, floor_id, room_id) REFERENCES room(building_id, floor_id, room_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

/*
    RELATIONSHIP: VOLUNTEER TAKES CARE
*/

DROP TABLE IF EXISTS volunteer_takes_care CASCADE;

CREATE TABLE IF NOT EXISTS volunteer_takes_care (
    e_id VARCHAR(10) NOT NULL REFERENCES employee(e_id),
    unique_number VARCHAR(10) NOT NULL,
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

DROP TABLE IF EXISTS discharges CASCADE;

CREATE TABLE IF NOT EXISTS discharges (
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    e_id VARCHAR(10) REFERENCES employee(e_id),
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

DROP TABLE IF EXISTS treats CASCADE;

CREATE TABLE IF NOT EXISTS treats (
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,

    e_id VARCHAR(10) NOT NULL REFERENCES employee(e_id),
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
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    e_id VARCHAR(10) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    medication_id VARCHAR(10) NOT NULL REFERENCES medication(medication_id),

    FOREIGN KEY (unique_number, patient_order, e_id, start_time, end_time) REFERENCES treats(unique_number, patient_order, e_id, start_time, end_time)
);

DROP TABLE IF EXISTS account CASCADE;

CREATE TABLE IF NOT EXISTS account (
	username VARCHAR(255) PRIMARY KEY,
	passwd VARCHAR(255) NOT NULL,
	e_id VARCHAR(10) UNIQUE NOT NULL REFERENCES employee(e_id)
);

DROP TABLE IF EXISTS session;

CREATE TABLE IF NOT EXISTS session (
	sid VARCHAR(255) PRIMARY KEY,
	sess JSON NOT NULL,
	expire TIMESTAMP NOT NULL
);
