window.onload = function(){
  var start = 0;
  var animation;
  var W;
  var H;
  var canvas;

  canvas = document.createElement("canvas");
  canvas.id = "canvas"
  canvas.style.position = "absolute";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.zIndex = "10000";
  canvas.style.pointerEvents = "none";

  //make canvas
  function make_canvas(){
    var body = document.body;
    var html = document.documentElement;
  
    W = parseInt(window.innerWidth) - 17;
    H = Math.max(body.scrollHeight, body.offsetHeight, 
                     html.clientHeight, html.scrollHeight, html.offsetHeight);
    canvas.width = W;
    canvas.height = H;
  }
  
  make_canvas();
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var mp = 500; //max snowflakes
  var particles = [];

  for(var i=0; i<mp; i++){
    particles.push({
      x: Math.random()*W, //x-coord
      y: Math.random()*H, //y-coord
      r: Math.random()*4+1, //radius
      d: Math.random()*mp //falling speed
    })
  }
  
  //listen for browser action click
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if( request.message == "clicked_browser_action" ) {
      start++;
      start = start%2;
      
      //toggle animation
      if(start == 1){
        animation = setInterval(draw, 33);
      }
      else{
        clearInterval(animation);
        ctx.clearRect(0,0,W,H);
      }
    }
  });

  //updating function to animate
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();

      for(var i=0; i<mp; i++){
        var p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);			
      }
      ctx.fill();
      snow();
    }

  var angle = 0;
  //updates snow coordinates
  function snow(){
    angle += 0.01;
    for (var i=0; i<mp; i++){
      var p = particles[i];
      p.x += Math.sin(angle)*2.5;
      p.y += Math.cos(angle+p.d) + 1 + p.r/2;

      if(p.x>W+5 || p.x<-5 || p.y>H){
        if (i%3 > 0){
        particles[i] = {x: Math.random()*W,	y: -10, r: p.r, d: p.d};
        }
        else{
          //exit from right
          if (Math.sin(angle) > 0) particles[i] = {x: -5,	y: Math.random()*H, r: p.r, d: p.d};
          //exit from left
          else particles[i] = {x: W+5,	y: Math.random()*H, r: p.r, d: p.d};
        }
      }
    }
  }
}
//Icons made by Freepik from www.flaticon.com 
