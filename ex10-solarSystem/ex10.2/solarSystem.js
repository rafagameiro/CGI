var canvas;
var gl;
var program;

var aspect;
var mProjectionLoc, mModelViewLoc;

var matrixStack = [];
var modelView;
var time;

// Stack related operations
function pushMatrix() {
    var m =  mat4(modelView[0], modelView[1],
           modelView[2], modelView[3]);
    matrixStack.push(m);
}
function popMatrix() {
    modelView = matrixStack.pop();
}
// Append transformations to modelView
function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}
function multScale(s) { 
    modelView = mult(modelView, scalem(s)); 
}
function multRotationX(angle) {
    modelView = mult(modelView, rotateX(angle));
}
function multRotationY(angle) {
    modelView = mult(modelView, rotateY(angle));
}
function multRotationZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
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

window.onload = function() {
    canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(document.getElementById('gl-canvas'));
    fit_canvas_to_window();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, 'default-vertex', 'default-fragment');

    gl.useProgram(program);

    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");

    sphereInit(gl);
	time = 0.1;
	
    render();
}

const PLANET_SCALE = 10;
const ORBIT_SCALE = 1/60;

const SUN_DIAMETER = 1391900;
const SUN_DAY = 24.47; // At the equator. The poles are slower as the sun is gaseous

const MERCURY_DIAMETER = 4866*PLANET_SCALE;
const MERCURY_ORBIT = 57950000*ORBIT_SCALE;
const MERCURY_YEAR = 87.97;
const MERCURY_DAY = 58.646;

const VENUS_DIAMETER = 12106*PLANET_SCALE;
const VENUS_ORBIT = 108110000*ORBIT_SCALE;
const VENUS_YEAR = 224.70;
const VENUS_DAY = 243.018;

const EARTH_DIAMETER = 12742*PLANET_SCALE;
const EARTH_ORBIT = 149570000*ORBIT_SCALE;
const EARTH_YEAR = 365.26;
const EARTH_DAY = 0.99726968;

const MOON_DIAMETER = 3474*PLANET_SCALE;
const MOON_ORBIT = 363396*ORBIT_SCALE;
const MOON_YEAR = 28;
const MOON_DAY = 0;

const MARS_DIAMETER = 6760*PLANET_SCALE;
const MARS_ORBIT = 227840000*ORBIT_SCALE;
const MARS_YEAR = 365.26;
const MARS_DAY = 0.99726968;

const JUPITER_DIAMETER = 142984*PLANET_SCALE;
const JUPITER_ORBIT = 778140000*ORBIT_SCALE;
const JUPITER_YEAR = 365.26;
const JUPITER_DAY = 0.99726968;

const SATURN_DIAMETER = 116438*PLANET_SCALE;
const SATURN_ORBIT = 1427000000*ORBIT_SCALE;
const SATURN_YEAR = 365.26;
const SATURN_DAY = 0.99726968;

const URANUS_DIAMETER = 46940*PLANET_SCALE;
const URANUS_ORBIT = 2870300000*ORBIT_SCALE;
const URANUS_YEAR = 365.26;
const URANUS_DAY = 0.99726968;

const NEPTUNE_DIAMETER = 45432*PLANET_SCALE;
const NEPTUNE_ORBIT = 4499900000*ORBIT_SCALE;
const NEPTUNE_YEAR = 365.26;
const NEPTUNE_DAY = 0.99726968;

const PLUTO_DIAMETER = 2274*PLANET_SCALE;
const PLUTO_ORBIT = 5913000000*ORBIT_SCALE;
const PLUTO_YEAR = 365.26;
const PLUTO_DAY = 0.99726968;

const VP_DISTANCE = SATURN_ORBIT;

function sphereWireframe() {
	sphereDrawWireFrame(gl, program);
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView));
}

function Pluto() {
	multScale([PLUTO_DIAMETER, PLUTO_DIAMETER, PLUTO_DIAMETER]);
	multRotationY(time*360.0/PLUTO_DAY);
	
	sphereWireframe();
}

