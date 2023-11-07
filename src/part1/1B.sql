-- Insert for patient
INSERT INTO patient (unique_number, identity_number, full_name, gender, addr, phone)
VALUES ('1', '2153414', 'Truong Quoc Hung', 'Male', 'Ho Chi Minh City', '0111222333'),
('2', '123456', 'Nguyen Huu Hao', 'Male', 'Hanoi', '0001112227'),
('3', '135789', 'Nguyen Huu Hao', 'Male', 'Hanoi', '0913445361'),
('4', '1245611', 'Tuan Dat', 'Male', 'Hue', '0871123456'),
('5', '123457890', 'Ngoc Khai', 'Male', 'Da Nang', '0918465738');

-- insert employee
INSERT INTO employee (e_id, e_type, is_head)
VALUES ('1', 'Doctor', TRUE),
('2', 'Doctor', FALSE),
('3', 'Nurse', FALSE),
('4', 'Nurse', FALSE),
('5', 'Staff', FALSE),
('6', 'Volunteer', FALSE),
('7', 'Manager', FALSE);

-- patient_instance
INSERT INTO patient_instance (unique_number, patient_order, location_before_admission, admission_time, nurse_assigned)
VALUES ('1', '1', 'District 3, HCM', '7/11/2023', '3'),
('1', '2', 'District 3, HCM', '7/12/2023', '3'),
('2', '1', 'District 4, HCM', '7/12/2023', '4'),
('3', '1', 'District 2, HCM', '7/15/2023', '4'),
('4', '1', 'District 10, HCM', '7/11/2023', '3'),
('5', '1', 'Go Vap, HCM', '7/11/2023', '3');

-- insert into building
INSERT INTO building (building_id)
VALUES ('1'),
('2'),
('3'),
('4');


-- insert to floor
INSERT INTO floor (floor_id, building_id)
VALUES ('1', '1'),
('2', '1'),
('1', '2'),
('2', '2'),
('1', '3'),
('2', '3'),
('1', '4'),
('2', '4');
-- insert to room
-- first building
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', '1', 100, 'Normal'),
('2', '1', '1', 50, 'Normal'),
('1', '2', '1', 75, 'Normal'),
('2', '2', '1', 100, 'Normal');

-- second building
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', '2', 20, 'Recuperation'),
('2', '1', '2', 100, 'Normal'),
('1', '2', '2', 20, 'Normal'),
('2', '2', '2', 50, 'Normal');

-- third building
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', '3', 50, 'Emergency'),
('2', '1', '3', 50, 'Emergency'),
('1', '2', '3', 50, 'Recuperation'),
('2', '2', '3', 5, 'Emergency');

-- fourth building
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', '4', 10, 'Normal'),
('2', '1', '4', 20, 'Recuperation'),
('1', '2', '4', 5, 'Emergency'),
('2', '2', '4', 10, 'Normal');

-- cormobidity
INSERT INTO cormobidity (c_id, c_description, seriousness)
VALUES ('1', 'Cancer', 'Very Serious'),
('2', 'Chornic Lung Disease', 'Very Serious'),
('3', 'Diabetes', 'Possibly Very Dangerous'),
('4', 'Heart Condition', 'Possibly Very Dangerous');

-- symptom
INSERT INTO symptom (s_id, s_description, seriousness)
VALUES ('1', 'Fever', 'Not very serious'),
('2', 'Dry Cough', 'Not very serious'),
('3', 'Tiredness', 'Not very serious'),
('4', 'Aches and pains', 'Not very serious'),
('5', 'Sore throat', 'Not very serious'),
('6', 'Diarrhea', 'Possibly serious'),
('7', 'Headache', 'Not very serious'),
('8', 'Discoloration of fingers or toes', 'Very serious'),
('9', 'Loss of taste or smell', 'Very serious'),
('10', 'Skin rashes', 'Not very serious');

-- has_comorbidity
INSERT INTO has_cormobidity (c_id, unique_number, patient_order)
VALUES ('1', '1', '1'),
('1', '2', '1'),
('2', '3', '1'),
('3', '3', '1');

-- has_symptom
INSERT INTO has_symptom (s_id, unique_number, patient_order)
VALUES ('1', '1', '1'),
('2', '1', '1'),
('3', '2', '1'),
('4', '3', '1'),
('5', '4', '1');

-- medication
INSERT INTO medication (medication_id, medication_name, exp_date, price)
VALUES ('1', 'Medication 1', '12/3/2023', 100),
('2', 'Medication 2', '12/15/2023', 200),
('3', 'Medication 3', '12/20/2023', 150),
('4', 'Medication 4', '12/25/2023', 100),
('5', 'Medication 5', '12/30/2023', 100);

-- medication_effect
INSERT INTO medication_effect (medication_id, medication_effect_id, effect)
VALUES ('1', '1', 'Reduces headache'),
('1', '2', 'May result in lost of taste'),
('2', '1', 'Cures lost of taste'),
('3', '1', 'May result in vomitting'),
('4', '1', 'Help with fever'),
('5', '1', 'Cure discoloration of fingers and toes');

INSERT INTO treats (unique_number, patient_order, e_id, result, start_time, end_time)
VALUES ('1', '1', '1', 'Good', '11/15/2023', '11/20/2023'),
('1', '2', '1', 'Good', '11/25/2023', '11/30/2023'),
('2', '1', '2', 'Bad', '11/10/2023', '11/15/2023'),
('3', '1', '1', 'Good', '11/15/2023', '11/20/2023'),
('4', '1', '1', 'Good', '11/15/2023', '11/20/2023'),
('5', '1', '2', 'Good', '11/15/2023', '11/20/2023');
