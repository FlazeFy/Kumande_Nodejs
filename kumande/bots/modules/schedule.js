const axios = require('axios')

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

module.exports = {
    handleShowSchedule
}