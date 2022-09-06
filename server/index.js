const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { stringify } = require("querystring");

const app = express();
const demandFile = path.join(__dirname, "demand.json");
const occupancyFile = path.join(__dirname, "occupancy.json");

// posting support
app.use(express.urlencoded({ extended: true }));

app.get("/demand", async (req, res) => {
    let demandData = JSON.parse(await fs.readFile(demandFile, "utf-8"));
    const totalDemand = Object.values(demandData.demand).reduce((totalDemand, n) => totalDemand += n, 0);

    demandData = Object.entries(demandData.demand).map(([label, value]) => {
        return {
            label,
            value
        }
    })

    console.log(demandData);
    res.end();
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
    let splitRes = split(req.body.add);
    const occupancyType = splitRes[0];
    const unitNumber = splitRes[1];

    if(occupancyType == "storage") {

        occupancyData.storage[unitNumber]++;
        
    } else if (occupancyType == "parking") {

        occupancyData.parking[unitNumber]++;

    } else {

        console.log("The occupancy type was neither storage or parking. Please enter a valid POST");

    }
    // occupancyData["storage.5x5u"]++;

    await fs.writeFile(occupancyFile, JSON.stringify(occupancyData));

    res.end();

})

app.listen(3000, () => console.log("The server is now running."))

function split(s) {
    return s.split(".");
}