function Neptune() {
	multScale([NEPTUNE_DIAMETER, NEPTUNE_DIAMETER, NEPTUNE_DIAMETER]);
	multRotationY(time*360.0/NEPTUNE_DAY);
	
	sphereWireframe();
}

function Uranus() {
	multScale([URANUS_DIAMETER, URANUS_DIAMETER, URANUS_DIAMETER]);
	multRotationY(time*360.0/URANUS_DAY);
	
	sphereWireframe();
}

function Saturn() {
	multScale([SATURN_DIAMETER, SATURN_DIAMETER, SATURN_DIAMETER]);
	multRotationY(time*360.0/SATURN_DAY);
	
	sphereWireframe();
}

function Jupiter() {
	multScale([JUPITER_DIAMETER, JUPITER_DIAMETER, JUPITER_DIAMETER]);
	multRotationY(time*360.0/JUPITER_DAY);
	
	sphereWireframe();
}

function Mars() {
	multScale([MARS_DIAMETER, MARS_DIAMETER, MARS_DIAMETER]);
	multRotationY(time*360.0/MARS_DAY);
	
	sphereWireframe();
}

function EarthAndMoon() {
	pushMatrix();
		multScale([EARTH_DIAMETER, EARTH_DIAMETER, EARTH_DIAMETER]);
		multRotationY(time/EARTH_DAY);
		sphereWireframe();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/MOON_YEAR);
		multTranslation(vec3(EARTH_DIAMETER+MOON_ORBIT, 0.0, 0.0));
		multScale([MOON_DIAMETER, MOON_DIAMETER, MOON_DIAMETER]);
		multRotationY(MOON_DAY);
		sphereWireframe();
	popMatrix();
}

function Venus() {
	multScale([VENUS_DIAMETER, VENUS_DIAMETER, VENUS_DIAMETER]);
	multRotationY(time*360.0/VENUS_DAY);
	
	sphereWireframe();
}

function Mercury() {
	multScale([MERCURY_DIAMETER, MERCURY_DIAMETER, MERCURY_DIAMETER]);
	multRotationY(time*360.0/MERCURY_DAY);
	
	sphereWireframe();
}

function Sun() {
	multScale([SUN_DIAMETER, SUN_DIAMETER, SUN_DIAMETER]);
	multRotationY(time*360.0/SUN_DAY);
	
	sphereWireframe();
}

function SolarSystem() {
	pushMatrix();
		Sun();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/MERCURY_YEAR);
		multTranslation(vec3(MERCURY_ORBIT, 0.0, 0.0));
		Mercury();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/VENUS_YEAR);
		multTranslation(vec3(VENUS_ORBIT, 0.0, 0.0));
		Mercury();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/EARTH_YEAR);
		multTranslation(vec3(EARTH_ORBIT, 0.0, 0.0));
		EarthAndMoon();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/MARS_YEAR);
		multTranslation(vec3(MARS_ORBIT, 0.0, 0.0));
		Mars();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/JUPITER_YEAR);
		multTranslation(vec3(JUPITER_ORBIT, 0.0, 0.0));
		Jupiter();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/SATURN_YEAR);
		multTranslation(vec3(SATURN_ORBIT, 0.0, 0.0));
		Saturn();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/URANUS_YEAR);
		multTranslation(vec3(URANUS_ORBIT, 0.0, 0.0));
		Uranus();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/NEPTUNE_YEAR);
		multTranslation(vec3(NEPTUNE_ORBIT, 0.0, 0.0));
		Neptune();
	popMatrix();
	pushMatrix();
		multRotationY(time*360.0/PLUTO_YEAR);
		multTranslation(vec3(PLUTO_ORBIT, 0.0, 0.0));
		Pluto	();
	popMatrix();
}

function render() 
{
    requestAnimationFrame(render);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projection = ortho(-VP_DISTANCE*aspect,VP_DISTANCE*aspect, -VP_DISTANCE, VP_DISTANCE,-3*VP_DISTANCE,3*VP_DISTANCE);
    
    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(projection));

    modelView = lookAt([0,VP_DISTANCE,VP_DISTANCE], [0,0,0], [0,1,0]);
    
	SolarSystem();
	    
	time += 0.1;
}
