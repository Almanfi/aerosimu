setTimeout(function initialize () {
  place_holder = document.querySelector("#place-holder");
  line   = document.querySelector("div.line.bg-blue");
  map    = document.querySelector("div.map");
  loc    = document.querySelector("div.loc");
  plane_div  =  document.querySelector("div.plane");
  indicatorX  =  document.querySelector("div.indicatorX");
  loc_freq  =  document.querySelector("div.loc-freq > input")
  

  auto_landing_Btn  =  document.querySelector("div.auto_landing > div");
  

  document.addEventListener("keydown", keyboard);

  auto_landing_ON = true;
  loc_scope (800);
  onMap.km_rem(5);
  onMap.placeXY (map,plane.position.x,plane.position.y)
  onMap.rotate ( plane_div, plane.angle.phi)
  update_indicator (18)
  set_loc_freq (109.7);


  coordinate = {
    plane : {
      elem : place_holder,
      x : 0,
      y : 0,
      z : 0,
      x0 : 0,
      y0 : 0,
      z0 : 0,
    },
    loc : {
      elem : loc,
      x : 0,
      y : 460.7,
      z : 0,
      x0 : 0,
      y0 : 1,
      z0 : 0,
    },
    gp : {
      elem : place_holder,
      x : 0,
      y : 0,
      z : 0,
      x0 : 0,
      y0 : 0,
      z0 : 0,
    }
  }


//positioning
  for (const prop in coordinate) {
    var elem = coordinate[prop].elem;
    var x = coordinate[prop].x;
    var y = coordinate[prop].y;
    var x0 = coordinate[prop].x0;
    var y0 = coordinate[prop].y0;

    onMap.placeXY0 (elem,x,y,x0,y0)
  }

}, 500);


function init () {

  plane = {
    position : {
        x : 20,
        y : 200,
        z : 0
    },
    angle : {
        phi : 10,
        theta : 0,
        alpha : 0
    },
    speed : 0.05,
    fuel : 0.5,
    alert : false,
    max_phi : 1,
    max_theta : 1,
    turn_left(angle)  {
      plane.angle.phi -= angle;
        return plane.angle.phi
    },
    turn_right(angle)  {
      plane.angle.phi += angle;
      console.log(plane.angle.phi)
        return plane.angle.phi
    },
    moving () {
      var r = plane.speed * step_time
      if (-plane.position.y < stop_point) {
        dx = Math.sin(plane.angle.phi*Math.PI/180) * r;
        dy = Math.cos(plane.angle.phi*Math.PI/180) * r;
      }
      if (-plane.position.y < stop_point) {
        plane.position.y -= dy;
        plane.position.x -= dx;
        onMap.rotate(plane_div,plane.angle.phi)
      }
    },
    auto_landing () {
      currentX = plane.position.x;
      var angle_per_speed = 0.75;
      let distanceX = lastX - currentX;
      if (-plane.position.x < 0) {
      //   if (-plane.position.x < -15) {
      //     console.log("it is ");
      //   }else if (-plane.position.x < -10) {
      //     console.log("it is 2");
      //   }else if (-plane.position.x < -5) {
      //   console.log("it is 3");
      // }
        if (plane.angle.phi> 1) {
            plane.turn_left(angle_per_speed * plane.speed);
            console.log("hey1 ",plane.angle.phi,-plane.position.x )
        }else if (plane.angle.phi > -2 & (-plane.position.x) > 3){
          plane.angle.phi /= 1.2;
          console.log("hey3 ",plane.angle.phi,-plane.position.x )
        }
      }else {
        if (plane.angle.phi< -2) {
            plane.turn_right(angle_per_speed * plane.speed);
            console.log("hey2 ",plane.angle.phi)
        }else if (plane.angle.phi < 2 & (-plane.position.x) < 3){
          plane.angle.phi /= 1.2;
          console.log("hey4 ",plane.angle.phi,-plane.position.x )
        }
      }
      if (Math.abs(plane.angle.phi) < 0.001) plane.angle.phi = 0;
      lastX = currentX;
    }
}
  ms = 0;
  distance = plane.position.y;
  max_time = 120000;
  speed = 0.05;
  ang = 0 ;
  i =0, j=0;
  step_time = 16.66;
  contact_point = 80;
  stop_point = 323;
  max_speed = plane.speed;
  

  final_speed = 0.005;

  X = plane.position.x;
  

lastX = plane.position.x+1;
currentX = plane.position.x;
}

