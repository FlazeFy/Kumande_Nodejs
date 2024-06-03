const connection = require('../../../configs/configs')
const generateQueryMsg = require('../../../packages/helpers/generator')
const buildPaginationResponse = require('../../../packages/utils/pagination/services')

const baseTable = 'tag'

function getAllTags(req, res, ord, path, page, pageSize){
    // Query Builder
    const offset = (page - 1) * pageSize
    const sqlStatement = "SELECT tag_slug, tag_name, t.created_at, u.username as created_by, COUNT(1) as total_used " +
        "FROM " + baseTable + " t " +
        "LEFT JOIN user u ON u.id = t.created_by " +
        "LEFT JOIN consume c ON JSON_CONTAINS(c.consume_tag, JSON_OBJECT('slug_name', t.tag_slug), '$') " +
        "GROUP BY tag_slug "+
        "ORDER BY tag_name " + ord + " " +
        "LIMIT "+pageSize+" OFFSET "+offset

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
    getAllTags
}