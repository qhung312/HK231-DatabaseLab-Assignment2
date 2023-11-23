import { IEmployeeBriefInfo } from "@/apis/interfaces/employee-detail.interface";

export const NURSES_SEARCH_RESULT: IEmployeeBriefInfo[] = [
    {
        employeeId: 1,
        name: "Nguyen Van A",
        phone: "0123456789",
        role: "Nurse"
    },
    {
        employeeId: 2,
        name: "Nguyen Van A",
        phone: "0123456789".split("").reverse().join(""),
        role: "Nurse"
    },
    {
        employeeId: 3,
        name: "Nguyen Van C",
        phone: "0123456789",
        role: "Nurse"
    }
]

export const DOCTORS_SEARCH_RESULT: IEmployeeBriefInfo[] = [
    {
        employeeId: 1,
        name: "Le Van A",
        phone: "0123456789",
        role: "Doctor"
    },
    {
        employeeId: 2,
        name: "Le Van A",
        phone: "0123456789".split("").reverse().join(""),
        role: "Doctor"
    },
    {
        employeeId: 3,
        name: "Le Van C",
        phone: "0123456789",
        role: "Doctor"
    }
]