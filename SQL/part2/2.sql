CREATE OR REPLACE FUNCTION update_pcr_test()
RETURNS void AS $$
BEGIN
    UPDATE test_info
    SET result=TRUE, ct_threshold=NULL
    WHERE test_type='PCR Test' AND test_timestamp > '9/1/2020';
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION get_patient_information_by_name()
RETURNS SETOF patient AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM patient
    WHERE full_name = 'Nguyen Van A';
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION calculate_testing(arg_unique_number VARCHAR(10), arg_patient_order INT)
RETURNS void AS $$
DECLARE
    _unique_number VARCHAR(10);
    _patient_order INT;
    _test_order INT;
    _result BOOLEAN;
    _ct_threshold INT;

    _spo2_rate REAL;
    _respiratory_bpm INT;
BEGIN
    SELECT spo2_rate
    INTO _spo2_rate
    FROM test_info
    WHERE ((test_info.unique_number, test_info.patient_order)=(arg_unique_number, arg_patient_order))
        AND test_info.test_type='SPO2 Test'
    ORDER BY test_timestamp DESC
    LIMIT 1;

    SELECT respiratory_bpm
    INTO _respiratory_bpm
    FROM test_info
    WHERE ((test_info.unique_number, test_info.patient_order)=(arg_unique_number, arg_patient_order))
        AND test_info.test_type='Respiratory Rate Test'
    ORDER BY test_timestamp DESC
    LIMIT 1;

    IF _spo2_rate IS NOT NULL AND _spo2_rate < 96 AND _respiratory_bpm IS NOT NULL AND _respiratory_bpm > 20 THEN
        UPDATE patient_instance
        SET is_warning=TRUE
        WHERE (patient_instance.unique_number, patient_instance.patient_order)=(arg_unique_number, arg_patient_order);
    ELSE
        /*
        test is either negative or positive whose cycle threshold
        is larger than 30, he or she will be discharged from the camp.
        */
        SELECT unique_number, patient_order, test_order, result, ct_threshold
        INTO _unique_number, _patient_order, _test_order, _result, _ct_threshold
        FROM test_info
        WHERE (test_info.unique_number, test_info.patient_order)=(arg_unique_number, arg_patient_order)
            AND (test_type='PCR Test' OR test_type='Quick Test')
        ORDER BY test_timestamp DESC
        LIMIT 1;

        IF _unique_number IS NOT NULL AND (_result=FALSE OR _ct_threshold > 30) THEN
            IF EXISTS (
                SELECT *
                FROM discharges
                WHERE (discharges.unique_number, discharges.patient_order)=(arg_unique_number, arg_patient_order)
            ) THEN
                RAISE EXCEPTION 'This patient is already discharged';
            ELSE
                INSERT INTO discharges(unique_number, patient_order, e_id, test_order, discharge_time)
                VALUES (_unique_number, _patient_order, NULL, _test_order, NOW());
            END IF;
        END IF;
    END IF;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION sort_nurses_by_patient_count(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS TABLE(nurse_id VARCHAR(10), nurse_name VARCHAR(255), takes_care_of BIGINT) AS $$
BEGIN
    RETURN QUERY
	SELECT
		employee.e_id AS nurse_id,
		employee.e_name AS nurse_name,
		COUNT(patient_instance.nurse_assigned) AS takes_care_of
	FROM employee
	LEFT JOIN patient_instance ON employee.e_id=patient_instance.nurse_assigned
	WHERE start_date <= patient_instance.admission_time AND admission_time <= end_date AND
		employee.e_type='Nurse'
	GROUP BY employee.e_id, employee.e_name
	ORDER BY COUNT(patient_instance.nurse_assigned) DESC;
END;
$$ LANGUAGE PLPGSQL;
