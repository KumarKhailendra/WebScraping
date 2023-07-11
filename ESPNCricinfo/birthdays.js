const request = require("request");
const cheerio = require("cheerio");
let url =
  "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/rajasthan-royals-vs-chennai-super-kings-37th-match-1359511/full-scorecard";
request(url, cb);
function cb(error, res, body) {
  if (error) {
    console.log(error);
  } else {
    extractHTML(body);
  }
}
function extractHTML(body) {
  let $ = cheerio.load(body);
  let iningsArr = $(".ds-rounded-lg.ds-mt-2");

  for (let i = 0; i < iningsArr.length; i++) {
    let teamElem = $(iningsArr[i]).find(
      ".ds-text-title-xs.ds-font-bold.ds-capitalize"
    );
    let teamName = teamElem.text();
    teamName = teamName.trim();

    let teamtable = $(iningsArr[i]).find(
      ".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table"
    );

    let betElem = $(teamtable).find("tr");

    let hiddenclass = $(betElem).hasClass("ds-hidden");

    if (hiddenclass == false) {
      for (let j = 0; j < betElem.length; j++) {
        let colElem = $(betElem[j]).find("td");
        let nullcheck = $(colElem[0]).text();
        if (nullcheck != "") {
          let playerName = $(colElem[0]).text();
          console.log(`Team Name: ${teamName} Player Name: ${playerName}`);
        }
    }
    console.log($(colElem).text());
    }

    // console.log(iningsArr.length);
    // console.log($(iningsArr[i]).html());
  }
}
