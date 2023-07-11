const request = require('request');
const cheerio  = require('cheerio');
let url = "https://www.espncricinfo.com/series/australia-in-india-2022-23-1348637/india-vs-australia-4th-test-1348655/live-cricket-score";
request(url, cb);
function cb(error, res, body){
    if(error){
        console.log(error);
    }else{
        extractHTML(body);
    }
}
function extractHTML(body){
    let $ = cheerio.load(body);
    let elemsArr = $(".ds-ml-4 .ci-html-content");
    let text = $(elemsArr[0]).text();
    console.log(text);
}