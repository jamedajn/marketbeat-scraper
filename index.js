import puppeteer from 'puppeteer';
const stocks = ["NVDA", "AAPL", "GOOG", "MSFT", "NFLX", "GOOGL"]
const wait = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
Number.prototype.zeroPad = function() {
  return ('0'+this).slice(-2);
};
(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  var result = {};
  for(let stock of stocks) {
  const page = await browser.newPage();

  await page.goto(`https://www.marketbeat.com/stocks/NASDAQ/${stock}/`);
  await page.waitForSelector('div dt');
  var data = await page.evaluate(`[...document.querySelectorAll("div dt")].find(type => type.innerHTML == "Last Earnings").nextElementSibling.textContent`);
  data = `${data.split("/")[0]}/${Number(Number(data.split("/")[1])+1).zeroPad()}/${data.split("/")[2]}`
  const historicalPage = await browser.newPage();
  await historicalPage.setViewport({
    width: 980,
    height: 1240,
    deviceScaleFactor: 2
  });
  await historicalPage.goto(`https://www.marketbeat.com/stocks/NASDAQ/${stock}/price-target/`)
  await historicalPage.waitForSelector('.top-label-wrapper input');
  await historicalPage.evaluate(`document.getElementById("cphPrimaryContent_cphTabContent_txtRatingStartDate").value = "${data}" `)
  await historicalPage.evaluate("__doPostBack('ctl00$ctl00$cphPrimaryContent$cphTabContent$txtRatingStartDate')")
  await wait(1000)
  const all = await historicalPage.evaluate(`[...document.querySelector("table#history-table tbody").childNodes].map(element => element?.childNodes[5]?.innerHTML)`);
  const filter = all.filter(e => e.length > 0).map(e => e.includes("➝") ? e.split("➝ ")[1].slice(1) : e.slice(1))
  result[stock] = {
    "MATP": "$" + Number(median(filter)).toFixed(2),
    "MBP": "$" + Number(median(filter) * 0.8695).toFixed(2)
  }
//  await historicalPage.screenshot({ path: 'example.png', fullPage: true, omitBackground: true });
}
  await browser.close();
  console.log(result)
})();

function median(arr){
    arr.sort((a, b) => { return a - b; });
    var i = arr.length / 2;
    return i % 1 == 0 ? (Number(arr[i - 1]) + Number(arr[i])) / 2 : arr[Math.floor(i)];
}
