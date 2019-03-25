/**
 * https://github.com/jrop/nedb-promise
 */

import NedbDatastore from 'nedb'
import thenify from 'thenify'

function fromInstance (nedbInstance) {
    const newDB = { nedb: nedbInstance }

    const methods = [ 'loadDatabase', 'insert', 'find', 'findOne', 'count', 'update', 'remove', 'ensureIndex', 'removeIndex' ]
    for (let i = 0; i < methods.length; ++i) {
        const m = methods[i]
        newDB[m] = thenify(nedbInstance[m].bind(nedbInstance))
    }

    newDB.cfind = function (query, projections) {
        const cursor = nedbInstance.find(query, projections)
        cursor.exec = thenify(cursor.exec.bind(cursor))
        return cursor
    }

    newDB.cfindOne = function (query, projections) {
        const cursor = nedbInstance.findOne(query, projections)
        cursor.exec = thenify(cursor.exec.bind(cursor))
        return cursor
    }

    newDB.ccount = function (query) {
        const cursor = nedbInstance.count(query)
        cursor.exec = thenify(cursor.exec.bind(cursor))
        return cursor
    }

    return newDB
}

function datastore (options) {
    const nedbInstance = new NedbDatastore(options)
    return fromInstance(nedbInstance)
}

// so that import { datastore } still works:
datastore.datastore = datastore
datastore.fromInstance = fromInstance

export default datastore
