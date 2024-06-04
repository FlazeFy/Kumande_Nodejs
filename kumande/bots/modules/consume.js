const axios = require('axios')
const { convertPriceNumber, convertDateTime } = require('../../packages/helpers/ocnverter')

async function handleShowConsumeHistory(page) {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/consume/desc?page=${page}`)
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

module.exports = {
    handleShowConsumeHistory
}