'use strict'

const cookie = require('cookie')

module.exports = {
  requestDidStart() {
    return {
      willSendResponse(requestContext) {
        const { setHeaders = [], setCookies = [] } = requestContext.context

        // Set headers
        setHeaders.forEach(({ key, value }) => {
          requestContext.response.http.headers.append(key, value)
        })

        // Set cookies - properly handle multiple cookies
        setCookies.forEach(({ name, value, options }) => {
          const cookieString = cookie.serialize(name, value, options)
          requestContext.response.http.headers.append('Set-Cookie', cookieString)
        })

        return requestContext
      }
    }
  }
}