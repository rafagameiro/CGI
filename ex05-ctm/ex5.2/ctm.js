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
	var lastTransform = [];
	
	var Tx = document.getElementById("Tx");
	var Ty = document.getElementById("Ty");
	var Sx = document.getElementById("Sx");
	var Sy = document.getElementById("Sy");
	var Rz = document.getElementById("Rz");
	
	Tx.oninput = function() {
		lastTransform[0] = "Tx";
		lastTransform[1] = 0.0;
		tXValue = Tx.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Ty.oninput = function() {
		lastTransform[0] = "Ty";
		lastTransform[1] = 0.0;
		tYValue = Ty.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Sx.oninput = function() {
		lastTransform[0] = "Sx";
		lastTransform[1] = 1.0;
		sXValue = Sx.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Sy.oninput = function() {
		lastTransform[0] = "Sy";
		lastTransform[1] = 1.0;
		sYValue = Sy.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	Rz.oninput = function() {
		lastTransform[0] = "Rz";
		lastTransform[1] = 0.0;
		rZValue = Rz.value;
		buildCTM(tXValue, tYValue, sXValue, sYValue, rZValue);
	}
	
	var reset = document.getElementById("resetBtn");
	
	reset.onclick = function() {
		matrixes = [];
		numOfM = 0;
		matrixes[numOfM] = m;
		tXValue = 0.0;tYValue = 0.0;sXValue = 1.0;
		sYValue = 1.0;rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue;
		Sx.value = sXValue; Sy.value = sYValue;
		Rz.value = rZValue;
		lastTransform = [];
	}
	
	var transformReset = document.getElementById("transformBtn");
	
	transformReset.onclick = function() {
		switch(lastTransform[0]) {
			case "Tx": buildCTM(lastTransform[1], tYValue, sXValue, sYValue, rZValue);
					   Tx.value = lastTransform[1]; break;
			case "Ty": buildCTM(tXValue, lastTransform[1], sXValue, sYValue, rZValue);
					   Ty.value = lastTransform[1];	break;
			case "Sx": buildCTM(tXValue, tYValue, lastTransform[1], sYValue, rZValue);
					   Sx.value = lastTransform[1];	break;
			case "Sy": buildCTM(tXValue, tYValue, sXValue, lastTransform[1], rZValue);
					   Sy.value = lastTransform[1];	break;
			case "Rz": buildCTM(tXValue, tYValue, sXValue, sYValue, lastTransform[1]);
					   Rz.value = lastTransform[1];	break;
		}
	}
	
	var newObj = document.getElementById("newBtn");
	
	newObj.onclick = function() {
		matrixes[++numOfM] = m; 
		tXValue = 0.0;tYValue = 0.0;sXValue = 1.0;
		sYValue = 1.0;rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue;
		Sx.value = sXValue; Sy.value = sYValue;
		Rz.value = rZValue;
		lastTransform = [];
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
