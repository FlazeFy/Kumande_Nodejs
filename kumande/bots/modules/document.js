const axios = require('axios')
const { convertPriceNumber, convertDateTime } = require('../../packages/helpers/ocnverter')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const puppeteer = require('puppeteer')
const { getSession } = require('../../packages/helpers/session')

async function handleAllConsume() {
    try {
        const userId = await getSession('kumande_user_id')
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/consume/desc?page=all`, {
            headers: {
                'X-Custom-Header': userId
            }
        })
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

async function handleMySchedule() {
    try {
        const userId = await getSession('kumande_user_id')
        const response = await axios.get(`http://127.0.0.1:9000/api/v1/schedule`, {
            headers: {
                'X-Custom-Header': userId
            }
        })
        let data = response.data.data
        const date = new Date()
        const path = `my_schedule_${date}.pdf`
        const filename = `my_schedule_${date}.pdf`
        const time = ["Breakfast","Lunch","Dinner"]

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        let body = ''

        function findInSchedule(day, time){
            const res = data.find((el) => el.day == day && el.time == time)
            return res ? res.schedule_consume : '-'
        }

        time.forEach((t, i) => {
            body += `
                <tr>
                    <td style='font-weight: 600;'>${t}</td>
                    <td>${findInSchedule('Mon', t)}</td>
                    <td>${findInSchedule('Tue', t)}</td>
                    <td>${findInSchedule('Wed', t)}</td>
                    <td>${findInSchedule('Thu', t)}</td>
                    <td>${findInSchedule('Fri', t)}</td>
                    <td>${findInSchedule('Sat', t)}</td>
                    <td>${findInSchedule('Sun', t)}</td>
                </tr>
            `
        })

        await page.setContent(`
            <html>
                <head>
                    <title>My Schedule</title>
                    <style>
                        th, td{
                            border: 1px solid black;
                        }
                        thead {
                            font-size:15px;
                        }
                        tbody {
                            font-size:12px;
                        }
                        tbody td {
                            padding: 3px;
                        }
                        table {
                            border-collapse: collapse;
                            width:100%;
                            text-align:center;
                        }
                        h6 {
                            font-size:12.5px;
                            margin:0;
                        }
                    </style>
                </head>
                <body>
                    <h1>Kumande</h1>
                    <hr>
                    <h2>My Schedule</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Time / Day</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                                <th>Sunday</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${body}
                        </tbody>
                    </table>
                    <hr>
                    <div style='font-size: 12px; font-style:italic;'>
                        <p style='float:left;'>Kumande parts of FlazenApps</p>
                        <p style='float:right;'>Generated at ${date} by ...</p>
                    </div>
                </body>
            </html>
        `);

        await page.pdf({ path: path, format: 'A4', landscape:true})
        await browser.close()
        
        return [path, filename]
    } catch (err) {
        console.error('Error fetching my schedule:', err)
        return 'Error fetching my schedule:'+err
    }
}

module.exports = {
    handleAllConsume,
    handleMySchedule
}