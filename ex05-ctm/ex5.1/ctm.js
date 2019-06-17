var gl;
var m;
var matrixes;
var numOfM;
var ctmLoc;

function buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue) {
	matrixes[numOfM] = mult(translate(tXValue, tYValue, 0.0), mult(rotateZ(rZValue), scalem(sXValue, sYValue, 1.0)));
}

function eventListeners(ctmLoc) {
	var tXValue = 0.0;
	var tYValue = 0.0;
	var sXValue = 1.0;
	var sYValue = 1.0;
	var rZValue = 0.0;
	
	var Tx = document.getElementById("Tx");
	var Ty = document.getElementById("Ty");
	var Sx = document.getElementById("Sx");
	var Sy = document.getElementById("Sy");
	var Rz = document.getElementById("Rz");
	
	Tx.oninput = function() {
		tXValue = Tx.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Ty.oninput = function() {
		tYValue = Ty.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Sx.oninput = function() {
		sXValue = Sx.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Sy.oninput = function() {
		sYValue = Sy.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Rz.oninput = function() {
		rZValue = Rz.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	var newObj = document.getElementById("newBtn");
	
	newObj.onclick = function() {
		matrixes[++numOfM] = m; 
		tXValue = 0.0;tYValue = 0.0;sXValue = 1.0;
		sYValue = 1.0;rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue;
		Sx.value = sXValue; Sy.value = sYValue;
		Rz.value = rZValue;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
}

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    // Three vertices
    var vertices = [
        vec2(-0.5,-0.5),
        vec2(0.5,-0.5),
        vec2(0,0.5)
    ];
    m = mat4();
    matrixes = [];
    numOfM = 0;
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    
    matrixes[numOfM] = m;
    ctmLoc = gl.getUniformLocation(program, "ctm");

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();
    
    eventListeners(ctmLoc);
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	for(var i = 0; i < numOfM+1; i++) {
		gl.uniformMatrix4fv(ctmLoc, false, flatten(matrixes[i]));
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
    requestAnimationFrame(render);
}
