export const validateInput = (value: string, type: string) => {
    if (type === 'name') {
        return value.length > 0
    }
    if (type === 'phone') {
        return value.length > 0 && value.length < 20
    }
    if (type === 'id') {
        return value.length > 0
    }
    return false
}