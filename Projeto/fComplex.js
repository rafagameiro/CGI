// Rafael Gameiro nº 50677
// Rui Santos nº 50833

var gl;
var dragging;
var lastX;
var lastY;
var aux;
var zoom;

/**
 * all event listeners associated with canvas
 * the first enables dragging, and defines the values associated with the end of translation
 * the second disables dragging and saves the current position in canvas
 * the third one performs the drag operation, only when dragging is enabled
 * the last, in case of window resize, it will adjust the canvas in order to keep the figure normal
 */
function canvasFunc(canvas, centerLoc, fixLoc) {
	aux = [0, 0];
	var dx, dy;
	    
	canvas.onmousedown = function (event) {
		lastX = event.clientX;
		lastY = event.clientY;
		dragging = true;
	}

	canvas.onmouseup = function (event) {
		dragging = false;
		aux[0] = dx;
		aux[1] = dy;
	}
	
	canvas.onmousemove = function (event) {
		if(dragging) {
			dx = (((-(event.clientX - lastX))/canvas.width) * zoom) + aux[0];
			dy = (((event.clientY - lastY)/canvas.height) * zoom) + aux[1];
			gl.uniform2f(centerLoc, dx, dy);
		}
	}
	
	window.onresize = function(){
		var height = window.innerHeight;
		var width = window.innerWidth;
		canvas.height =  height;
		canvas.width = width;
		gl.viewport(0 , 0 , canvas.width ,canvas.height );
		fix = width / height;
		gl.uniform1f(fixLoc , fix);
	};
	
}

/**
 * Couple of events associated with operations that interact with canvas
 * add event listeners to buttons, so then when you press then you can change the iteration value
 * add event listeners to select elements, allowing you to select the desired function
 * add an event listener that will zoom in or out the current function in canvas
 */
function eventListeners(centerLoc, funcLoc, scaleLoc, nLoc) {
	var value = 1;
	var btnAdd = document.getElementById("btn1");
	var btnSub = document.getElementById("btn2");
	var select = document.getElementById("funcSelect");
		
	
	btnAdd.addEventListener("click", function(){
		if(value < 30) {
			value++;
			gl.uniform1i(nLoc, value);
			document.getElementById("field").innerHTML = value;
		}
	}); 
	
	btnSub.addEventListener("click", function(){
		if(value > 1) {
			value--;
			gl.uniform1i(nLoc, value);
			document.getElementById("field").innerHTML = value;
		}
	});
	
	select.addEventListener("change", function(){
		var option = document.getElementById("funcSelect").value;
		switch(option) {
			case "f0": gl.uniform1i(funcLoc, 1);
				break;
			case "f1": gl.uniform1i(funcLoc, 2);
				break;
			case "f2": gl.uniform1i(funcLoc, 3);
				break;
			case "f3": gl.uniform1i(funcLoc, 4);
				break;
			case "f4": gl.uniform1i(funcLoc, 5);
				break;
			case "f5": gl.uniform1i(funcLoc, 6);
				break;
			case "f6": gl.uniform1i(funcLoc, 7);
				break;
			case "f7": gl.uniform1i(funcLoc, 8);
				break;
				
		}
		gl.uniform2f(centerLoc, 0.0, 0.0);
		aux = [0, 0];
		gl.uniform1i(nLoc, 1);
		value = 1;
		zoom = 1.0;
		gl.uniform1f(scaleLoc, zoom);
		document.getElementById("field").innerHTML = value;
	});
	 
	window.addEventListener("keypress", function(event){	
		switch(event.keyCode) {
			case 38: zoom /= 1.1;
				break; 
			case 40: zoom *= 1.1;
				break;
		}
		gl.uniform1f(scaleLoc, zoom);
	}); 
	  
}

/**
 * function that will generate the canvas and create its objects,
 * allowing the normal operation of the program
 */
window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    var vertices = [
        vec2(-1.0,1.0),
        vec2(-1.0,-1.0),
        vec2(1.0,1.0),
        vec2(1.0,-1.0)
    ];
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    // creates local variables to the uniform variables in vertex and fragment shaders
    var centerLoc = gl.getUniformLocation(program, "center");
    var funcLoc = gl.getUniformLocation(program, "func");
    var scaleLoc = gl.getUniformLocation(program, "scale");
    var nLoc = gl.getUniformLocation(program, "n");
    var fixLoc = gl.getUniformLocation(program, "fix");
   
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();
    
    zoom = 1.0;
    canvasFunc(canvas, centerLoc, fixLoc);
    eventListeners(centerLoc, funcLoc, scaleLoc, nLoc);
    
    //initializes the program with the first function and normal scale
	gl.uniform1i(funcLoc, 1);
	gl.uniform1f(scaleLoc, 1.0);
	gl.uniform1f(fixLoc , 1.0);
}

/**
 * generates the image and after that keep generating it,
 * so then you can apply dragging zoom and even change between functions
 */
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
