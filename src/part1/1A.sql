-- Part 1: Physical Database Design
-- A - Implementing the Database (2 marks)
-- You have to implement your database, based on your assigned topic, into the physical
-- database.
-- Giving the full explanation of your choices of data types, data length, and
-- constraints in your database.

/*
	TABLE: PATIENT
*/

drop table if exists public."Patient";

create table if not exists public."Patient"(
	"uniqueNumber"	character (12)	not null	primary key,
	"identityNumber"	int	not null check("identityNumber">0)	unique,
	"fullName"	character varying (20)	not null,
	"isFemale"	bool	not null	default false,
	"addr"	text	not null,
	"phone"	char(10)	not null
);

alter table if exists public."Patient" owner to postgres;

/*
	TABLE: EMPLOYEE
*/

drop table if exists public."Employee";

create table if not exists public."Employee"(
	"eID"	character varying (12)	not null primary key
);

alter table if exists public."Employee" owner to postgres;

/*
	TABLE: MANAGER
*/

drop table if exists public."Manager";

create table if not exists public."Manager"(
	"mID"	character varying (12)	not null primary key
		references public."Employee"("eID")	match full
		on update restrict
		on delete restrict,
	"managedBy"	character varying (12)
		references public."Manager"("mID")	match full
		on update restrict
		on delete restrict
);

alter table if exists public."Manager" owner to postgres;

/*
	TABLE: STAFF
*/

drop table if exists public."Staff";

create table if not exists public."Staff"(
	"sID"	character varying (12)	not null primary key
		references public."Employee"("eID")	match full
		on update restrict
		on delete restrict,
	"managedBy"	character varying (12)
		references public."Manager"("mID")	match full
		on update restrict
		on delete restrict
);

alter table if exists public."Staff" owner to postgres;

/*
	TABLE: NURSE
*/

drop table if exists public."Nurse";

create table if not exists public."Nurse"(
	"nID"	character varying (12)	not null primary key
		references public."Employee"("eID")	match full
		on update restrict
		on delete restrict,
	"managedBy"	character varying (12)
		references public."Manager"("mID")	match full
		on update restrict
		on delete restrict
);

alter table if exists public."Nurse" owner to postgres;

/*
	TABLE: VOLUNTEER
*/

drop table if exists public."Volunteer";

create table if not exists public."Volunteer"(
	"vID"	character varying (12)	not null primary key
		references public."Employee"("eID")	match full
		on update restrict
		on delete restrict,
	"managedBy"	character varying (12)
		references public."Manager"("mID")	match full
		on update restrict
		on delete restrict
);

alter table if exists public."Volunteer" owner to postgres;

/*
	TABLE: DOCTOR
*/

drop table if exists public."Doctor";

create table if not exists public."Doctor"(
	"dID"	character varying (12)	not null primary key
		references public."Employee"("eID")	match full
		on update restrict
		on delete restrict,
	"isHeadDoctor"	bool not null default false,
	"managedBy"	character varying (12)
		references public."Manager"("mID")	match full
		on update restrict
		on delete restrict
);

create unique index on public."Doctor" ("isHeadDoctor")
where "isHeadDoctor" = true;

alter table if exists public."Doctor" owner to postgres;

/*
	TABLE: PATIENT INSTANCE
*/

drop table if exists public."PatientInstance";

create table if not exists public."PatientInstance"(
	"uniqueNumber"	character(12)	not null
		references public."Patient" match full
		on delete restrict
		on update restrict,
	"locationBeforeAdmission"	text	not null,
	"admissionTime"	timestamp	not null,
	"nurseAssigned"	character varying(12)	not null
		references public."Nurse"("nID")	match full
		on update restrict
		on delete restrict,
	primary key("uniqueNumber", "admissionTime")
);

alter table if exists public."PatientInstance" owner to postgres;

/*
	TABLES: TESTINFO & 4 TEST TYPES
*/

drop table if exists public."TestInfo";

