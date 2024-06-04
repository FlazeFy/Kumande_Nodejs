const connection = require('../../../configs/configs')
const { generateQueryMsg } = require('../../../packages/helpers/generator')
const buildPaginationResponse = require('../../../packages/utils/pagination/services')

const baseTable = 'consume'

function getAllConsume(req, res, ord, path, page, pageSize){
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
        ORDER BY c.created_at
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
                    status: 200, 
                    data: rowsFinal 
                })
            } else {
                res.status(code).json({ 
                    message: generateQueryMsg(baseTable,rows.length), 
                    status: 200, 
                    data: rows
                })
            }
        }
    })
}

module.exports = {
    getAllConsume
}