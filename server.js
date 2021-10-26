const http = require('http');

const server = http.createServer((req, res)=>{

})


const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})


module.exports = server