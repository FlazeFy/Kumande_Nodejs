const axios = require('axios')

async function handleCheckAccount(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/external/telegram_user_id/${id}`)
        const status = response.status
        const message = response.data.message

        let is_login = false
        let userId = null
        if(status == 200){
            is_login = true
            userId = response.data.data
        }

        return [message, is_login, userId]
    } catch (err) {
        console.error('Error fetching consume stats:', err)
        return 'Error fetching consume stats:'+err
    }
}

async function handleCheckAccountId(id) {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/external/id/${id}`)
        const status = response.status
        const message = response.data.message

        let is_login = false
        let userId = null
        if(status == 200){
            is_login = true
            userId = response.data.data
        }

        return [message, is_login, userId]
    } catch (err) {
        console.error('Error fetching consume stats:', err)
        return 'Error fetching consume stats:'+err
    }
}

async function handleLogin(email, password) {
    try {
        const data = {
            'email':email,
            'password':password
        }

        const response = await axios.post(`http://127.0.0.1:8000/api/v1/login`, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const status = response.status
        const message = response.data.message

        if(status == 200){
            const idUserAccount = response.data.result.id
            const username = response.data.result.username
            const token = response.data.token

            return [message, idUserAccount, status, username, token] 
        } else {
            return [message, null, status, null, null]
        }
    } catch (err) {
        console.error('Error send login:', err)
        return 'Error send login:'+err
    }
}

async function handleUpdateTelegramId(teleId, token) {
    try {
        const data = {
            'telegram_user_id':teleId.toString()
        }

        const response = await axios.put(`http://127.0.0.1:8000/api/v1/user/edit_telegram_id`,  JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const status = response.status

        if(status == 200){
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error('Error update token:', err)
        return 'Error update token:'+err
    }
}

async function handleUpdateTelegramIdQRCode(teleId, id) {
    try {
        const data = {
            'telegram_user_id':teleId.toString(),
            'id':id
        }

        const response = await axios.put(`http://127.0.0.1:8000/api/v1/user/edit_telegram_id_qrcode`,  JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const status = response.status

        if(status == 200){
            return true
        } else {
            return false
        }
    } catch (err) {
        console.error('Error update token:', err)
        return 'Error update token:'+err
    }
}

module.exports = {
    handleCheckAccount,
    handleLogin,
    handleUpdateTelegramId,
    handleCheckAccountId,
    handleUpdateTelegramIdQRCode
}