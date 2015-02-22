
var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['D']);

var writehead = 1;
var rotatehead = 2;
var servoready = false;
var rot_angle = 0;
var n = 10;
var inc_angle = 120/n/180;
var state = "dw";
var data_pos = 0;

var data = [1,0,1,0,1,1,1,0,0,1];

servo.on('ready', function () {
    servo.configure(writehead, 0.00, 0.12, function () {
        servo.move(rotatehead, rot_angle);
        servo.move(writehead, 0.75);
        PrintLine();
    });
    
});

function justTimeout(time) {
    setTimeout(function() {
        console.log("Finished! ");
    }, time*1000);
}

function Write() {
    servo.move(writehead, 0.8);
}

function StopWrite() {
    servo.move(writehead, 0.75);
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

function PrintLine() {
    var i = 0;
    var interval_id = setInterval(function () {
        if(i<n) {
            if(data[i] === 1) {
                WriteAndReset();
            }
            setTimeout(function() {
                Rotate();
            }, 100);
        } else {
            setTimeout(function() {
                ResetRotate();
                justTimeout(2);
            }, 300);
            clearInterval(interval_id);
        }
        i++;
    }, 500);
}

function Print2D() {
    var j = 0;
    var interval_id = setInterval(function () {

    }, n*500);
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

