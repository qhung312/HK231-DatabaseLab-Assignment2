INSERT INTO employee (e_id, e_name, e_type, is_head)
VALUES ('1', 'Nguyen Thanh P', 'Doctor', TRUE),
('2', 'Huynh Thi L', 'Doctor', FALSE),
('3', 'Van Hoang Q', 'Nurse', FALSE),
('4', 'Ong Thuy T', 'Nurse', FALSE),
('5', 'Le Thi P', 'Staff', FALSE),
('6', 'Hoang Thien D', 'Volunteer', FALSE),
('7', 'Dang Hoang L', 'Manager', FALSE);
INSERT INTO manages (e_id, manager_id)
VALUES ('3', '7'),
('4', '7'),
('5', '7'),
('6', '7');
INSERT INTO building (building_id)
VALUES ('A1'),
('A2'),
('B3'),
('B4');
INSERT INTO floor (floor_id, building_id)
VALUES ('1', 'A1'),
('2', 'A1'),
('1', 'A2'),
('2', 'A2'),
('1', 'B3'),
('2', 'B3'),
('1', 'B4'),
('2', 'B4');
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', 'A1', 10, 'Normal'),
('2', '1', 'A1', 5, 'Normal'),
('1', '2', 'A1', 7, 'Normal'),
('2', '2', 'A1', 3, 'Normal');
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', 'A2', 4, 'Recuperation'),
('2', '1', 'A2', 4, 'Normal'),
('1', '2', 'A2', 5, 'Normal'),
('2', '2', 'A2', 7, 'Normal');
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', 'B3', 5, 'Emergency'),
('2', '1', 'B3', 7, 'Emergency'),
('1', '2', 'B3', 6, 'Recuperation'),
('2', '2', 'B3', 4, 'Emergency');
INSERT INTO room (room_id, floor_id, building_id, capacity, room_type)
VALUES ('1', '1', 'B4', 10, 'Normal'),
('2', '1', 'B4', 4, 'Recuperation'),
('1', '2', 'B4', 5, 'Emergency'),
('2', '2', 'B4', 10, 'Normal');
INSERT INTO comorbidity (c_id, c_description)
VALUES ('1', 'Cancer'),
('2', 'Chornic Lung Disease'),
('3', 'Diabetes'),
('4', 'Heart Condition');
INSERT INTO symptom (s_id, s_description)
VALUES ('1', 'Fever'),
('2', 'Dry Cough'),
('3', 'Tiredness'),
('4', 'Aches and pains'),
('5', 'Sore throat'),
('6', 'Diarrhea'),
('7', 'Headache'),
('8', 'Discoloration of fingers or toes'),
('9', 'Loss of taste or smell'),
('10', 'Skin rashes');
INSERT INTO medication (medication_id, medication_name, exp_date, price)
VALUES ('1', 'Paracetamol', '12/13/2023', 100),
('2', 'Remdesivir', '12/15/2023', 200),
('3', 'Lopinavir/Ritonavir', '12/20/2023', 150),
('4', 'Ibuprofen', '12/25/2023', 100),
('5', 'Antibiotics', '12/30/2023', 100);
INSERT INTO medication_effect (medication_id, medication_effect_id, effect)
VALUES ('1', '1', 'Reduces headache'),
('1', '2', 'May result in lost of taste'),
('2', '1', 'Cures lost of taste'),
('3', '1', 'May results in vomiting'),
('4', '1', 'Helps with fever'),
('5', '1', 'Cures discoloration of fingers and toes');
INSERT INTO patient (unique_number, identity_number, full_name, gender, addr, phone)
VALUES ('1', '2153414', 'Vo Van D', 'Male', 'Ho Chi Minh City', '0111222333'),
('2', '123456', 'Nguyen Phan L', 'Male', 'Hanoi', '0001112227'),
('3', '135789', 'Hoang Van B', 'Male', 'Hanoi', '0913445361'),
('4', '1245611', 'Tang Hoang M', 'Male', 'Hue', '0871123456'),
('5', '123457890', 'Ngo Van N', 'Male', 'Da Nang', '0918465738');
INSERT INTO has_comorbidity (c_id, unique_number, seriousness)
VALUES ('1', '1', 'Not very serious'),
('1', '2', 'Very serious'),
('2', '3', 'Not very serious'),
('3', '3', 'Not very serious');
INSERT INTO patient_instance (unique_number, patient_order, location_before_admission, admission_time, nurse_assigned)
VALUES ('1', '1', 'District 3, HCM', '7/11/2023', '3'),
('1', '2', 'District 3, HCM', '11/25/2023', '3'),
('2', '1', 'District 4, HCM', '7/12/2023', '4'),
('3', '1', 'District 2, HCM', '7/15/2023', '4'),
('4', '1', 'District 10, HCM', '7/11/2023', '3'),
('5', '1', 'Go Vap, HCM', '7/11/2023', '3');
INSERT INTO has_symptom (s_id, unique_number, patient_order)
VALUES ('1', '1', '1'),
('2', '1', '1'),
('3', '2', '1'),
('4', '3', '1'),
('5', '4', '1');
INSERT INTO symptom_period(s_id, unique_number, patient_order, start_date, end_date, seriousness)
VALUES ('1', '1', '1', '7/11/2023', '7/25/2023', 'Serious'),
('2', '1', '1', '7/14/2023', '7/21/2023', 'Harmless'),
('3', '2', '1', '7/15/2023', '7/25/2023', 'Harmless'),
('4', '3', '1', '7/15/2023', '7/16/2023', 'Harmless'),
('5', '4', '1', '7/11/2023', '7/27/2023', 'Very Serious');
INSERT INTO volunteer_takes_care (e_id, unique_number, patient_order)
VALUES ('6', '1', '1'),
('6', '2', '1'),
('6', '3', '1'),
('6', '5', '1');
INSERT INTO admits (unique_number, patient_order, building_id, floor_id, room_id, e_id)
VALUES ('1', '1', 'B3', '1', '2', '5'),
('1', '2', 'B4', '2', '1', '5'),
('2', '1', 'B3', '1', '2', '5'),
('3', '1', 'B3', '2', '2', '5'),
('4', '1', 'B3', '1', '2', '5'),
('5', '1', 'B3', '2', '2', '5');
INSERT INTO treats (unique_number, patient_order, e_id, result, start_time, end_time)
VALUES ('1', '1', '1', 'Good', '7/21/2023', '7/25/2023'),
('1', '2', '1', 'Good', '11/25/2023', '11/30/2023'),
('2', '1', '2', 'Bad', '7/20/2023', '7/21/2023'),
('3', '1', '1', 'Good', '7/15/2023', '7/18/2023'),
('4', '1', '1', 'Good', '7/20/2023', '7/21/2023');
INSERT INTO medication_in_treatment (unique_number, patient_order, e_id, start_time, end_time, medication_id)
VALUES ('1', '1', '1', '7/21/2023', '7/25/2023', '4'),
('1', '2', '1', '11/25/2023', '11/30/2023', '3'),
('2', '1', '2', '7/20/2023', '7/21/2023', '1'),
('3', '1', '1', '7/15/2023', '7/18/2023', '1'),
('4', '1', '1', '7/20/2023', '7/21/2023', '3');
INSERT INTO moves (e_id, building_id, floor_id, room_id, unique_number, patient_order, move_time, reason)
VALUES ('1', 'A2', '2', '2', '1', '1', '7/25/2023', 'Patient health has improved'),
('1', 'B4', '1', '1', '1', '2', '11/30/2023', 'Patient health has improved'),
('1', 'A2', '1', '1', '2', '1', '7/22/2023', 'Patient health has improved'),
('1', 'B4', '2', '2', '3', '1', '7/25/2023', 'Patient health has improved'),
('1', 'A2', '2', '1', '4', '1', '7/18/2023', 'Patient health has improved'),
('1', 'A1', '1', '1', '5', '1', '7/21/2023', 'Patient health has improved');
INSERT INTO test_info (unique_number, patient_order, test_order, test_timestamp, test_type, spo2_rate, result, ct_threshold, respiratory_bpm)
VALUES ('1', '1', '1', '7/28/2023', 'Quick Test', NULL, TRUE, '40', NULL),
('1', '2', '1', '12/1/2023', 'Quick Test', NULL, FALSE, NULL, NULL),
('2', '1', '1', '7/25/2023', 'Quick Test', NULL, TRUE, '50', NULL),
('3', '1', '1', '7/23/2023', 'Quick Test', NULL, TRUE, '50', NULL),
('4', '1', '1', '7/24/2023', 'Quick Test', NULL, TRUE, '40', NULL),
('5', '1', '1', '7/25/2023', 'Quick Test', NULL, FALSE, NULL, NULL);
INSERT INTO discharges (unique_number, patient_order, e_id, test_order, discharge_time)
VALUES ('1', '1', '2', '1', '7/28/2023'),
('2', '1', '2', '1', '7/25/2023'),
('3', '1', '1', '1', '7/23/2023'),
('4', '1', '2', '1', '7/24/2023'),
('5', '1', '1', '1', '7/25/2023');
