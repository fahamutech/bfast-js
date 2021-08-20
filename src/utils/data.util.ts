export function extractResultFromServer(data: any, rule: string, domain: string) {
    if (data && data[`${rule}${domain}`]) {
        return data[`${rule}${domain}`];
    } else {
        if (data && data.errors && data.errors[`${rule}.${domain}`]) {
            throw data.errors[`${rule}.${domain}`];
        } else {
            throw {message: 'Server general failure', errors: data.errors};
        }
    }
}
