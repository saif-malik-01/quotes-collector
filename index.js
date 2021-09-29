const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");

let PORT = process.env.PORT || 5000;

async function get() {
  const { data } = await axios.get("https://api.hamatim.com/quote");
  fs.readFile("./quotes.json", "utf-8", (err, storeData) => {
    if (err) console.log(err);
    add(data, storeData);
  });
}

function add(data, storeData) {
  if (data.book == null) {
    console.log("book null");
    return;
  }
 
  if (storeData) {
    storeData = JSON.parse(storeData);
    if (storeData.find((d) => d.text == data.text)) {
      return;
    } else {
      let { text, author, book } = data;
      storeData.push({ text, author, book });
      fs.writeFile("./quotes.json", JSON.stringify(storeData), () => {
        console.log("done");
      });
    }
  } else {
    let { text, author, book } = data;
    fs.writeFile("./quotes.json", JSON.stringify([{ text, author, book }]), () => {
      console.log("first");
    });
  }
}

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(PORT, () => {
  console.log(`running at port ${PORT}`);
});

setInterval(get, 5000);
