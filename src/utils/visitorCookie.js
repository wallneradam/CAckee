'use strict'

const uuid = require('uuid').v4

const COOKIE_NAME = 'ackee_visitor'

const get = (cookie = '') => {
        const match = cookie.split(';').find((c) => c.trim().startsWith(`${ COOKIE_NAME }=`))
        return match == null ? undefined : match.trim().slice(COOKIE_NAME.length + 1)
}

module.exports = {
        get,
        create: () => ({
                name: COOKIE_NAME,
                value: uuid(),
                options: {
                        maxAge: 365 * 24 * 60 * 60,
                        sameSite: 'lax',
                        secure: false,
                },
        }),
}
