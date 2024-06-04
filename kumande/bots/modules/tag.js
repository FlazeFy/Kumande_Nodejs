const axios = require('axios')
const { convertDateTime } = require('../../packages/helpers/ocnverter')

async function handleShowTag(page) {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/tag/desc?page=${page}`)
        const data = response.data.data
        const page_length = data.last_page

        let res = 'Tag:\n\n'
        data.data.forEach((dt, i) => {
            res+= `${i+1}. <b>#${dt.tag_slug}</b>
            Total Used : ${dt.total_used}
            Created At : ${convertDateTime(dt.created_at)}
            \n`
        })

        return [res, page_length]
    } catch (err) {
        console.error('Error fetching tag:', err)
        return 'Error fetching tag:'+err
    }
}

module.exports = {
    handleShowTag
}