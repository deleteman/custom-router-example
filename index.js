import express from 'express'
import fs from 'fs'

const app = express()

app.all('/*', async (req, resp) => {
    let importURL = ('./routes/' + req.url).replace("//", "/")
    
    let isFile = fs.existsSync(importURL + '.js')
    let module = null
    const httpVerb = req.method.toLowerCase()
    console.log("Method HTTP used: ", httpVerb)

    if(!isFile) {
        importURL += '/index.js'
    } else {
        importURL += '.js'
    }

    try {
        module = await import(importURL)
        let data = null
        if(module[httpVerb]) {
            data = module[httpVerb](req, resp)
        } else {
            data = module.handler(req, resp)
        }
        resp.send(data)
    } catch(e) {
        console.log(e)
        resp.statusCode = 404
        resp.send("Not found")
    }
})

app.listen(3000, () => {
    console.log("server is waiting")
})