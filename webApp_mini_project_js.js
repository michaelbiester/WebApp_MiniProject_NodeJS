// index_2.js

// Express application

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, sep} from 'path';
import { getFileNewest, getFilesSorted } from "./lib/getFile.js";
import compression from 'compression';
import { WebSocketServer} from 'ws';
import fs from 'fs';

const __dirname = dirname(fileURLToPath( import.meta.url )) + sep;
console.log(`dirname: ${__dirname}`);

// configuration 
const cfg ={
    port: 3000,
    wsPort: 8001,
    dir: {
        root: __dirname,
        public: __dirname + 'public' + sep,
        gallery: __dirname + 'public' + sep + 'images' + sep + 'gallery' + sep,
        views: __dirname + 'views' + sep,
        routes: __dirname + 'routes' + sep,
        data: __dirname + 'public' + sep + 'data' + sep
    }
};

const imgDir = cfg.dir.gallery;

// create Express application
const app = express();
// do not identify Express
app.disable('x-powered-by');

app.use( compression() );


// home page route
app.get('/', (req, res) => {
    console.log(`request object: ${req.ip}`);
    // res.send("first express application");
    // res.sendFile(cfg.dir.views + 'webapp.html');
    res.sendFile(cfg.dir.views + 'webApp_mini_project.html');
});


app.get('/data', (req, res) => {
    console.log(`req: ${req}`);
    console.log(`request object: ${req.ip}`);
    res.sendFile(cfg.dir.data + 'ssh_credentials.json');
});

// app.use(express.static('public'));
// static assets are served from here and / or its subdirectories
app.use(express.static(cfg.dir.public));

// start server
app.listen(cfg.port, () => {
    console.log(`example app listening at http:localhost:${cfg.port}`);
})

//---------------------
// the websocket server
// main purpose: client sends message and request upload of an image
// --> server sends image in binary format; client displays image
const ws_server = new WebSocketServer({port: cfg.wsPort});

ws_server.on('connection', ws => {
    console.log('New client connection');
    ws.send('connection established');
    ws.on('close', () => console.log('client has disconnected'));
    ws.on('message', data => {
        let data_recv = JSON.parse(data);
        console.log(`received: ${data_recv}`);

        if (data_recv.type == 'get_data') {
            console.log('echo back to client')
            ws.send(`${data}`);
        } else if (data_recv.type == 'get_image') {
            console.log('send image to client');
            try {
                // get newest file and, read and send as object
                // let newestFile = getFileNewest(imgDir, '.jpg');
                let sortedFiles = getFilesSorted(imgDir, '.jpg');
                let mtime_s, newestFile
                [mtime_s, newestFile] = sortedFiles[0];
                let img_data = fs.readFileSync(newestFile);
                console.log(`newest image: ${newestFile}  ; size: ${img_data.length} ; mtime_s: ${mtime_s}`);
                ws.send(img_data);
              } catch (err) {
                console.error(err);
              }
        } else {
            console.log(`data type: ${data_recv.type} will not be processed`);
        }
    });

    ws.onerror = function () {console.log('websocket error')};
});