const axios = require('axios')
const { convertPriceNumber, convertDateTime } = require('../../packages/helpers/ocnverter')
const { getSession } = require('../../packages/helpers/session')

async function handleShowConsumeHistory(page) {
    try {
        const userId = await getSession('kumande_user_id')
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/consume/desc?page=${page}`, {
            headers: {
                'X-Custom-Header': userId
            }
        })
        const data = response.data.data
        const page_length = data.last_page

        let res = 'Consume History:\n\n'
        data.data.forEach((dt, i) => {
            let tags = "-"
            if (dt.consume_tag) {
                const parsedTags = JSON.parse(dt.consume_tag)
                if (Array.isArray(parsedTags)) {
                    tags = parsedTags.map(tag => `#${tag.slug_name}`).join(', ')
                }
            }
            
            res+= `${i+1}. <b>${dt.consume_name}</b> (${dt.consume_type})
            From : ${dt.consume_from}
            Payment Method : ${dt.payment_method ?? "<i>Free</i>"}
            Price : Rp. ${dt.payment_price ? convertPriceNumber(dt.payment_price) : "-"},00
            ${dt.is_favorite == 1 ? 'This item is favorited!\n':''}Created At : ${convertDateTime(dt.created_at)}
            Comment : ${dt.consume_comment ?? "-"}
            Tags : ${tags}
            \n`
        })

        return [res, page_length]
    } catch (err) {
        console.error('Error fetching consume history:', err)
        return 'Error fetching consume history:'+err
    }
}

async function handleShowStats() {
    try {
        const userId = await getSession('kumande_user_id')
        const stats_config = [
            { url: 'http://127.0.0.1:9000/api/v1/stats/consume_type', title:'Most Consume Type'},
            { url: 'http://127.0.0.1:9000/api/v1/stats/consume_from', title:'Most Consume From'},
            { url: 'http://127.0.0.1:9000/api/v1/stats/consume_provide', title:'Most Consume Provide'},
            { url: 'http://127.0.0.1:9000/api/v1/stats/consume_main_ing', title:'Most Consume Main Ingredient'},
        ]

        let res = ''
        for (const conf of stats_config) {
            const response = await axios.get(conf.url, {
                headers: {
                    'X-Custom-Header': userId
                }
            })
            const data = response.data.data
    
            res += `<b>${conf.title}:</b>\n\n`
            data.forEach((dt, i) => {
                res+= `- ${dt.context} (${dt.total})\n`
            })
            res+= `\n`
        }
        
        return res
    } catch (err) {
        console.error('Error fetching consume stats:', err)
        return 'Error fetching consume stats:'+err
    }
}

async function handleShowConsumeName(page) {
    try {
        const userId = await getSession('kumande_user_id')
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/consume_name?page=${page}`, {
            headers: {
                'X-Custom-Header': userId
            }
        })
        const data = response.data.data.data
        
        return data
    } catch (err) {
        console.error('Error fetching consume stats:', err)
        return 'Error fetching consume stats:'+err
    }
}

module.exports = {
    handleShowConsumeHistory,
    handleShowStats,
    handleShowConsumeName
}