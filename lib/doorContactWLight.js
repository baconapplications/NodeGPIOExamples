//NOTE: for web app make sure to add executer to gpio group to run rpi-gpio without root
let gpio = require('rpi-gpio');
var readline = require("readline");
let lightPin = 22;
let switchPin = 7;
let writeVal = false;
let isReady = false;
let doorState = null;

//pin set up
gpio.setup(switchPin, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(lightPin, gpio.DIR_LOW, ()=> {
    console.log("set up complete");
    isReady = true;
    onReady();
});

//e handler for pin change
gpio.on('change', function(channel, value) {
    if(channel === switchPin) {
        setDoorState(value);
    } else {
        console.log('Channel ' + channel + ' value is now ' + value);
    }
});

//helper to set the door state
function setDoorState(state) {
    if(state != doorState) {
        doorState = state;
        console.log('Door is now ' + doorStateText());
        //check for door open and turn on light
        setLightState(doorState);
    }
}

function doorStateText() {
    if(doorState)
        return "OPEN";
    return "CLOSED";
}

function setLightState(state) {
    gpio.write(lightPin, state, function(err) {
        if (err) throw err;
    });
}

//fire this on ready
function onReady() {
    gpio.read(switchPin, function (err, value) {
        if (err) throw err;
        setDoorState(value);
    });
}