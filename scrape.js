//packages
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const url =
  "https://www.amazon.de/-/en/Apple-MacBook-Air-chip-inch/dp/B08N5R7XXZ/ref=sr_1_2?crid=HEWBT7BSNREX&keywords=mac+air&qid=1660559359&sprefix=mac+air%2Caps%2C106&sr=8-2";
const product = { name: "", price: "", link: "" };

//Set interval
const handle = setInterval(scrape, 8000);

async function scrape() {
  //fetch the data
  const { data } = await axios.get(url);
  //load up the html
  const $ = cheerio.load(data);
  const item = $("div#dp-container");
  //extract the data that we need
  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole ")
    .first()
    .text()
    .replace(/[,.]/g, "");
  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);
  //send a sms

  if (priceNum < 1000) {
    client.messages
      .create({
        body: `The price of ${product.name}went below ${price}. Buy it now? 
         ${product.link}`,
        from: "+19804992190",
        to: "+4746514038",
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
  }
}

scrape();