init ();

function keyboard (event) {
  if (event.code === "ArrowLeft")
  {
      console.log("left")
      plane.turn_left(0.1);
      event.preventDefault();
  }
  if (event.code === "ArrowRight")
  {
      console.log("right")
      plane.turn_right(0.1)
      event.preventDefault();
  }
  onMap.placeXY (map,plane.position.x,plane.position.y)
  onMap.rotate ( plane_div , plane.angle.phi)
  update_indicator (18)
}


function toggleAutoLanding() {
  if (!auto_landing_ON) {
    auto_landing_ON = true;
    auto_landing_Btn.style.backgroundColor = "green"

  } else {
    auto_landing_ON = false;
    auto_landing_Btn.style.backgroundColor = "brown";
  }
}

function loc_scope (height) {
  var triangle_up = document.querySelector("div.triangle-up");
  var triangle_1 = document.querySelector("div.tria1");
  var triangle_2 = document.querySelector("div.tria2");


  loc.style.height = height+"rem";
  triangle_up.style.borderLeft = (height/20) + "rem solid transparent";
  triangle_up.style.borderRight = (height/20) + "rem solid transparent";
  triangle_2.style.borderLeft = (height/20) + "rem solid transparent";
  triangle_2.style.borderRight = (height/20) + "rem solid transparent";

  triangle_1.style.borderBottom = height + "rem solid rgb(0, 162, 255)";
  triangle_2.style.borderBottom = height + "rem solid rgb(0, 255, 115)";
}

var X;

function auto_landing () {

  if ( (-plane.position.y  < contact_point) & auto_landing_ON & loc_captured) {
    
    if (plane.position.x) {
      
      y_to_contact = plane.position.y + contact_point;
      plane.position.x = X * (Math.exp(-ms/(y_to_contact * 30)))
      
    }

    if (-stop_point-plane.position.y < 0){
      
      phi_rad = Math.atan(plane.position.x/(Math.abs(-stop_point-plane.position.y)))
      plane.angle.phi = phi_rad*180/Math.PI;
    }else{
      plane.angle.phi = 0; 
    }
  }
}

function update_indicator (X_max) {
  if (plane.position.x > X_max) {
    indicatorX.style.display = "none";
  }else{
    indicatorX_pos = plane.position.x*9/X_max

    indicatorX.style.display = "";
    indicatorX.style.transform = "translateX("+ indicatorX_pos +"vh)"
  }

}

function set_loc_freq (freq) {

  if (loc_freq.value == freq) {
    loc.style.display = "";
    loc_captured = true;
  } else {
    loc.style.display = "none";
    loc_captured = false;
  }
}

