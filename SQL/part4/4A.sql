-- STEP 0: DATA TO BE INSERTED FIRST --
--  WARNING: THIS TOOK ~20 MIN TO BE INSERTED ON ORACLE DB --

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
   FOR i IN 1..10000000 LOOP
      v_medication_id := 'MED_' || TO_CHAR(i);
      v_medication_name := 'Medication_' || TO_CHAR(i);
      v_price := ROUND(DBMS_RANDOM.VALUE * 100, 2);  -- Adjust as needed
      v_exp_date := TRUNC(SYSDATE) + ROUND(DBMS_RANDOM.VALUE * 365);  -- Adjust as needed

      INSERT INTO medication (medication_id, medication_name, price, exp_date)
      VALUES (v_medication_id, v_medication_name, v_price, v_exp_date);

      COMMIT; -- Commit after each iteration to avoid performance issues
   END LOOP;
END;

-- STEP 1: BEFORE --

EXPLAIN PLAN FOR
SELECT medication_id, MAX(price) AS max_price
FROM medication
GROUP BY medication_id;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- STEP 2: AFTER JUST PRICE

CREATE INDEX idx_price ON medication(price);

EXPLAIN PLAN FOR
SELECT medication_id, MAX(price) AS max_price
FROM medication
GROUP BY medication_id;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- STEP 3: AFTER PRICE AND ID

DROP INDEX idx_price;

CREATE INDEX idx_price_id ON medication(medication_id, price);

EXPLAIN PLAN FOR
SELECT medication_id, MAX(price) AS max_price
FROM medication
GROUP BY medication_id;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
