const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData=require("./data.js");

main().then((res) => {
    console.log("connection successful");
})
    .catch((e) => {
        console.log(e);
    })

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((ele)=>{
        ele.owner="66a3d7c625eee637de8e0540";
        return ele;
    });
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDB();