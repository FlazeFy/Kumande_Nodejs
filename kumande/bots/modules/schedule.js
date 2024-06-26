const axios = require('axios')
const { convertPriceNumber, convertDateTime } = require('../../packages/helpers/ocnverter')
const { getSession } = require('../../packages/helpers/session')

async function handleShowSchedule() {
    try {
        const userId = await getSession('kumande_user_id')
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/schedule`, {
            headers: {
                'X-Custom-Header': userId
            }
        })
        const data = response.data
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
        const time = ["Breakfast","Lunch","Dinner"]

        let res = 'My Schedule:\n\n'
        res+= `============ ${days[0]} ============\n\n`
        days.forEach((day, i) => {
            time.forEach((tm, j) => {
                let found = false
                data.data.forEach((dt, k) => {
                    if(dt.day == day && dt.time == tm){
                        res+= `Day : ${dt.day}\nTime : ${dt.time}\nConsume : ${dt.schedule_consume}\n\n`
                        found = true
                        return
                    }
                })
                if(!found){
                    res+= `Day : ${day}\nTime : ${tm}\nConsume : -\n\n`
                }
            })
            if(i < days.length -1){
                res+= `============ ${days[i+1]} ============\n\n`
            }
        })

        return res
    } catch (err) {
        console.error('Error fetching schedule:', err)
        return 'Error fetching schedule:'+err
    }
}

async function handleShowBodyInfo() {
    try {
        const userId = await getSession('kumande_user_id')
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/stats/count/calorie`, {
            headers: {
                'X-Custom-Header': userId
            }
        })
        const data = response.data.data

        let res = 'My Body Info:\n\n'
        res+= `Weight : ${data.weight} Kg\nHeight : ${data.height} Cm\nCalories / Day : ${data.result} Cal\nLast Updated : ${convertDateTime(data.created_at)}`

        return res
    } catch (err) {
        console.error('Error fetching body info', err)
        return 'Error fetching body info:'+err
    }
}

async function handleShowStatsMonthly() {
    try {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const year = new Date().getFullYear()
        const month_number = new Date().getMonth()
        const month = months[month_number]
        const userId = await getSession('kumande_user_id')

        const stats_config = [
            { url: `http://127.0.0.1:9000/api/v1/payment/budget/${year}`, title:`All Budget in ${year}`, unit:'price'},
            { url: `http://127.0.0.1:9000/api/v1/payment/total/monthly/${year}`, title:`Total Spending ${year}`, unit:'price'},
            { url: `http://127.0.0.1:9000/api/v1/consume/total/day/cal/month/${month_number+1}/year/${year}`, title:`Total Daily Cal ${month} ${year}`, unit:'cal'},
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
                if(conf.unit == 'price'){
                    res+= `- ${dt.context} : Rp. ${dt.total ? convertPriceNumber(dt.total)+',00':'-'}\n`
                } else if(conf.unit == 'cal'){
                    res+= `- ${dt.context} : ${dt.total} Cal\n`
                }
            })
            res+= `\n`
        }
        
        return res
    } catch (err) {
        console.error('Error fetching consume stats:', err)
        return 'Error fetching consume stats:'+err
    }
}

module.exports = {
    handleShowSchedule,
    handleShowStatsMonthly,
    handleShowBodyInfo
}