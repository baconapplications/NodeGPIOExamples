//sample to drive a relay
let gpio = require('rpi-gpio');
var readline = require("readline");
let outPin = 15;
let writeVal = true;
let isReady = false;

//read line to catch any key :-)
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//windows handler for crtl-c
rl.on("SIGINT", function () {
    process.emit("SIGINT");
});

//set up as on to start
gpio.setup(outPin, gpio.DIR_HIGH, ()=> {
    console.log("set up complete");
    isReady = true;
});

//writer function
function write() {
    gpio.write(outPin, writeVal, function(err) {
        if (err) throw err;
        console.log("Writing...");
    });
}

rl.on('line', function (input) {    
    if(!isReady) {
        console.log("Waiting for set up...");
    } else {
        writeVal = !writeVal;
        write();
    }
});

//clean up - unexport all pins
function closePins(callback) {
    gpio.destroy(function() {
        console.log('All pins unexported');
        if(callback)
            callback();
    });
}

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");

    console.log("Closing pins");

    closePins(()=> {
        console.log("Exiting...");
        process.exit();        
    });
});