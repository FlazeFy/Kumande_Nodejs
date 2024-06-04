const connection = require('../../../configs/configs')
const { generateQueryMsg } = require('../../../packages/helpers/generator')

function getTotalItemByContext(req, res, tableName, context, ord){
    // Query Builder
    const sqlStatement = `
        SELECT ${context} as context, count(1) as total
        FROM ${tableName}
        GROUP BY 1
        ORDER BY 2 ${ord}
        LIMIT 8
    `

    connection.query(sqlStatement, (err, rows, fields) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let code = 200

            if (rows.length == 0){
                code = 404
            }
            res.status(code).json({ 
                message: generateQueryMsg(tableName,rows.length), 
                status: 200, 
                data: rows 
            })
        }
    })
}

function getTotalItemByContextObject(req, res, tableName, context, subcontext, ord){
    // Query Builder
    const sqlStatement = `
        SELECT REPLACE(JSON_EXTRACT(${context}, '$[0].${subcontext}'), '\"', '') as context, count(1) as total
        FROM ${tableName}
        GROUP BY 1
        ORDER BY 2 ${ord}
        LIMIT 8
    `

    connection.query(sqlStatement, (err, rows, fields) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let code = 200

            if (rows.length == 0){
                code = 404
            }
            res.status(code).json({ 
                message: generateQueryMsg(tableName,rows.length), 
                status: 200, 
                data: rows 
            })
        }
    })
}

module.exports = {
    getTotalItemByContext,
    getTotalItemByContextObject
}