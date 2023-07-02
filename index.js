import puppeteer from 'puppeteer';
const stock = "AAPL"
const wait = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
(async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();

  await page.goto(`https://www.marketbeat.com/stocks/NASDAQ/${stock}/`);
  await page.waitForSelector('div dt');
  const data = await page.evaluate(`[...document.querySelectorAll("div dt")].find(type => type.innerHTML == "Last Earnings").nextElementSibling.textContent`);
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
  await wait(3000)
  const all = await historicalPage.evaluate(`[...document.querySelector("table#history-table tbody").childNodes].map(element => element?.childNodes[5]?.innerHTML)`);
  const filter = all.filter(e => e.length > 0).map(e => e.includes("➝") ? e.split("➝ ")[1].slice(1) : e.slice(1))
  console.log(median(filter), filter)
  await historicalPage.screenshot({ path: 'example.png', fullPage: true, omitBackground: true });
  await browser.close();
})();

function median(arr){
    arr.sort((a, b) => { return a - b; });
    var i = arr.length / 2;
    return i % 1 == 0 ? (Number(arr[i - 1]) + Number(arr[i])) / 2 : arr[Math.floor(i)];
}
