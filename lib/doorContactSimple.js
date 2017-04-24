"use strict";

let inputPin = 7;
var gpio = require('rpi-gpio');
var readline = require("readline");
gpio.setup(inputPin, gpio.DIR_IN, readInput);

function readInput() {
    gpio.read(inputPin, function (err, value) {
        if (err) throw err;
        console.log('The value is ', value);
    });
}

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//windows handler for crtl-c
rl.on("SIGINT", function () {
    process.emit("SIGINT");
});

console.log("Press enter to run gpio read.  When you are done press ctrl + c...");

rl.on('line', function (input) {
    console.log("Reading...");
    readInput();
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