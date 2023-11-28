import { MOCK_DEMOGRAPHIC_DATA, MOCK_TEST_INFO_DATA } from "@/common/mock-data/patient-test-information";
import { IPatientDemographicInfoPayload, IPatientDemographicInfoResponse, IPatientInstanceInfoPayload, IPatientInstanceInfoResponse, IPatientReportInfoPayload, IPatientReportInfoResponse, IPatientTestingInfoPayload, IPatientTestingInfoResponse } from "./interfaces/patient-detail.interface";
import { MOCK_PATIENT_REPORT_INFO } from "@/common/mock-data/patient-report";
import { MOCK_PATIENT_INSTANCE_INFO } from "@/common/mock-data/patient-instance";
import axios from "axios";
import axiosClient from "@/common/helper/axios-client";

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
    const { patientId, patientInstanceOrder } = payload;

    const res = await axiosClient.get('patient/' + patientId + '/instance/' + patientInstanceOrder + '/report')
    const resData = res.data;

    const { error, data } = resData;

    if (error) {
        return {
            error
        }
    }

    const reportInfo = {
        ...data?.reportInfo,
        treatmentInfo: data?.reportInfo?.treatmentInfo?.map((treatment: any) => {
            return {
                ...treatment,
                doctorId: treatment.doctor?.employeeId
            }
        })
    }

    return {
        data: {
            reportInfo
        }
    };
}

export const fetchPatientInstanceApi = async (
    payload: IPatientInstanceInfoPayload
): Promise<IPatientInstanceInfoResponse> => {
    try {
        const { patientId } = payload;

        const res = await axiosClient.get('patient/' + patientId + '/instance')
        const resData = res.data;

        const { error, data } = resData;

        if (error) {
            return {
                error
            }
        }

        const instanceInfo = (data?.instanceInfo || []).map((instance: any) => {
            return {
                ...instance,
                patientOrder: instance.patientInstanceOrder,
                assignedNurseId: instance.assignedNurse?.employeeId
            }
        })

        return {
            data: {
                instanceInfo
            }
        };
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }

}

/**
 * GET: /api/patient-demographic-info?patientId=patientId
 * @param payload 
 */
export const fetchPatientDemographicInfoApi = async (payload: IPatientDemographicInfoPayload): Promise<IPatientDemographicInfoResponse> => {
    try {
        const { patientId } = payload;

        const res = await axiosClient.get('patient/' + patientId)

        const resData = res.data;

        const { error, data } = resData;

        const demographicInfo = {
            ...data.demographicInfo,
            id: data.demographicInfo.identityNumber,
            address: data.demographicInfo.addr,
        };

        return {
            data: {
                demographicInfo: demographicInfo
            },
            error
        }
    }
    catch (err: any) {
        const errorMessage = err?.response?.data?.error || 'Something went wrong';

        return {
            error: errorMessage
        }
    }
}