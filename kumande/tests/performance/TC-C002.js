const autocannon = require('autocannon')

const baseUrl = 'http://localhost:9000'
const headers = {
  'Content-Type': 'application/json',
  'x-custom-header': '2d98f524-de02-11ed-b5ea-0242ac120002'
}

const subUrl = ['consume_type', 'consume_from', 'consume_provide', 'consume_main_ing'];

const benchmarkUrls = async () => {
    const instances = subUrl.map(el => {
        const instance = autocannon({
            url: `${baseUrl}/api/v1/stats/${el}`,
            method: 'GET',
            headers: headers,
            connections: 10,
            duration: 10,
            workers: 10
        })

        autocannon.track(instance)

        instance.on('done', (res) => {
            console.log(`Benchmark for /api/v1/stats/${el}`)
            console.log(`Time Execution\nStart from ${res.start}\nEnd at ${res.finish}\n`)
            console.log(`Requests\n${JSON.stringify(res.requests.average, null, 2)}\n`)
            console.log(`Latency\n${JSON.stringify(res.latency.average, null, 2)}\n`)
            console.log(`Throughput\n${JSON.stringify(res.throughput.average, null, 2)}\n`)
            console.log('Benchmark completed\n')
        })

        return instance
    })

    await Promise.all(instances.map(instance => new Promise(resolve => instance.on('done', resolve))))
}

benchmarkUrls().then(() => console.log('All benchmarks completed')).catch(console.error);
