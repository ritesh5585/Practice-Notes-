import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'))

app.get('/', (res, req) => {
    let num = 0
    let sum = 0

    for (let i = 0; i < 1000000; i++) {
        sum += num
    }
    console.log(sum)
    res.send(`Sum is ${sum}`)
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
