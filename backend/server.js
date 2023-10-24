const express = require('express')
const app = express()
const port = 3000
const recommendationsRoutes = require('./routes/recommendations')
const schedulingRoutes = require('./routes/events')

app.use('/recommendations', recommendationsRoutes)
app.use('/scheduling', schedulingRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})