const request = require('request');
const cheerio  = require('cheerio');
let url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/rajasthan-royals-vs-chennai-super-kings-37th-match-1359511/full-scorecard";
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
    let winteam = "";
    let teamsArr = $(".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-2");
    for (let i = 0; i < teamsArr.length; i++){
        let hasclass = $(teamsArr[i]).hasClass('ds-opacity-50');
        if(hasclass == false){
            let teamNameElem = $(teamsArr[i]).find(".ds-text-tight-l.ds-font-bold.ds-text-typo");
            winteam = teamNameElem.text()
            // console.log(winteam);
        }
    }
    let iningsArr = $(".ds-rounded-lg.ds-mt-2");

    for( let j = 0; j < iningsArr.length; j++){
        let teamElem = $(iningsArr[j]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize");
        let teamtable = $(iningsArr[j]).find("table")
        let hwtName = "";
        let hwt = 0;
        if (winteam === teamElem.text()){
            let bolerElem = $(teamtable[1]).find("tbody tr")
            for(let k = 0; k<bolerElem.length; k++){
                let hasclass = $(bolerElem[k]).hasClass('ds-hidden');
                if(hasclass == false){
                    let colElem = $(bolerElem[k]).find('td')
                    let playerName = $(colElem[0]).text()
                    let wickets = $(colElem[4]).text()
                    if(wickets>=hwt){
                        hwtName = playerName;
                        hwt = wickets;
                    }
                }
            }
            console.log(`Winning Team: ${winteam} Player Name: ${hwtName}, Wickets: ${hwt}`);
            // console.log(teamElem.text());
        }
    }
    
    // console.log(iningsArr.length);
}