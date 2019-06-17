var gl;
var dx;
var dy;
var dragging;
var lastX;
var lastY;
var aux1 = 0;
var aux2 = 0;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    // Three vertices
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
    
    var dxLoc = gl.getUniformLocation(program, "dx");
    var dyLoc = gl.getUniformLocation(program, "dy");

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();
    
	canvas.onmousedown = function (event)
	{
		lastX = event.clientX;
		lastY = event.clientY;
		dragging = true;
	}

	canvas.onmouseup = function (event)
	{
		dragging = false;
		aux1 = dx;
		aux2 = dy;
	}
	
	canvas.onmousemove = function (event)
	{
		if(dragging) {
			dx = (-(event.clientX - lastX))/canvas.width + aux1;
			dy = (event.clientY - lastY)/canvas.height + aux2;
			console.log("dx " + dx);
			console.log("dy " + dy);
			gl.uniform1f(dxLoc, dx);
			gl.uniform1f(dyLoc, dy);
		}
	}
	
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
