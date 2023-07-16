const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const bikes = require('./data/data.json');

const server = http.createServer(async (req, res) => {
    // console.log('server is now running');
    // console.log(req.url);
    if(req.url === '/favicon.ico')return;
    // console.log(req.headers);


    const myURL = new URL(req.url, `http://${req.headers.host}/`);
    const pathname = myURL.pathname;
    const id = myURL.searchParams.get('id');
    // console.log(pathname,id); 
    console.log(req.url);
    if (pathname === '/') {

        let html = await fs.readFile('./view/bike.html', 'utf-8');
        const AllMainBikes = await fs.readFile('./view/main/bmain.html', 'utf-8');

        let allTheBikes = '';
        for (let index = 0; index < 6; index++){
             allTheBikes += replaceTemplate(AllMainBikes,bikes[index]);
        }
        html = html.replace(/<%AllMainBikes%>/g, allTheBikes);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);


    } else if (pathname === '/bike' && id >= 0 && id <= 5) {

        let html = await fs.readFile('./view/overview.html', 'utf-8');

        const bike = bikes.find((b) => b.id === id);
          
        html = replaceTemplate(html,bike);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);

    } else if (/\.(png)$/i.test(req.url)) {
        const image = await fs.readFile(`./public/images/${req.url.slice(1)}`);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(image);

    }
    else if (/\.(css)$/i.test(req.url)) {
        const css = await fs.readFile(`./public/css/style.css`);
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(css);

    }
    else if (/\.(svg)$/i.test(req.url)) {
        const svg = await fs.readFile(`./public/images/icons.svg`);
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.end(svg);

    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<div><h1> FILE NOT FOUND</h1></div>')
    }


});

server.listen(3000);

function replaceTemplate(html,bike){
    html = html.replace(/<%IMAGE%>/g, bike.image);
         html = html.replace(/<%NAME%>/g, bike.name);

         let price = bike.originalPrice;
         if(bike.hasDiscount){
              price = (price *(100 - bike.discount)) / 100;
         }
         html = html.replace(/<%NEWPRICE%>/g, `$${price}.00`);
         html = html.replace(/<%OLDPRICE%>/g, `$${bike.originalPrice}`);
         html = html.replace(/<%ID%>/g, bike.id);

         if(bike.hasDiscount){
              html = html.replace(/<%DISCOUNTRATE%>/g, `<div class="discount__rate"><p>${bike.discount}% Off</p></div>`);
         } else{

              html = html.replace(/<%DISCOUNTRATE%>/g, ``);
        } 


        for(let index = 0; index < bike.star; index++ ){
          html = html.replace(/<%START%>/, 'checked');
        }
        html = html.replace(/<%START%>/g, '');


         return html;
}