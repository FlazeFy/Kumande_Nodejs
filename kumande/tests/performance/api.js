const autocannon = require('autocannon')

const baseUrl = 'http://localhost:9000'
const payload = JSON.stringify({
  lat: 12.3456,
  long: 65.4321,
  date: '2024-08-01'
})
const headers = {
  'Content-Type': 'application/json',
  'x-custom-header': '2d98f524-de02-11ed-b5ea-0242ac120002'
}

const instance = autocannon({
  url: `${baseUrl}/api/v1/analyze/next_consume`,
  method: 'POST',
  headers: headers,
  body: payload,
  connections: 10,
  duration: 10,
  workers:10
});

autocannon.track(instance)

instance.on('done', (res) => {
  console.log(`Time Execution\nStart from ${res.start}\nEnd at ${res.finish}\n`)
  console.log(`Requests\n${JSON.stringify(res.requests.average, null, 2)}\n`)
  console.log(`Latency\n${JSON.stringify(res.latency.average, null, 2)}\n`)
  console.log(`Throughput\n${JSON.stringify(res.throughput.average, null, 2)}\n`)
  
  console.log('Benchmark completed')
})
