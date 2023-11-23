export interface IEmployeeBriefInfo {
    employeeId: string | number;
    name: string;
    role?: string;
    phone?: string;
}

export interface ISearchEmployeePayload {
    type: "id" | "name" | "phone";
    role: 'Doctor' | 'Nurse' | 'Staff' | 'Volunteer' | 'Manager';
    value: string;
}

export interface ISearchEmployeeResponse {
    data?: { employees: IEmployeeBriefInfo[] };
    error?: string;
}

