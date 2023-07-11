const request = require("request");
const cheerio = require("cheerio");
const baseURL = "https://www.espncricinfo.com";
const scorecard = require("./scorecard")

function getAllMatchLink(url){
    request(url, function (err, res, html){
        if(err){
            console.log(err);
        }else{
            extractAllLink(html);
        }
    })
}
// 
function extractAllLink(html){
    let $ = cheerio.load(html);
    let scorecardElems = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent a.ds-no-tap-higlight");
    for(let i = 0; i < scorecardElems.length; i++){
        let link = $(scorecardElems[i]).attr("href");
        let fullLink = baseURL + link
        // console.log(fullLink)
        scorecard.ps(fullLink);
    }
}

module.exports = {GAML:getAllMatchLink}