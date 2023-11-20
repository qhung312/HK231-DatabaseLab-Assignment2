import { MOCK_TEST_INFO_DATA } from "@/common/mock-data/patient-test-information";
import { IPatientReportInfoPayload, IPatientReportInfoResponse, IPatientTestingInfoPayload, IPatientTestingInfoResponse } from "./interfaces/patient-detail.interface";
import { MOCK_PATIENT_REPORT_INFO } from "@/common/mock-data/patient-report";

/**
 * GET: /api/patient-testing-info
 * @param payload 
 * @returns 
 */
export const fetchPatientTestingInfoApi = async (
    payload: IPatientTestingInfoPayload
): Promise<IPatientTestingInfoResponse> => {
    const mockApiCallResponse: Promise<IPatientTestingInfoResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                data: {
                    testInfo: MOCK_TEST_INFO_DATA,
                }
            }
            resolve(data);
        }, 2000)
    );

    return await mockApiCallResponse;
}

/**
 * GET: /api/patient-report-info
 * @param payload 
 * @returns 
 */
export const fetchReportInfoApi = async (
    payload: IPatientReportInfoPayload
): Promise<IPatientReportInfoResponse> => {
    const mockApiCallResponse: Promise<IPatientReportInfoResponse> = new Promise((resolve) =>
        setTimeout(() => {
            const data = {
                data: {
                    reportInfo: MOCK_PATIENT_REPORT_INFO
                }
            }
            resolve(data);
        }, 2000)
    );

    return await mockApiCallResponse;
}