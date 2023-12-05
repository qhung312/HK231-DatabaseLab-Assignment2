DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS patient_instance CASCADE;
DROP TABLE IF EXISTS test_info CASCADE;
DROP TABLE IF EXISTS comorbidity CASCADE;
DROP TABLE IF EXISTS symptom CASCADE;
DROP TABLE IF EXISTS building CASCADE;
DROP TABLE IF EXISTS floor CASCADE;
DROP TABLE IF EXISTS room CASCADE;
DROP TABLE IF EXISTS medication CASCADE;
DROP TABLE IF EXISTS medication_effect CASCADE;
DROP TABLE IF EXISTS manages CASCADE;
DROP TABLE IF EXISTS has_comorbidity CASCADE;
DROP TABLE IF EXISTS has_symptom CASCADE;
DROP TABLE IF EXISTS symptom_period CASCADE;
DROP TABLE IF EXISTS moves CASCADE;
DROP TABLE IF EXISTS admits CASCADE;
DROP TABLE IF EXISTS volunteer_takes_care CASCADE;
DROP TABLE IF EXISTS discharges CASCADE;
DROP TABLE IF EXISTS treats CASCADE;
DROP TABLE IF EXISTS medication_in_treatment CASCADE;
DROP TABLE IF EXISTS session;

