const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { stringify } = require("querystring");

const app = express();
const demandFile = path.join(__dirname, "demand.json");
const occupancyFile = path.join(__dirname, "occupancy.json");
const waitlistFile = path.join(__dirname, "waitlist.json")

// posting support
app.use(express.urlencoded({ extended: true }));

// enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})

app.get("/demand", async (req, res) => {
    // message("madeit");
    let demandData = JSON.parse(await fs.readFile(demandFile, "utf-8"));
    let waitlistData = JSON.parse(await fs.readFile(waitlistFile, "utf-8"));
    const totalDemand = Object.values(demandData.demand).reduce((totalDemand, n) => totalDemand += n, 0);

    demandData = Object.entries(demandData.demand).map(([label, value]) => {
        return {
            label,
            value
        }
    })

    console.log(demandData);
    res.json(demandData);
});

app.get("/waitlist", async (req, res) => {
    let waitlistData = JSON.parse(await fs.readFile(waitlistFile, "utf-8"));

    console.log(waitlistData);
    res.json(waitlistData);
});

app.get("/occupancy", async (req, res) => {
    let occupancyData = JSON.parse(await fs.readFile(occupancyFile, "utf-8"));

    const storageOccupancy = Object.values(occupancyData.storage)
        .reduce((maxStorageOccupancy, n) => maxStorageOccupancy += n, 0);

    const parkingOccupancy = Object.values(occupancyData.parking)
        .reduce((maxParkingOccupancy, n) => maxParkingOccupancy += n, 0);
    
    const maxStorageOccupancy = Object.values(occupancyData.storageMax)
    .reduce((maxStorageOccupancy, n) => maxStorageOccupancy += n, 0);

    const maxParkingOccupancy = Object.values(occupancyData.parkingMax)
        .reduce((maxParkingOccupancy, n) => maxParkingOccupancy += n, 0);

    const storageOccupancyData = Object.entries(occupancyData.storage).map(([unitSize, count]) => {
        return {
            unitSize,
            count
        }
    });

    const parkingOccupancyData = Object.entries(occupancyData.parking).map(([unitSize, count]) => {
        return {
            unitSize,
            count
        }
    });

    const maxStorageOccupancyData = Object.entries(occupancyData.storageMax).map(([unitSize, count]) => {
        return {
            unitSize,
            count
        }
    });

    const maxParkingOccupancyData = Object.entries(occupancyData.parkingMax).map(([unitSize, count]) => {
        return {
            unitSize,
            count
        }
    });

    res.json(parkingOccupancyData);
});

app.post("/occupancy", async (req, res) => {

    let occupancyData = JSON.parse(await fs.readFile(occupancyFile, "utf-8"));
    let demandData = JSON.parse(await fs.readFile(demandFile, "utf-8"));

    const reqBody = Object.entries(req.body).map(([name, value]) => {
        return {
            name,
            value
        }
    });

    for (let i = 0; i < reqBody.length; i++) {

        if(reqBody[i].name == "add") {
            let splitRes = split(reqBody[i].value);
            const occupancyType = splitRes[0];
            const unitNumber = splitRes[1];

            if(occupancyType == "storage") {

                occupancyData.storage[unitNumber]++;
                demandData["storageMoveIn"]++;
                await fs.writeFile(occupancyFile, JSON.stringify(occupancyData));
                await fs.writeFile(demandFile, JSON.stringify(demandData));
                
            } else if (occupancyType == "parking") {

                occupancyData.parking[unitNumber]++;
                demandData["parkingMoveIn"]++;
                await fs.writeFile(occupancyFile, JSON.stringify(occupancyData));
                await fs.writeFile(demandFile, JSON.stringify(demandData));

            } else {

                console.log("The occupancy type was neither storage or parking: " + occupancyType);
            }

        } else if(reqBody[i].name == "subtract") {

            let splitRes = split(reqBody[i].value);
            const occupancyType = splitRes[0];
            const unitNumber = splitRes[1];

            if(occupancyType == "storage") {

                occupancyData.storage[unitNumber]--;
                demandData["storageMoveOut"]++;
                await fs.writeFile(occupancyFile, JSON.stringify(occupancyData));
                await fs.writeFile(demandFile, JSON.stringify(demandData));
                
            } else if (occupancyType == "parking") {

                occupancyData.parking[unitNumber]--;
                demandData["parkingMoveOut"]++;
                await fs.writeFile(occupancyFile, JSON.stringify(occupancyData));
                await fs.writeFile(demandFile, JSON.stringify(demandData));

            } else {

                console.log("The occupancy type was neither storage or parking: " + occupancyType);
            }
        
        } else {

            console.log("request body contains a name other than 'add' or 'subtract': " + reqBody[i].name);
        }
        res.end();
    }
})

app.post("/demand", async (req, res) => {

    let demandData = JSON.parse(await fs.readFile(demandFile, "utf-8"));

    const reqBody = Object.entries(req.body).map(([name, value]) => {
        return {
            name,
            value
        }
    });

    const instruction = reqBody[0].name;
    const demandType  = reqBody[0].value;

    if(instruction == "add" || instruction == "subtract") {

        if(isValidDemandType(demandType)){

            if(instruction == "add"){

                demandData.demand[demandType]++;
                await fs.writeFile(demandFile, JSON.stringify(demandData));
                console.log("Added demand to " + reqBody.value);

            } else if (instruction == "subtract") {

                demandData.demand[demandType]--;
                await fs.writeFile(demandFile, JSON.stringify(demandData));
                console.log("Subtracted demand from " + demandType);

            } else {

                console.log(demandType + " is not a demand type. Please enter a valid demand POST");
            }

        } else {

            console.log(reqBody.value + " is not a known damand type.")
        }

    } else if( instruction == "changeDate" ) {

        if(demandData.month == 12) {

            demandData.month = 1;
            demandData.year++;

        } else {

            demandData.month++;
        }
        await fs.writeFile(demandFile, JSON.stringify(demandData));
        console.log("The new month/year is: " + demandData.month + "/" + demandData.year);

    }
    res.end();
})

app.listen(3000, () => console.log("The server is now running."))

function split(s) {
    return s.split(".");
}

function isValidDemandType(reqDemand) {
    return (
        reqDemand == "webform"  ||
        reqDemand == "call"     ||
        reqDemand == "referral" ||
        reqDemand == "driveBy"  ||
        reqDemand == "loyaly"
    )
}