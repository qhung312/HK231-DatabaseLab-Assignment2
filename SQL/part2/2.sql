CREATE OR REPLACE FUNCTION update_pcr_test()
RETURNS void AS $$
BEGIN
	UPDATE test_info
	SET pcr_test=TRUE, pcr_test_ct=NULL
	WHERE test_timestamp > '9/1/2020';
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

CREATE OR REPLACE FUNCTION sort_nurses_by_patient_count(start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS TABLE(nurse_id VARCHAR(255), takes_care_of BIGINT) AS $$
BEGIN
	RETURN QUERY
	SELECT nurse_assigned AS nurse_id, COUNT(*) AS takes_care_of FROM patient_instance
	WHERE start_date <= admission_time AND admission_time <= end_date
	GROUP BY nurse_assigned
	ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE PLPGSQL;
