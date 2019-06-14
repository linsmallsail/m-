const http = require('http')
const req = http.createServer((req,res) => {
    console.log(req.url);
    console.log(__dirname);
    
    res.end()
    
})
req.listen(8080,()=> {
  console.log('localhost');
  
})