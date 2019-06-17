var gl;
var num;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    // Three vertices
    var vertices = [
        vec2(0.0,0.0), vec2(0.1,0.0), vec2(0.1,0.1), //
        vec2(0.0,-0.8), vec2(0.1,-0.8), vec2(0.1,-0.7), //
        vec2(-0.5,0.0), vec2(-0.6,0.0), vec2(-0.6,0.1), //
        vec2(0.0,0.2), vec2(0.1,0.2), vec2(0.1,0.3), //
        vec2(0.0,-0.5), vec2(0.1,-0.5), vec2(0.1,-0.4), //
        vec2(-0.3,0.0), vec2(-0.4,0.0), vec2(-0.4,0.1), //
        vec2(0.3,0.0), vec2(0.4,0.0), vec2(0.4,0.1), //
        vec2(0.6,0.0), vec2(0.7,0.0), vec2(0.7,0.1), //
        vec2(-0.5,0.5), vec2(-0.6,0.5), vec2(-0.6,0.6), //
        vec2(-0.7,0.7), vec2(-0.8,0.7), vec2(-0.8,0.8), //
        vec2(0.5,0.5), vec2(0.6,0.5), vec2(0.6,0.6), //
        vec2(0.7,0.8), vec2(0.8,0.8), vec2(0.7,0.9), //
        vec2(-0.5,-0.6), vec2(-0.6,-0.6), vec2(-0.6,-0.7), //
        vec2(-0.8,-0.8), vec2(-0.9,-0.8), vec2(-0.9,-0.9), //
        vec2(0.3,-0.5), vec2(0.4,-0.5), vec2(0.4,-0.4), //
        vec2(0.6,-0.7), vec2(0.6,-0.7), vec2(0.7,-0.7), //
        vec2(0.8,-0.8), vec2(0.9,-0.8), vec2(0.9,-0.9), //
        vec2(0.7,-0.6), vec2(0.8,-0.6), vec2(0.7,-0.5), //
        vec2(-0.3,0.0), vec2(-0.4,0.0), vec2(-0.4,0.1), //
        vec2(-0.2,-0.2), vec2(-0.3,-0.2), vec2(-0.3,-0.3), //
        vec2(-0.7,-0.2), vec2(-0.8,-0.2), vec2(-0.8,-0.1), //
        vec2(-0.1,0.6), vec2(-0.2,0.6), vec2(-0.1,0.7), //
        vec2(0.3,0.7), vec2(0.4,0.7), vec2(0.4,0.6), //
    ];
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    num = 0;
    drawTriangles();
}
    
function drawTriangles() {
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    
    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, num, 3);
    
    num += 3;
    if(num == 69)
		num = 0;
	requestAnimationFrame(drawTriangles);	
	
}
