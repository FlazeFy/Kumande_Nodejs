const axios = require('axios')
const { convertPriceNumber, convertDateTime } = require('../../packages/helpers/ocnverter')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

async function handleAllConsume() {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/consume/desc?page=all`)
        const data = response.data
        const rows = []
        const date = new Date()

        data.data.forEach((dt, i) => {
            let tags = "-"
            if (dt.consume_tag) {
                const parsedTags = JSON.parse(dt.consume_tag)
                if (Array.isArray(parsedTags)) {
                    tags = parsedTags.map(tag => tag.slug_name).join(', ')
                }
            }
            const parsedDetail = JSON.parse(dt.consume_detail)
            
            rows.push({
                consume_type: dt.consume_type, 
                consume_name: dt.consume_name, 
                consume_comment: dt.consume_comment ?? '-',
                detail_provide: parsedDetail[0]['provide'],
                detail_calorie: `${parsedDetail[0]['calorie']} Cal`,
                detail_main_ing: parsedDetail[0]['main_ing'],
                consume_from: dt.consume_from,
                tags: tags,
                payment_price: `Rp. ${dt.payment_price ? convertPriceNumber(dt.payment_price) : '-'},00`,
                payment_method: dt.payment_method ?? 'Free',
                is_favorite: dt.is_favorite == 1 ? 'True' : 'False',
                created_at: convertDateTime(dt.created_at),
            })
        })

        const path = `consume_list_${date}.csv`
        const filename = `consume_list_${date}.csv`
        const csvWriter = createCsvWriter({
            path: path,
            header: [
                { id: 'consume_type', title: 'Type' },
                { id: 'consume_name', title: 'Consume Name' },
                { id: 'consume_from', title: 'From' },
                { id: 'consume_comment', title: 'Comment' },
                { id: 'detail_provide', title: 'Provide' },
                { id: 'detail_calorie', title: 'Calorie' },
                { id: 'detail_main_ing', title: 'Main Ingredient' },
                { id: 'tags', title: 'Tags' },
                { id: 'payment_price', title: 'Price' },
                { id: 'payment_method', title: 'Payment Method' },
                { id: 'is_favorite', title: 'Favorite?' },
                { id: 'created_at', title: 'Created At' },
            ]
        });

        await csvWriter.writeRecords(rows);
        
        return [path, filename]
    } catch (err) {
        console.error('Error fetching consume list:', err)
        return 'Error fetching consume list:'+err
    }
}

module.exports = {
    handleAllConsume
}