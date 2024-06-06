const connection = require('../../../configs/configs')
const { generateQueryMsg } = require('../../../packages/helpers/generator')

const baseTable = 'payment'

function getTotalSpendMonthly(req, res, year, userId){
    // Query Builder
    const sqlStatement = `SELECT MONTH(created_at) as context, SUM(payment_price) as total 
        FROM ${baseTable} 
        WHERE YEAR(created_at) = ${year}
        AND created_by = '${userId}'
        GROUP BY 1
        ORDER BY 1 ASC
        `

    connection.query(sqlStatement, (err, rows, fields) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let obj = []
            let currentYear = new Date().getFullYear()

            for (let i = 1; i <= 12; i++) {
                let total = 0
                let date = new Date(currentYear, i - 1, 1)
                let mon = date.toLocaleString('default', { month: 'short' })

                for (let dt of rows) {
                    if (dt.context === i) {
                        total = dt.total
                        break
                    }
                }

                obj.push({
                    context: mon,
                    total: parseInt(total, 10)
                });
            }
            
            let code = 200
            res.status(code).json({ 
                message: generateQueryMsg(baseTable,rows.length), 
                status: 200, 
                data: obj
            })
        }
    })
}
function getAllBudgetByYear(req, res, year, userId){
    // Query Builder
    const sqlStatement = `SELECT 
        REPLACE(JSON_EXTRACT(budget_month_year, '$[0].month'), '\"', '') as context, budget_total as total
        FROM budget
        WHERE REPLACE(JSON_EXTRACT(budget_month_year, '$[0].year'), '\"', '') = ${year}
        AND created_by = '${userId}'
        `

    connection.query(sqlStatement, (err, rows, fields) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let obj = []
            let currentYear = new Date().getFullYear()

            for (let i = 1; i <= 12; i++) {
                let total = 0
                let date = new Date(currentYear, i - 1, 1)
                let mon = date.toLocaleString('default', { month: 'short' })

                for (let dt of rows) {
                    if (dt.context === mon) {
                        total = dt.total
                        break
                    }
                }

                obj.push({
                    context: mon,
                    total: parseInt(total, 10)
                });
            }

            let code = 200
            res.status(code).json({ 
                message: generateQueryMsg(baseTable,rows.length), 
                status: 200, 
                data: obj
            })
        }
    })
}

module.exports = {
    getTotalSpendMonthly,
    getAllBudgetByYear
}