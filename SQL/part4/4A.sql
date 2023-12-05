DROP TABLE IF EXISTS medication CASCADE;
CREATE TABLE medication (
    medication_id VARCHAR(255) PRIMARY KEY,
    medication_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    exp_date DATE NOT NULL
);

DECLARE
   v_medication_id VARCHAR2(255);
   v_medication_name VARCHAR2(255);
   v_price INT;
   v_exp_date DATE;

BEGIN
   FOR i IN 1..15000000 LOOP
      v_medication_id := 'MED_' || TO_CHAR(i);
      v_medication_name := 'Medication_' || TO_CHAR(i);
      v_price := ROUND(DBMS_RANDOM.VALUE * 100, 2);
      v_exp_date := TRUNC(SYSDATE) + ROUND(DBMS_RANDOM.VALUE * 365);
      INSERT INTO medication (medication_id, medication_name, price, exp_date)
      VALUES (v_medication_id, v_medication_name, v_price, v_exp_date);
      COMMIT; -- Commit after each iteration to avoid performance issues
   END LOOP;
END;

SELECT MAX(price) AS max_price
FROM medication;

EXPLAIN PLAN FOR
SELECT MAX(price) AS max_price
FROM medication;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

CREATE INDEX idx_price ON medication(price);

SELECT MAX(price) AS max_price
FROM medication;

EXPLAIN PLAN FOR
SELECT MAX(price) AS max_price
FROM medication;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);