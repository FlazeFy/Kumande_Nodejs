const axios = require('axios')
const { convertPriceNumber } = require('../../packages/helpers/ocnverter')

async function handleShowSchedule() {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/schedule`)
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

async function handleShowStatsMonthly() {
    try {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const year = new Date().getFullYear()
        const month_number = new Date().getMonth()
        const month = months[month_number]

        const stats_config = [
            { url: `http://127.0.0.1:9000/api/v1/payment/budget/${year}`, title:`All Budget in ${year}`, unit:'price'},
            { url: `http://127.0.0.1:9000/api/v1/payment/total/monthly/${year}`, title:`Total Spending ${year}`, unit:'price'},
            { url: `http://127.0.0.1:9000/api/v1/consume/total/day/cal/month/${month_number+1}/year/${year}`, title:`Total Daily Cal ${month} ${year}`, unit:'cal'},
        ]

        let res = ''
        for (const conf of stats_config) {
            const response = await axios.get(conf.url)
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
    handleShowStatsMonthly
}