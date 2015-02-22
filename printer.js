
var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['B']);

var writehead = 1;
var rotatehead = 2;

var wheel1 = 3;
var wheel2 = 4;

//Speeds
var BACK_SPEED = 0.9;
var STOP_SPEED = 0.439;

var servoready = false;
var rot_angle = 0;

var state = "dw";
var data_pos = 0;

var data = [    [0,1,1,1,1,1,1,0], 
                [1,0,0,0,0,0,0,1],
                [1,0,1,0,0,1,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,1,0,0,1,0,1],
                [1,0,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,1],
                [0,1,1,1,1,1,1,0],
                ];
var n = data[0].length;
var inc_angle = 120/n/180;

//Angles
var REST_ANGLE = 0.8;
var WRITE_ANGLE = 0.88

servo.on('ready', function () {
    servo.configure(writehead, 0.00, 0.12, function () {
        servo.move(rotatehead, rot_angle);
        servo.move(writehead, REST_ANGLE);
        servo.move(wheel1, STOP_SPEED);
        servo.move(wheel2, STOP_SPEED);
        Print2D();
    });
});

function justTimeout(time) {
    setTimeout(function() {
        console.log("Finished! ");
    }, time*1000);
}

function Write() {
    servo.move(writehead, WRITE_ANGLE);
}

function StopWrite() {
    servo.move(writehead, REST_ANGLE);
}

function Rotate() {
    servo.move(rotatehead, rot_angle + inc_angle);
    rot_angle += inc_angle;
}

function RotateOtherWay() {
    servo.move(rotatehead, rot_angle - inc_angle);
    rot_angle -= inc_angle;
}

function ResetRotate() {
    rot_angle = 0;
    servo.move(rotatehead, rot_angle);
}

function PrintLine(j) {
    var i = 0;
    var interval_id = setInterval(function () {
        if(i<n) {
            if(data[j][i] === 1) {
                WriteAndReset();
            }
            setTimeout(function() {
                Rotate();
            }, 150);
        } else {
            setTimeout(function() {
                ResetRotate();
                MoveBackwards();
                justTimeout(2);
            }, 500);
            clearInterval(interval_id);
        }
        i++;
    }, 300);
}

function MoveBackwards() {
    console.log("Moving backwards!");
    servo.move(wheel1, BACK_SPEED);
    servo.move(wheel2, BACK_SPEED);
    setTimeout(function(){
        console.log("Attempting Stop -_- ");
        servo.move(wheel1, STOP_SPEED);
        servo.move(wheel2, STOP_SPEED);
    },700);
}

function Print2D() {
    var j = 1;
    PrintLine(0);
    var interval_id = setInterval(function () {
        if(j < data.length) {
            PrintLine(j);
            j++;
        } else {
            clearInterval(interval_id);
        }
    }, n*500 + 1000);
}

function WriteAndReset() {
    setTimeout(function() {
        console.log("Writing!!");
        Write();
        setTimeout(function() {
            console.log("Reset!");
            StopWrite();
        }, 50);
    }, 50);    
}