create table if not exists public."TestInfo"(
	"uniqueNumber"	character(12)	not null,
	"admissionTime"	timestamp	not null,
	"testTimestamp"	timestamp	not null,
	primary key("uniqueNumber", "admissionTime", "testTimestamp"),
	foreign key("uniqueNumber", "admissionTime")
		references public."PatientInstance" match full
		on delete restrict
		on update restrict
);

alter table if exists public."TestInfo" owner to postgres;

/* TABLE: SPO2 TEST */

drop table if exists public."SPO2Test";

create table if not exists public."SPO2Test"(
	"testTimestamp"	timestamp	not null,
	"admissionTime"	timestamp	not null,
	"uniqueNumber"	character(12)	not null,
	"SPO2rate"	real	not null
		check("SPO2rate"<=1)
		check("SPO2rate">=0),
	primary key("uniqueNumber", "admissionTime", "testTimestamp"),
	foreign key("uniqueNumber", "admissionTime", "testTimestamp")
		references public."TestInfo" match full
		on delete restrict
		on update restrict
);

alter table if exists public."SPO2Test" owner to postgres;

/* TABLE: QUICK TEST */

drop table if exists public."QuickTest";

create table if not exists public."QuickTest"(
	"testTimestamp"	timestamp	not null,
	"admissionTime"	timestamp	not null,
	"uniqueNumber"	character(12)	not null,
	"QuickTest_Result"	bool	not null,
	"QuickTest_ctThreshold"	int	not null,
	primary key("uniqueNumber", "admissionTime", "testTimestamp"),
	foreign key("uniqueNumber", "admissionTime", "testTimestamp")
		references public."TestInfo" match full
		on delete restrict
		on update restrict
);

alter table if exists public."QuickTest" owner to postgres;

/* TABLE: PCR TEST */

drop table if exists public."PCRTest";

create table if not exists public."PCRTest"(
	"testTimestamp"	timestamp	not null,
	"admissionTime"	timestamp	not null,
	"uniqueNumber"	character(12)	not null,
	"PCRTest_Result"	bool	not null,
	"PCRTest_ctThreshold"	int	not null,
	primary key("uniqueNumber", "admissionTime", "testTimestamp"),
	foreign key("uniqueNumber", "admissionTime", "testTimestamp")
		references public."TestInfo" match full
		on delete restrict
		on update restrict
);

alter table if exists public."PCRTest" owner to postgres;

/* TABLE: RESPIRATORY RATE TEST*/

drop table if exists public."RespiratoryRateTest";

create table if not exists public."RespiratoryRateTest"(
	"testTimestamp"	timestamp	not null,
	"admissionTime"	timestamp	not null,
	"uniqueNumber"	character(12)	not null,
	"RespiratoryRateBPM"	int	not null,
	primary key("uniqueNumber", "admissionTime", "testTimestamp"),
	foreign key("uniqueNumber", "admissionTime", "testTimestamp")
		references public."TestInfo" match full
		on delete restrict
		on update restrict
);

alter table if exists public."RespiratoryRateTest" owner to postgres;

/*
	TABLE: COMORBIDITY
*/

drop table if exists public."Comorbidity";

create table if not exists public."Comorbidity"(
	"cID"	int	not null	primary key,
	"description"	text	not null,
	"seriousness"	text	not null
);

alter table if exists public."Comorbidity" owner to postgres;

/*
	TABLE: SYMPTOM
*/

drop table if exists public."Symptom";

create table if not exists public."Symptom"(
	"sID"	int	not null	primary key,
	"description"	text	not null,
	"seriousness"	text	not null
);

alter table if exists public."Symptom" owner to postgres;

/*
	TABLE: BUILDING
*/

drop table if exists public."Building";

create table if not exists public."Building"(
	"buildingID"	character varying(4)	not null	primary key,
);

alter table if exists public."Building" owner to postgres;

/*
	TABLE: FLOOR
*/

drop table if exists public."Floor";

create table if not exists public."Floor"(
	"floorID"	character varying(4)	not null,
	"buildingID"	character varying(4)	not null
		references public."Building"	match full
		on delete restrict
		on update restrict,
	primary key("buildingID", "floorID")
);

alter table if exists public."Floor" owner to postgres;

/*
	TABLE: ROOM
*/

