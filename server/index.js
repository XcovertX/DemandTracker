const express = require("express");
const fs = require("fs").promises;
const path = require("path");

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

    console.log(maxStorageOccupancy);
    console.log(maxParkingOccupancy);

    console.log(storageOccupancyData);
    console.log(parkingOccupancyData);
    console.log(maxStorageOccupancyData);
    console.log(maxParkingOccupancyData);

    res.end();
});

app.listen(3000, () => console.log("The server is now running."))