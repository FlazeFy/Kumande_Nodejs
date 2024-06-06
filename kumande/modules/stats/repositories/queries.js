const connection = require('../../../configs/configs')
const { generateQueryMsg } = require('../../../packages/helpers/generator')

function getTotalItemByContext(req, res, tableName, context, ord, userId){
    // Query Builder
    const sqlStatement = `
        SELECT ${context} as context, count(1) as total
        FROM ${tableName}
        WHERE ${tableName}.created_by = '${userId}'
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

function getTotalItemByContextObject(req, res, tableName, context, subcontext, ord, userId){
    // Query Builder
    const sqlStatement = `
        SELECT REPLACE(JSON_EXTRACT(${context}, '$[0].${subcontext}'), '\"', '') as context, count(1) as total
        FROM ${tableName}
        WHERE ${tableName}.created_by = '${userId}'
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

function getLastCountCalorie(req, res, userId){
    // Query Builder
    const tableName = 'count_calorie'
    const sqlStatement = `
        SELECT weight, height, result, created_at
        FROM ${tableName}
        WHERE created_by = '${userId}'
        ORDER BY created_at DESC
        LIMIT 1
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
                data: rows[0] 
            })
        }
    })
}

module.exports = {
    getTotalItemByContext,
    getTotalItemByContextObject,
    getLastCountCalorie
}