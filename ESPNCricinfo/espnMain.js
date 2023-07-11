const url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038";
const baseURL = "https://www.espncricinfo.com";
const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const allMatch = require("./AllMatch")


const iplPath = path.join(__dirname, "ipl")
dirCreater(iplPath);

request(url, cb);
function cb(err, res, html){
    if(err){
        console.log(err);
    }else{
        extractLink(html);
    }
}

function extractLink(html){
    let $ = cheerio.load(html);

    let anchorElem = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2 a");
    let link = anchorElem.attr("href");
    let fullLink = baseURL + link
    allMatch.GAML(fullLink);
}

function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}