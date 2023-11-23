import { IPatientInstance } from "@/apis/interfaces/patient-detail.interface";

export const MOCK_PATIENT_INSTANCE_INFO: IPatientInstance[] = [
    {
        patientOrder: 1,
        admissionTime: "2021-09-01T00:00:00.000Z",
        assignedNurseId: "1",
        locationBeforeAdmission: "862 Ly Thuong Kiet, Ward 7, District 11, HCMC",
        isWarning: true,
    },
    {
        patientOrder: 2,
        admissionTime: "2021-09-02T00:00:00.000Z",
        assignedNurseId: "2",
        locationBeforeAdmission: "628 Ly Thuong Kiet, Ward 7, District 11, HCMC",
        isWarning: false,
    }
] 