var onMap = {
  
  km_rem (km) {
    document.documentElement.style.fontSize = 32/km+"px"
  },
  px_rem (px) {
      var rem_unit = getComputedStyle(document.body).fontSize;
      var rem = px/parseInt(rem_unit);
      return rem;
  },
  
  
  size_rem (elem) {
      var width = elem.getBoundingClientRect().width;
      var height = elem.getBoundingClientRect().height;
      
      return size = {
        height : onMap.px_rem (height),
        width : onMap.px_rem (width),
      }
  },
  
  placeXY0 (elem,x,y,x0,y0) {
    size_elem = onMap.size_rem (elem);
    x_pos = x - x0*(size_elem.width)/2;
    y_pos = y - y0*(size_elem.height)/2;
    elem.style.position = "relative";
    elem.style.left = x_pos + "rem";
    elem.style.top = -y_pos + "rem";
  },
  placeXY (elem,x,y) {
    size_elem = onMap.size_rem (elem);
    x_pos = x ;
    y_pos = y ;
    // x_pos = x - (size_elem.width)/2;
    // y_pos = y - (size_elem.height)/2;
    elem.style.position = "relative";
    elem.style.left = x_pos + "rem";
    elem.style.top = -y_pos + "rem";
  },
  pplaceXY (elem,x,y) {
    x_pos = x ;
    y_pos = y ;
    var parent = elem.parentElement
    parent.style.left = 50 + x_pos/2 + "%";
    parent.style.top = 50 - y_pos + "%";
  },
  rotate (elem,deg) {
    elem.style.transform = "rotate("+deg+"deg)"
  },
} 

var plane;
var coordinate;
var toggle = false;
var auto_landing_ON = true;
var loc_captured = true;
let start, previousTimeStamp;
var ms, distance;
var max_time;
var speed;
var ang;
var i, j;
var step_time;
var dx;
var contact_point;
var stop_point;
var max_speed;
var indicatorX_pos = 9;
var lastX;
var currentX;

var SPEED_ON_CONTACT, TIME_OF_CONTACT, slow_factor, slow_rate ;
var final_speed;


function plane_slowing (final_speed) {
  let slow_speed;
  if (plane.speed > final_speed) {
    
    if (SPEED_ON_CONTACT === undefined) {
      SPEED_ON_CONTACT = plane.speed;
      TIME_OF_CONTACT = ms;
      slow_factor = 10;
      slow_rate = Math.log(slow_factor*SPEED_ON_CONTACT/0.01) + 1;
    }
  
    let t = (ms - TIME_OF_CONTACT)/step_time
    let x = t/slow_rate;
    
    slow_speed = SPEED_ON_CONTACT * (1 + 0.0145*x - 0.003475*x*x + 0.0000885*x*x*x  - 0.000000655*x*x*x*x ) + final_speed;
  } else {
    slow_speed = final_speed;
  }
  console.log(slow_speed+ " **" + final_speed)
  return slow_speed;
}

function plane_landing (stop_point, contact_point , speed) {
  if (-plane.position.y < contact_point) {
    dx = speed * step_time

  }else{
    if (-plane.position.y < stop_point) {
      
      plane.speed = plane_slowing (final_speed);
      

      dx = plane.speed * step_time


    }else{
      console.log("stoped  " + plane.position.y )
    }
  }
  if (-plane.position.y < stop_point) {

    plane.position.y -= dx;
    
  }
}

function anim () {

  set_loc_freq (109.7);
  update_indicator (18);
  
  // auto_landing (auto_landing_ON);
  
  // plane_landing (stop_point, contact_point , plane.speed);
  plane.moving();
  plane.auto_landing();
  // console.log(plane.position.x)

  onMap.placeXY (map,plane.position.x,plane.position.y)
  onMap.rotate ( plane_div, plane.angle.phi)
}
function step(timestamp) {

  if (previousTimeStamp !== timestamp) {
    i++;
    if (i >1) {
      
      if (timestamp - previousTimeStamp < 100) { step_time = timestamp - previousTimeStamp } // prevent step_time growing case of stoping animation
      // console.log(step_time)
      ms = i * step_time
    }
    anim();
  }
  if (ms < max_time) { // Stop the animation after -max_time- (ms)
    previousTimeStamp = timestamp;
    stopId = window.requestAnimationFrame(step);
  }
}
function toggleAnimation(timestamp) {
  console.log("hey");
  if (!toggle) {
    toggle = true;
    window.requestAnimationFrame(step);
    
  } else {
    toggle = false;
    cancelAnimationFrame(stopId);
    X = plane.position.x;

  }
}
