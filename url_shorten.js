require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
const validUrl = require("Valid-url")
// Basic Configuration
app.use(bodyParser.urlencoded({extended:false}));
const port = process.env.PORT || 3000;
const urlpairs = [{original_url:'', short_url:''}];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',async (req, res)=>{
  const url=req.body.url_input
  const shorturl=Math.floor(Math.random()*10000)
  
  if (!validUrl.isWebUri(url)){
    res.status(401).json(
      {error:'invalid url'}
    )}else{
      let found= await urlpairs.find(pair=>pair.original_url===url)
      if (found){
        res.json({
          original_url:found.original_url,
          short_url:found.short_url
        })
      }else{
        let newUrl = {
          original_url:url,
          short_url:shorturl
        }
        urlPairs.push(newUrl)
        res.json({
          original_url:newUrl.original_url,
          short_url:newUrl.short_url
        })
      }
    }
})
app.get('/api/shorturl/:shorturl',async (req, res)=>{
  try{
    const found = await urlpairs.find(pair=>pair.short_url===req.params.shorturl)
    if (found){
      return res.redirect(found.original_url)
    }else{
      return res.status(404).json('No URL found')
    }
  }catch (err){
    console.log(err)
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
