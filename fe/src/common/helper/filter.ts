import { IEmployeeBriefInfo } from "@/apis/interfaces/employee-detail.interface"

export const temporaryFilter = (employeeId: string, employees: IEmployeeBriefInfo[]) => {
    return employees.find(employee => employee.employeeId == employeeId)
}