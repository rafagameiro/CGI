var gl;
var Tx;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    // Three vertices
    var vertices = [
        vec2(-0.3,-0.3),
        vec2(0.3,-0.3),
        vec2(0.3,0.3)
    ];
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW); 
	
    Tx = -1.4;
	drawScene();
}
    
function drawScene() {
    
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    var uniVar = gl.getUniformLocation(program, "uniVar");   // get pointer to variable
    
	gl.uniform4f(uniVar, Tx, 0.0, 0.0, 0.0);
    	
	// Associate our shader variables with our data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	
	Tx += 0.01;
	if(Tx > 1.4)
		Tx = -1.4;

	requestAnimationFrame(drawScene);
}
