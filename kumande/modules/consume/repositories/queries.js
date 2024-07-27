const connection = require('../../../configs/configs')
const { generateQueryMsg, generateTranslate } = require('../../../packages/helpers/generator')
const buildPaginationResponse = require('../../../packages/utils/pagination/services')
const Sentiment = require('sentiment')
const sentiment = new Sentiment()
const baseTable = 'consume'
const { promisify } = require('util')

function getAllConsume(req, res, ord, path, page, pageSize, userId){
    try {
        // Query Builder
        let pagination_script = ''
        if(page != "all"){
            page = parseInt(page)
            const offset = (page - 1) * pageSize
            pagination_script = `LIMIT ${pageSize} OFFSET ${offset}`
        } 

        const sqlStatement = `SELECT c.id, c.firebase_id, c.slug_name, consume_type, consume_name, consume_detail, consume_from, is_favorite, consume_tag, consume_comment, 
            payment_method, payment_price, c.created_at, c.updated_at, c.deleted_at, u.username as created_by
            FROM ${baseTable} c
            JOIN user u ON u.id = c.created_by
            LEFT JOIN payment p ON p.consume_id = c.id
            WHERE c.created_by = '${userId}'
            AND c.deleted_at is null
            ORDER BY c.created_at DESC
            ${pagination_script}
            `

        connection.query(sqlStatement, (err, rows, fields) => {
            if (err) {
                res.status(500).send(err)
            } else {
                let code = 200
                if (rows.length == 0){
                    code = 404
                }
                
                if(page != "all"){
                    // Page
                    const total = rows.length
                    const totalPages = Math.ceil(total / pageSize);
                    const pagination = buildPaginationResponse(page, pageSize, total, totalPages, path)

                    // Response
                    let rowsFinal = rows
                    if(total != 0){
                        rowsFinal = {
                            "current_page": page,
                            "data": rows,
                            "first_page_url": pagination.first_page_url,
                            "from": pagination.from,
                            "last_page": pagination.last_page,
                            "last_page_url": pagination.last_page_url,
                            "links": pagination.links,
                            "next_page_url": pagination.next_page_url,
                            "path": pagination.path,
                            "per_page": pageSize,
                            "prev_page_url": pagination.prev_page_url,
                            "to": pagination.to,
                            "total": total,
                        }
                    }
                    res.status(code).json({ 
                        message: generateQueryMsg(baseTable,total), 
                        status: code == 200 ? 'success' : 'failed', 
                        data: code == 200 ? rowsFinal : null
                    })
                } else {
                    res.status(code).json({ 
                        message: generateQueryMsg(baseTable,rows.length), 
                        status: code == 200 ? 'success' : 'failed', 
                        data: code == 200 ? rows : null
                    })
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

function getDailyConsumeCal(req, res, month, year, userId){
    try {
        // Query Builder
        const sqlStatement = `SELECT 
            DAY(created_at) as context, SUM(REPLACE(JSON_EXTRACT(consume_detail, '$[0].calorie'), '\"', '')) as total 
            FROM ${baseTable}
            WHERE MONTH(created_at) = '${month}'
            AND created_by = '${userId}'
            AND YEAR(created_at) = ${year}
            GROUP BY 1
            ORDER BY 2 DESC
            `

        connection.query(sqlStatement, (err, rows, fields) => {
            if (err) {
                res.status(500).send(err)
            } else {
                let obj = []
                let max = new Date(year, month, 0).getDate()

                for (let i = 1; i <= max; i++) {
                    let total = 0;

                    for (let dt of rows) {
                        if (dt.context == i) {
                            total = dt.total;
                            break;
                        }
                    }

                    obj.push({
                        context: i.toString(),
                        total: parseInt(total, 10)
                    });
                }

                let code = 200
                if (obj.length == 0){
                    code = 404
                }
                res.status(code).json({ 
                    message: generateQueryMsg(baseTable,rows.length), 
                    status: code == 200 ? 'success' : 'failed', 
                    data: code == 200 ? obj : null
                })
            }
        })
    } catch (err) {
        res.status(500).send({
            message: 'Internal server error',
            status: 'failed'
        });
    }
}

function getAllConsumeName(req, res, path, page, pageSize, userId){
    try {
        // Query Builder
        let pagination_script = ''
        if(page != "all"){
            page = parseInt(page)
            const offset = (page - 1) * pageSize
            pagination_script = `LIMIT ${pageSize} OFFSET ${offset}`
        } 

        const sqlStatement = `SELECT c.id, c.slug_name, consume_name, c.created_at
            FROM ${baseTable} c
            JOIN user u ON u.id = c.created_by
            WHERE c.created_by = '${userId}'
            AND c.deleted_at is null
            ORDER BY c.created_at DESC
            ${pagination_script}
            `

        connection.query(sqlStatement, (err, rows, fields) => {
            if (err) {
                res.status(500).send(err)
            } else {
                let code = 200
                if (rows.length == 0){
                    code = 404
                }
                
                if(page != "all"){
                    // Page
                    const total = rows.length
                    const totalPages = Math.ceil(total / pageSize);
                    const pagination = buildPaginationResponse(page, pageSize, total, totalPages, path)

                    // Response
                    let rowsFinal = rows
                    if(total != 0){
                        rowsFinal = {
                            "current_page": page,
                            "data": rows,
                            "first_page_url": pagination.first_page_url,
                            "from": pagination.from,
                            "last_page": pagination.last_page,
                            "last_page_url": pagination.last_page_url,
                            "links": pagination.links,
                            "next_page_url": pagination.next_page_url,
                            "path": pagination.path,
                            "per_page": pageSize,
                            "prev_page_url": pagination.prev_page_url,
                            "to": pagination.to,
                            "total": total,
                        }
                    }
                    res.status(code).json({ 
                        message: generateQueryMsg(baseTable,total), 
                        status: code == 200 ? 'success' : 'failed', 
                        data: code == 200 ? rowsFinal : null
                    })
                } else {
                    res.status(code).json({ 
                        message: generateQueryMsg(baseTable,rows.length), 
                        status: code == 200 ? 'success' : 'failed', 
                        data: code == 200 ? rows : null
                    })
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

async function getAnalyzeConsumeComment(req, res, userId){
    const queryAsync = promisify(connection.query).bind(connection)

    // Query Builder
    const sqlStatement = `SELECT 
        consume_name, consume_type, consume_comment, is_favorite
        FROM ${baseTable}
        WHERE consume_comment is not null
        AND created_by = '${userId}'
        `

    try {
        const rows = await queryAsync(sqlStatement)
        
        const obj = await Promise.all(rows.map(async (dt) => {
            const en_comment = await generateTranslate(dt.consume_comment)
            const analyze_comment = sentiment.analyze(en_comment)

            return {
                consume_name: dt.consume_name,
                consume_type: dt.consume_type,
                consume_comment: dt.consume_comment,
                en_consume_comment: en_comment,
                is_favorite: dt.is_favorite,
                score: analyze_comment.score
            }
        }))

        const sortedObj = obj.sort((a, b) => b.score - a.score)

        let code = 200
        if (sortedObj.length == 0){
            code = 404
        }
        res.status(code).json({ 
            message: generateQueryMsg(baseTable, rows.length), 
            status: code == 200 ? 'success' : 'failed', 
            data: code == 200 ? sortedObj : null
        })
    } catch (err) {
        res.status(500).send({
            message: 'Internal server error',
            status: 'failed'
        });
    }
}

module.exports = {
    getAllConsume,
    getDailyConsumeCal,
    getAllConsumeName,
    getAnalyzeConsumeComment
}