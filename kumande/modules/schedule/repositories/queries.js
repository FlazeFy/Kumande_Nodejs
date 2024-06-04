const connection = require('../../../configs/configs')
const { generateQueryMsg } = require('../../../packages/helpers/generator')
const { templateSelectObjectColumn } = require('../../../packages/helpers/template')

const baseTable = 'schedule'

function getMySchedule(req, res){
    // Query Builder
    const daySelect = templateSelectObjectColumn('schedule_time','day','day')
    const timeSelect = templateSelectObjectColumn('schedule_time','category','time')

    const sqlStatement = `SELECT 
        day, time, GROUP_CONCAT(schedule_consume SEPARATOR ', ') AS schedule_consume
        FROM (
        SELECT 
            ${daySelect}, 
            ${timeSelect},
                schedule_consume
            FROM ${baseTable}
        ) AS q
        GROUP BY 1, 2
        ORDER BY DAYNAME(1)`

    connection.query(sqlStatement, (err, rows, fields) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let code = 200

            if (rows.length == 0){
                code = 404
            }
            res.status(code).json({ 
                message: generateQueryMsg(baseTable,rows.length), 
                status: 200, 
                data: rows 
            })
        }
    })
}

module.exports = {
    getMySchedule
}