const connection = require('../../../configs/configs')
const baseTable = 'user'

function getCheckExternal(req, res, scope, id){
    // Query Builder
    const sqlStatement = `SELECT id, username FROM ${baseTable} WHERE ${scope} = '${id}' LIMIT 1`

    connection.query(sqlStatement, (err, rows, fields) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (rows.length == 0){
                let ctx = ''
                if(scope == 'telegram_user_id'){
                    ctx = 'Telegram ID'
                } else if(scope == 'firebase_id' || scope == 'firebase_fcm_token'){
                    ctx = 'Firebase ID'
                }

                res.status(404).json({ 
                    message: `This ${ctx} is not registered to any account`, 
                    status: 404, 
                    data: null
                })
            } else {
                res.status(200).json({ 
                    message: `Welcome ${rows[0].username}`, 
                    status: 200, 
                    data: rows[0].id
                })
            }
        }
    })
}

module.exports = {
    getCheckExternal
}