drop table if exists public."Room";

create table if not exists public."Room"(
	"buildingID"	character varying(4)	not null,
	"floorID"	character varying(4)	not null,
	"roomID"	character varying(4)	not null,
	"capacity"	int	not null,
	"normalRoomFlag"	bool	not null,
	"emergencyRoomFlag"	bool	not null,
	"recuperationRoomFlag"	bool	not null,
	primary key("buildingID", "floorID", "roomID"),
	foreign key("buildingID", "floorID") references public."Floor" match full
		on delete restrict
		on update restrict
);

alter table if exists public."Room" owner to postgres;

/*
	TABLE: MEDICATION
*/

drop table if exists public."Medication";

create table if not exists public."Medication"(
	"medicationID"	character varying(10)	primary key,
	"name"	character varying(20)	not null	unique,
	"price"	money	not null,
	"expDate"	date	not null
);

alter table if exists public."Medication" owner to postgres;

/*
	MULTIVALUED ATTRIBUTE: MEDICATION EFFECT
*/

drop table if exists public."MedicationEffect";

create table if not exists public."MedicationEffect"(
	"medicationID"	character varying(10)	not null
		references public."Medication"	match full
		on update restrict
		on delete restrict,
	"medicationEffect"	text	not null,
	primary key("medicationID", "medicationEffect")
);

alter table if exists public."MedicationEffect" owner to postgres;

/*
///////////////////////////////////////////////////////
//////////////////// RELATIONSHIPS ////////////////////
///////////////////////////////////////////////////////
*/

/*
	RELATIONSHIP: HAS COMORBIDITY
*/

drop table if exists public."HasComorbidity";

create table if not exists public."HasComorbidity"(
	"cID"	int	not null
		references public."Comorbidity" match full
		on update restrict
		on delete restrict,
	"admissionTime"	timestamp	not null,
	"uniqueNumber"	character(12)	not null,
	primary key("uniqueNumber", "admissionTime", "cID"),
	foreign key("uniqueNumber", "admissionTime")
		references public."PatientInstance" match full
		on update restrict
		on delete restrict
);

alter table if exists public."HasComorbidity" owner to postgres;

/*
	RELATIONSHIP: HAS SYMPTOM
*/

drop table if exists public."HasSymptom";

create table if not exists public."HasSymptom"(
	"sID"	int	not null
		references public."Symptom" match full
		on update restrict
		on delete restrict,
	"admissionTime"	timestamp	not null,
	"uniqueNumber"	character(12)	not null,
	primary key("uniqueNumber", "admissionTime", "sID"),
	foreign key("uniqueNumber", "admissionTime")
		references public."PatientInstance" match full
		on update restrict
		on delete restrict
);

alter table if exists public."HasSymptom" owner to postgres;

/*
	MULTIVALUED ATTRIBUTE: SYMPTOM PERIOD
*/

drop table if exists public."SymptomPeriod";

create table if not exists public."SymptomPeriod"(
	"sID"	int	not null,
	"admissionTime"	timestamp	not null,
	"uniqueNumber"	character(12)	not null,
	"startDate"	timestamp not null,
	"endDate"	timestamp,
	foreign key("uniqueNumber", "admissionTime", "sID")
		references public."HasSymptom" match full
		on update restrict
		on delete restrict
);

alter table if exists public."SymptomPeriod" owner to postgres;

/*
	RELATIONSHIP: MOVES
*/

drop table if exists public."Moves";

create table if not exists public."Moves"(
	"eID"	character varying (12)	not null
		references public."Employee"("eID")	match full
		on update restrict
		on delete restrict,
	"buildingID"	character varying(4)	not null,
	"floorID"	character varying(4)	not null,
	"roomID"	character varying(4)	not null,
	"uniqueNumber"	character(12)	not null,
	"admissionTime"	timestamp	not null,
	"moveTime"	timestamp	not null,
	"reason"	text,
	primary key("eID", "buildingID", "floorID", "roomID", "uniqueNumber""admissionTime"),
	foreign key("buildingID", "floorID", "roomID") references public."Room" match full
		on delete restrict
		on update restrict,
	foreign key("uniqueNumber", "admissionTime") references public."PatientInstance" match full
		on delete restrict
		on update restrict

);