CREATE TABLE patient (
    unique_number VARCHAR(10) PRIMARY KEY CHECK (unique_number ~ '^[0-9]+$'),
    identity_number VARCHAR(12) UNIQUE NOT NULL CHECK (identity_number ~ '^[0-9]+$'),
    full_name VARCHAR(30) NOT NULL CHECK (full_name ~ '^[a-zA-Z ]+$'),
    gender VARCHAR(6), -- Only male or female
    addr VARCHAR(255) NOT NULL,
    phone CHARACTER(10) NOT NULL CHECK (phone ~ '^[0-9]{10}$')
);
ALTER TABLE patient ADD CONSTRAINT gender_constraint CHECK (gender IN ('Male', 'Female')); -- enforce that gender should be “Male” or “Female”
CREATE TABLE employee (
    e_id VARCHAR(10) PRIMARY KEY,
    e_name VARCHAR(30) NOT NULL CHECK (e_name ~ '^[a-zA-Z ]+$'),
    e_type VARCHAR(9),
    is_head BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE employee ADD CONSTRAINT e_type_constraint CHECK (e_type IN ('Doctor', 'Nurse', 'Staff', 'Volunteer', 'Manager'));

-- Only allow at most one doctor to be head
CREATE UNIQUE INDEX one_head_doctor ON employee (is_head) WHERE e_type = 'Doctor' AND is_head=TRUE;
CREATE TABLE patient_instance (
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
CREATE TABLE test_info (
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    test_order INT NOT NULL,
    test_timestamp TIMESTAMP NOT NULL,
    test_type VARCHAR(21),
    spo2_rate real DEFAULT NULL,
    result BOOLEAN DEFAULT NULL,
    ct_threshold INT DEFAULT NULL,
    respiratory_bpm INT DEFAULT NULL,
    PRIMARY KEY (unique_number, patient_order, test_order),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);

-- Attributes according to test type
ALTER TABLE test_info ADD CONSTRAINT test_type_constraint CHECK (test_type IN ('SPO2 Test', 'Quick Test', 'PCR Test', 'Respiratory Rate Test'));
ALTER TABLE test_info ADD CONSTRAINT spo2_constraint CHECK (test_type != 'SPO2 Test' OR NOT(spo2_rate > 1 OR spo2_rate < 0));
ALTER TABLE test_info ADD CONSTRAINT result_constraint CHECK (NOT(test_type = 'Quick Test' OR test_type = 'PCR Test') OR result = FALSE OR result = TRUE);
ALTER TABLE test_info ADD CONSTRAINT ct_threshold_constraint CHECK (NOT(test_type = 'Quick Test' OR test_type = 'PCR Test') OR result = FALSE OR ct_threshold>=0);
ALTER TABLE test_info ADD CONSTRAINT respiratory_bpm_constraint CHECK (test_type != 'Respiratory Rate Test' OR respiratory_bpm>=0);
CREATE TABLE comorbidity (
    c_id VARCHAR(10) PRIMARY KEY,
    c_description VARCHAR(255) NOT NULL
);
CREATE TABLE symptom (
    s_id VARCHAR(10) PRIMARY KEY,
    s_description VARCHAR(255) NOT NULL
);
CREATE TABLE building (
    building_id VARCHAR(5) PRIMARY KEY
);
CREATE TABLE floor (
    building_id VARCHAR(5) NOT NULL REFERENCES building(building_id),
    floor_id VARCHAR(5),
    primary key (building_id, floor_id)
);
CREATE TABLE room (
    building_id VARCHAR(5) NOT NULL,
    floor_id VARCHAR(5) NOT NULL,
    room_id VARCHAR(5) NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(12),
    primary key (building_id, floor_id, room_id),
    foreign key (building_id, floor_id) references floor(building_id, floor_id)
);
ALTER TABLE room ADD CONSTRAINT room_type_constraint CHECK (room_type IN ('Normal', 'Emergency', 'Recuperation'));
CREATE TABLE medication (
    medication_id VARCHAR(10) PRIMARY KEY,
    medication_name VARCHAR(30) NOT NULL,
    price MONEY NOT NULL,
    exp_date DATE NOT NULL
);
CREATE TABLE medication_effect (
    medication_id VARCHAR(10) NOT NULL REFERENCES medication(medication_id),
    medication_effect_id VARCHAR(5),
    effect VARCHAR(255) NOT NULL,
    PRIMARY KEY (medication_id, medication_effect_id)
);
CREATE TABLE manages (
	e_id VARCHAR(10) NOT NULL PRIMARY KEY REFERENCES employee(e_id),
	manager_id VARCHAR(10) NOT NULL REFERENCES employee(e_id)
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
CREATE TABLE has_comorbidity (
    c_id VARCHAR(10) NOT NULL REFERENCES comorbidity(c_id),
    unique_number VARCHAR(10) NOT NULL REFERENCES patient(unique_number),
    seriousness VARCHAR(255) NOT NULL,
    PRIMARY KEY (unique_number, c_id)
);
CREATE TABLE has_symptom (
    s_id VARCHAR(10) NOT NULL REFERENCES symptom(s_id),
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    PRIMARY KEY (unique_number, patient_order, s_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);
CREATE TABLE symptom_period (
    s_id VARCHAR(255) NOT NULL REFERENCES symptom(s_id),
    unique_number VARCHAR(255) NOT NULL,
    patient_order INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    seriousness VARCHAR(255) NOT NULL,
    PRIMARY KEY (unique_number, patient_order, s_id, start_date, end_date),
	FOREIGN KEY (unique_number, patient_order, s_id) REFERENCES has_symptom(unique_number, patient_order, s_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);
CREATE TABLE moves (
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
CREATE TABLE admits (
    e_id VARCHAR(10) NOT NULL REFERENCES employee(e_id),
    building_id VARCHAR(5) NOT NULL,
    floor_id VARCHAR(5) NOT NULL,
    room_id VARCHAR(5) NOT NULL,
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,

    PRIMARY KEY (unique_number, patient_order),
    FOREIGN KEY (building_id, floor_id, room_id) REFERENCES room(building_id, floor_id, room_id),
    FOREIGN KEY (unique_number, patient_order) REFERENCES patient_instance(unique_number, patient_order)
);
CREATE TABLE volunteer_takes_care (
    e_id VARCHAR(10) NOT NULL REFERENCES employee(e_id),
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    PRIMARY KEY (e_id, unique_number, patient_order),
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
CREATE TABLE discharges (
    e_id VARCHAR(10) REFERENCES employee(e_id),
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
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
CREATE TABLE treats (
    e_id VARCHAR(10) NOT NULL REFERENCES employee(e_id),
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
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
CREATE TABLE medication_in_treatment (
    e_id VARCHAR(10) NOT NULL,
    unique_number VARCHAR(10) NOT NULL,
    patient_order INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    medication_id VARCHAR(10) NOT NULL REFERENCES medication(medication_id),
    PRIMARY KEY (unique_number, patient_order, e_id, start_time, end_time, medication_id),
    FOREIGN KEY (unique_number, patient_order, e_id, start_time, end_time) REFERENCES treats(unique_number, patient_order, e_id, start_time, end_time)
);
