var gl;
var program;
var m;
var transforms;
var primitives;
var numOfM;
var mModelLoc;

function buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue) {
	var rotation = [sXValue, sYValue, sZValue];
	transforms[numOfM] = mult(translate(tXValue, tYValue, tZValue), mult(rotateX(rXValue), mult(rotateY(rYValue), mult(rotateZ(rZValue), scalem(sXValue, sYValue, sZValue)))));
}

function eventListeners(ctmLoc) {
	var tXValue = 0.0;
	var tYValue = 0.0;
	var tZValue = 0.0;
	var sXValue = 1.0;
	var sYValue = 1.0;
	var sZValue = 1.0;
	var rXValue = 0.0;
	var rYValue = 0.0;
	var rZValue = 0.0;
	
	var Tx = document.getElementById("Tx");
	var Ty = document.getElementById("Ty");
	var Tz = document.getElementById("Tz");
	var Sx = document.getElementById("Sx");
	var Sy = document.getElementById("Sy");
	var Sz = document.getElementById("Sz");
	var Rx = document.getElementById("Rx");
	var Ry = document.getElementById("Ry");
	var Rz = document.getElementById("Rz");
	
	Tx.oninput = function() {
		tXValue = Tx.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Ty.oninput = function() {
		tYValue = Ty.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Tz.oninput = function() {
		tZValue = Tz.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Sx.oninput = function() {
		sXValue = Sx.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Sy.oninput = function() {
		sYValue = Sy.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Sz.oninput = function() {
		sZValue = Sz.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Rx.oninput = function() {
		rXValue = Rx.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Ry.oninput = function() {
		rYValue = Ry.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	Rz.oninput = function() {
		rZValue = Rz.value;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	var reset = document.getElementById("resetBtn");
	
	reset.onclick = function() {
		transforms = [];
		primitives = [];
		lastTransform = [];
		numOfM = 0;
		transforms[numOfM] = m;
		primitives[numOfM] = "Cb";
		tXValue = 0.0; tYValue = 0.0; tZValue = 0.0;
		sXValue = 1.0; sYValue = 1.0; sZValue = 1.0;
		rXValue = 0.0; rYValue = 0.0; rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue; Tz.value = tZValue;
		Sx.value = sXValue; Sy.value = sYValue; Sz.value = sZValue;
		Rx.value = rXValue; Ry.value = rYValue; Rz.value = rZValue;
	}
	
	var transformReset = document.getElementById("transformBtn");
	
	transformReset.onclick = function() {
		transforms[numOfM] = m;
		tXValue = 0.0; tYValue = 0.0; tZValue = 0.0;
		sXValue = 1.0; sYValue = 1.0; sZValue = 1.0;
		rXValue = 0.0; rYValue = 0.0; rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue; Tz.value = tZValue;
		Sx.value = sXValue; Sy.value = sYValue; Sz.value = sZValue;
		Rx.value = rXValue; Ry.value = rYValue; Rz.value = rZValue;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	var newCube = document.getElementById("newCube");
	
	newCube.onclick = function() {
		transforms[++numOfM] = m; 
		primitives[numOfM] = "Cb"; 
		tXValue = 0.0; tYValue = 0.0; tZValue = 0.0;
		sXValue = 1.0; sYValue = 1.0; sZValue = 1.0;
		rXValue = 0.0; rYValue = 0.0; rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue; Tz.value = tZValue;
		Sx.value = sXValue; Sy.value = sYValue; Sz.value = sZValue;
		Rx.value = rXValue; Ry.value = rYValue; Rz.value = rZValue;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	var newSphere = document.getElementById("newSphere");
	
	newSphere.onclick = function() {
		transforms[++numOfM] = m; 
		primitives[numOfM] = "S"; 
		tXValue = 0.0; tYValue = 0.0; tZValue = 0.0;
		sXValue = 1.0; sYValue = 1.0; sZValue = 1.0;
		rXValue = 0.0; rYValue = 0.0; rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue; Tz.value = tZValue;
		Sx.value = sXValue; Sy.value = sYValue; Sz.value = sZValue;
		Rx.value = rXValue; Ry.value = rYValue; Rz.value = rZValue;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
	
	var newCylinder = document.getElementById("newCylinder");
	
	newCylinder.onclick = function() {
		transforms[++numOfM] = m; 
		primitives[numOfM] = "Cd"; 
		tXValue = 0.0; tYValue = 0.0; tZValue = 0.0;
		sXValue = 1.0; sYValue = 1.0; sZValue = 1.0;
		rXValue = 0.0; rYValue = 0.0; rZValue = 0.0;
		Tx.value = tXValue; Ty.value = tYValue; Tz.value = tZValue;
		Sx.value = sXValue; Sy.value = sYValue; Sz.value = sZValue;
		Rx.value = rXValue; Ry.value = rYValue; Rz.value = rZValue;
		buildCTM(tXValue, tYValue, tZValue, sXValue, sYValue, sZValue, rXValue, rYValue, rZValue);
	}
}

function initMatrixes(mProjLoc, mViewLoc) {
	var at = [0, 0, 0];
    var eye = [1, 1, 1];
    var up = [0, 1, 0];
    var mView = lookAt(eye, at, up);
    var mProjection = ortho(-2,2,-2,2,10,-10);
	gl.uniformMatrix4fv(mViewLoc, false, flatten(mView));
	gl.uniformMatrix4fv(mProjLoc, false, flatten(mProjection));
}

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    m = mat4();
    transforms = [];
    primitives = [];
    numOfM = 0;
    
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    
    transforms[numOfM] = m;
    primitives[numOfM] = "Cb";
    mProjLoc = gl.getUniformLocation(program, "mProjection");
    mViewLoc = gl.getUniformLocation(program, "mView");
    mModelLoc = gl.getUniformLocation(program, "mModel");
    
    initMatrixes(mProjLoc, mViewLoc);
    render();
    
    eventListeners(mModelLoc);
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	for(var i = 0; i < numOfM+1; i++) {
		gl.uniformMatrix4fv(mModelLoc, false, flatten(transforms[i]));
		if(primitives[i] == "Cb")
			cubeDrawWireFrame(gl, program);
		else if(primitives[i] == "S")
			sphereDrawWireFrame(gl, program);
		else
			cylinderDrawWireFrame(gl, program);
	}
    requestAnimationFrame(render);
}
