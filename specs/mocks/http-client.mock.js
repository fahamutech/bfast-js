class HttpClientMock {

    /**
     *
     * @param url
     * @param config
     * @return {HttpClientMock.Promise<void>}
     */
    async get(url, config) {

    }

    async delete(url, config) {

    }

    async head(url, config) {

    }

    async options(url, config) {

    }

    /**
     *
     * @param url {string}
     * @param data {*}
     * @param config {*}
     * @return {Promise<{
     *      data: *,
            status: number,
            statusText: string,
            headers: *,
            config: *,
            request: *
     * }>}
     */
    async post(url, data, config) {
        if (!data){
            throw {message: 'data to save required'}
        }
        if (!data.applicationId){
            throw {message: 'application id required'};
        }

    }

    async put(url, data, config) {

    }

    async patch(url, data, config) {

    }
    
}

module.exports = {
    HttpClientMock: HttpClientMock
}
