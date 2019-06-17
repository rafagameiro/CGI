var gl;
var canvas;
var program;
var modelView;
var projection
var mModelViewLoc;
var mProjLoc;
var aspect;

function initMatrixes() {
    
   projection = ortho(-2*aspect,2*aspect, -2, 2,-10,10);
   modelView = lookAt([1,0.5,1], [0,0,0], [0,1,0]);
}

function fit_canvas_to_window()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    aspect = canvas.width / canvas.height;
    gl.viewport(0, 0,canvas.width, canvas.height);

}

window.onresize = function () {
    fit_canvas_to_window();
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    sphereInit(gl);
    
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    mProjLoc = gl.getUniformLocation(program, "mProjection");
    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    
    initMatrixes();
    render();
    
}
/*
function drawPrimitive() {
	if(primitives == 1) 
		if(filled) cubeDrawFilled(gl, program);
		else cubeDrawWireFrame(gl, program);
	else if(primitives == 2) 
		if(filled) sphereDrawFilled(gl, program);
		else sphereDrawWireFrame(gl, program);
	else if(primitives == 3)
		if(filled) cylinderDrawFilled(gl, program);
		else cylinderDrawWireFrame(gl, program);
	else
		if(filled) bunnyDrawFilled(gl, program);
		else bunnyDrawWireFrame(gl, program);
}
*/
function multipleView() {	
	
	gl.viewport(0,0,canvas.width/2, canvas.height/2);
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(projection));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
	sphereDrawWireFrame(gl, program);
	
	gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(projection));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
	sphereDrawWireFrame(gl, program);
	
	gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(projection));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
	sphereDrawWireFrame(gl, program);
	
	gl.viewport(canvas.width/2,canvas.height/2,canvas.width/2, canvas.height/2);	
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(projection));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
	sphereDrawWireFrame(gl, program);
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	multipleView();
	
	requestAnimFrame(render);
}