alter table if exists public."Moves" owner to postgres;

/*
	RELATIONSHIP: ADMITS
*/

drop table if exists public."Admits"

create table if not exists public."Admits"(
	"uniqueNumber"	character varying(12)	not null,
	"admissionTime"	timestamp	not null,
	"medicationID"	character varying(10)	not null
		references public."Medication"	match full
		on update restrict
		on delete restrict,
	"sID"	character varying (12)	not null
		references public."Staff" match full
		on update restrict
		on delete restrict,
	primary key("uniqueNumber", "admissionTime", "medicationID", "sID"),
	foreign key("uniqueNumber", "admissionTime") references public."PatientInstance" match full
		on delete restrict
		on update restrict,
	unique("uniqueNumber", "admissionTime")
);

alter table if exists public."Admits" owner to postgres;

/*
	RELATIONSHIP: STAFF TAKES CARE
*/

drop table if exists public."StaffTakesCare";

create table if not exists public."StaffTakesCare"(
	"sID"	character varying (12)	not null primary key
		references public."Staff"	match full
		on update restrict
		on delete restrict,
	"uniqueNumber"	character(12)	not null,
	"admissionTime"	timestamp	not null,
	foreign key("uniqueNumber", "admissionTime") references public."PatientInstance" match full
		on delete restrict
		on update restrict
);

alter table if exists public."Volunteer" owner to postgres;

/*
	RELATIONSHIP: VOLUNTEER TAKES CARE
*/

drop table if exists public."VolunteerTakesCare";

create table if not exists public."VolunteerTakesCare"(
	"vID"	character varying (12)	not null primary key
		references public."Volunteer"	match full
		on update restrict
		on delete restrict,
	"uniqueNumber"	character(12)	not null,
	"admissionTime"	timestamp	not null,
	foreign key("uniqueNumber", "admissionTime") references public."PatientInstance" match full
		on delete restrict
		on update restrict
);

alter table if exists public."Volunteer" owner to postgres;

/*
	RELATIONSHIP: DISCHARGES
*/

drop table if exists public."Discharges";

create table if not exists public."Discharges"(
	"uniqueNumber"	character varying(12)	not null
		references public."Patient"	match full
		on update restrict
		on delete restrict,
	"admissionTime"	timestamp	not null
		references public."PatientInstance" match full
		on delete restrict
		on update restrict,
	"testTimestamp"	timestamp	not null
		references public."TestInfo" match full
		on delete restrict
		on update restrict,
	"dID"	character varying (12)	not null
		references public."Doctor" match full
		on update restrict
		on delete restrict,
	"dischargeTimestamp"	timestamp	not null,
	primary key("uniqueNumber", "admissionTime", "testTimestamp", "dID"),
	foreign key("uniqueNumber", "admissionTime") references public."PatientInstance" match full
		on delete restrict
		on update restrict,
	unique("uniqueNumber", "admissionTime")
);

alter table if exists public."Discharges" owner to postgres;

/*
	RELATIONSHIP: TREATS
*/

drop table if exists public."Treats"

create table if not exists public."Treats"(
	"uniqueNumber"	character varying(12)	not null
		references public."Patient"	match full
		on update restrict
		on delete restrict,
	"admissionTime"	timestamp	not null
		references public."PatientInstance" match full
		on delete restrict
		on update restrict,
	"medicationID"	character varying(10)	not null
		references public."Medication"	match full
		on update restrict
		on delete restrict,
	"dID"	character varying (12)	not null
		references public."Doctor" match full
		on update restrict
		on delete restrict,
	"treatmentResult"	text	not null,
	"startTime"	timestamp	not null,
	"endTime"	timestamp	not null,
	primary key("uniqueNumber", "admissionTime", "medicationID", "dID"),
	foreign key("uniqueNumber", "admissionTime") references public."PatientInstance" match full
		on delete restrict
		on update restrict,,
	unique("uniqueNumber", "admissionTime")
);

alter table if exists public."Treats" owner to postgres;