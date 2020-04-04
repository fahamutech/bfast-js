export namespace BFastConfig {
    export let cloudDatabaseUrl: string;
    export let cloudFunctionsUrl: string;
    export let applicationId: string;
    export let projectId: string;
    export let token: string;

    export const getHeaders = function (): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': applicationId
        }
    };

    export const getCloudFunctionsUrl = function (path: string) {
        if (cloudFunctionsUrl && cloudFunctionsUrl.startsWith('http')) {
            return cloudFunctionsUrl;
        }
        return `https://${projectId}-faas.bfast.fahamutech.com/${path}`
    };

    export const getCloudDatabaseUrl = function () {
        if (cloudDatabaseUrl && cloudDatabaseUrl.startsWith('http')) {
            return cloudDatabaseUrl;
        }
        return `https://${projectId}-daas.bfast.fahamutech.com`;
    };
}
