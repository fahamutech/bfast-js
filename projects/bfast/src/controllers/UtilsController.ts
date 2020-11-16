export function extractResultFromServer(data: any, rule: string, domain: string): any {
  if (data && data[`${rule}${domain}`]) {
    return data[`${rule}${domain}`];
  } else {
    if (data && data.errors && data.errors[`${rule}`] && data.errors[`${rule}`][domain]) {
      throw data.errors[`${rule}`][`${domain}`];
    } else {
      throw {message: 'Server general failure', errors: data.errors};
    }
  }
}

export function getErrorMessage(e: any): string {
  if (e.message) {
    return e.message;
  } else {
    return (e && e.response && e.response.data) ? e.response.data : e.toString();
  }
}
