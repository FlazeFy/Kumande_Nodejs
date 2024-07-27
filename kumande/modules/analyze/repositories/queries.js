const connection = require('../../../configs/configs')
const { generateQueryMsg, generateTranslate, getMonthName } = require('../../../packages/helpers/generator')
const baseTable = 'consume'
const fs = require('fs')
const csv = require('csv-parser')
const { templateSelectObjectColumn } = require('../../../packages/helpers/template')
const { calculateDistance } = require('../../../packages/helpers/ocnverter')

function getAnalyzeConsume(req, res, userId, lat, long, date){
    // Query CSV
    try {
        const csvFilePath = './docs/Kumande Asset - Food.csv'

        const sqlCheckUser = `SELECT 1 FROM user WHERE id = '${userId}' LIMIT 1`

        connection.query(sqlCheckUser, (err, check, fields) => {
            if (err) {
                res.status(500).send({
                    message: 'Internal server error',
                    status: 'failed'
                });
            } else {
                if(check.length > 0){
                    // Attribute
                    const dateObj = new Date(date)
                    const month = getMonthName(dateObj.getMonth()).substring(0,3)
                    const year = dateObj.getFullYear()

                    // Query DB SQL
                    const selectProvide = templateSelectObjectColumn('consume_detail', 'provide', 'provide')
                    const selectLat = templateSelectObjectColumn('consume_detail', 'provide_lat', 'consume_lat')
                    const selectLong = templateSelectObjectColumn('consume_detail', 'provide_long', 'consume_long')

                    const selectMonth = templateSelectObjectColumn('budget_month_year', 'month', 'month').replace(' AS month','')
                    const selectYear = templateSelectObjectColumn('budget_month_year', 'year', 'year').replace(' AS year','')

                    const sqlConsume = `SELECT 
                            consume_name, AVG(CAST(REPLACE(JSON_EXTRACT(consume_detail, '$[0].calorie'), '\"', '') AS UNSIGNED)) as calorie, COUNT(1) as total_consume, 
                            is_favorite, ${selectProvide}, ${selectLat}, ${selectLong}
                        FROM ${baseTable}
                        WHERE deleted_by is null
                        AND created_by = '${userId}'
                        GROUP BY consume_name
                        ORDER BY total_consume DESC
                    `

                    const sqlBudget = `SELECT budget_total
                        FROM budget
                        WHERE created_by = '${userId}'
                        AND ${selectMonth} = '${month}'
                        AND ${selectYear} = '${year}'
                    `

                    const sqlAllergic = `SELECT allergic_context
                        FROM allergic
                        WHERE created_by = '${userId}'
                    `
                    
                    let bValues = []
                    let cValues = []

                    fs.createReadStream(csvFilePath).pipe(csv())
                    .on('data', (row) => {
                        bValues.push(row['food']);
                        cValues.push(row['calorie']);
                    })
                    .on('end', () => {
                        connection.query(sqlConsume, (err, rows, fields) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Internal server error',
                                    status: 'failed'
                                })
                            } else {
                                let code = 200

                                connection.query(sqlAllergic, (err, allergic, fields) => {
                                    if (err) {
                                        res.status(500).send({
                                            message: 'Internal server error',
                                            status: 'failed'
                                        });
                                    } else {
                                        // Allergic List
                                        const allergicContext = allergic.flatMap(entry => 
                                            entry.allergic_context.split(',').map(dt => dt.trim().toLowerCase())
                                        );

                                        // Suggestion from Dataset
                                        const results_dataset = bValues.map((food, index) => ({
                                            consume_name: food,
                                            calorie: parseInt(cValues[index])
                                        })).filter(item => 
                                            !allergicContext.some(dt => item.consume_name.toLowerCase().includes(dt))
                                        )

                                        // Suggestion from Consume History
                                        const results_personal = rows.map((dt, index) => ({
                                            consume_name: dt.consume_name,
                                            calorie: dt.calorie,
                                            total_consume: dt.total_consume,
                                            is_favorite: dt.is_favorite,
                                            provide: dt.provide,
                                            distance: dt.consume_lat && dt.consume_long && lat && long ? calculateDistance(dt.consume_lat, dt.consume_long, lat, long) : null,
                                        })).filter(item => 
                                            !allergicContext.some(dt => item.consume_name.toLowerCase().includes(dt))
                                        )

                                        if (rows.length == 0 && results_dataset.length == 0){
                                            code = 404
                                        }
                                        
                                        connection.query(sqlBudget, (err, budget, fields) => {
                                            let budgetTotal = null
                                            if (err) {
                                                res.status(500).send(err);
                                            } else {
                                                // Budget by Month
                                                if (budget.length > 0) {
                                                    budgetTotal = budget[0].budget_total
                                                }
                        
                                                res.status(code).json({ 
                                                    message: generateQueryMsg(baseTable, rows.length), 
                                                    status: code, 
                                                    general_analyze: results_dataset,
                                                    personal_analyze: results_personal,
                                                    budget_total: budgetTotal
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                    .on('error', (err) => {
                        res.status(500).send({
                            message: 'Internal server error',
                            status: 'failed'
                        });
                    });
                } else {
                    res.status(404).send({
                        message: 'User not found',
                        status: 'failed'
                    });
                }
            }
        })
    } catch (err) {
        res.status(500).send({
            message: 'Internal server error',
            status: 'failed'
        });
    }
}

module.exports = {
    getAnalyzeConsume
}