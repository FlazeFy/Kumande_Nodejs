const connection = require('../../../configs/configs')
const generateQueryMsg = require('../../../packages/helpers/generator')
const buildPaginationResponse = require('../../../packages/utils/pagination/services')

const baseTable = 'consume'

function getAllConsume(req, res, ord, path, page, pageSize){
    // Query Builder
    const offset = (page - 1) * pageSize
    const sqlStatement = `SELECT c.id, c.firebase_id, c.slug_name, consume_type, consume_name, consume_detail, consume_from, is_favorite, consume_tag, consume_comment, 
        c.created_at, c.updated_at, c.deleted_at, u.username as created_by
        FROM ${baseTable} c
        JOIN user u ON u.id = c.created_by
        ORDER BY c.created_at
        LIMIT ${pageSize} OFFSET ${offset}
        `

    connection.query(sqlStatement, (err, rows, fields) => {
        if (err) {
            res.status(500).send(err)
        } else {
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

            let code = 200

            if (rows.length == 0){
                code = 404
            }
            res.status(code).json({ 
                message: generateQueryMsg(baseTable,total), 
                status: 200, 
                data: rowsFinal 
            })
        }
    })
}

module.exports = {
    getAllConsume
}