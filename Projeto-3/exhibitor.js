var canvas;
var gl;
var program;

var aspect;
var mProjectionLoc, mModelViewLoc, texLoc, optLoc;
var texture;

var matrixStack = [];
var modelView;
var option;
var filled;
var mappingType;
var rotationY = 1.0;
var translateY = 0.2;
var boolDrawFilled = false;

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

/**
 * Operations dedicated to the buttons in the program
 */
function eventListeners() {
	
	var newCube = document.getElementById("cube");
	var newSphere = document.getElementById("sphere");
	var newCylinder = document.getElementById("cylinder");

	var wireframeView = document.getElementById("wireFrame");
	var filledView = document.getElementById("filled");
	var textures = document.getElementById("texture");
	
	var orthoTex = document.getElementById("orthoTex");
	var spheTex = document.getElementById("sphericalTex");
	var cylinTex = document.getElementById("cylindricalTex");
	
	var startTex = false;
	
	/**
	 * After pressing a key, this function will be called
	 * if the code 65 (key 'a') was selected, the object will rotate to the left
	 * if the code 68 (key 'd') was selected, the object will rotate to the right
	 * if the code 68 (key 'w') was selected, the object will go up
	 * if the code 68 (key 's') was selected, the object will go down
	 */
	window.addEventListener("keydown", function(event) {
		switch(event.keyCode) {
			case 65: rotationY -= 1.0;
				break; 
			case 87: if(translateY < 0.5) translateY += 0.01;
				break; 
			case 68: rotationY += 1.0;
				break; 
			case 83: if(translateY > 0.0) translateY -= 0.01;
				break;
		}
	}); 
	
	/**
	 * Changes to wireframe view.
	 */
	wireframeView.onclick = function() {
		filled = 0;
		startText = false;
		boolDrawFilled = false;
	}
	
	/**
	 * Changes to filled view.
	 */
	filledView.onclick = function() {
		filled = 0;
		startText = false;
		boolDrawFilled = true;
	}
	
	/**
	 * Changes to filled view, now with texture applied
	 */
	textures.onclick = function() {
		startText = true;
		filled = 1;
		boolDrawFilled = true;
	}
	
	/**
	 * Changes to orthogonal texture
	 */
	orthoTex.onclick = function() {
		if(startText) {
			filled = 1;
			mappingType = 0;
		}
	}
	
	/**
	 * Changes to cylindrical texture
	 */
	cylinTex.onclick = function() {
		if(startText) {
			filled = 1;
			mappingType = 1;
		}
	}
	
	/**
	 * Changes to spherical texture
	 */
	spheTex.onclick = function() {
		if(startText) {
			filled = 1;
			mappingType = 2;		
		}
	}
	
	/**
	 * Changes to the object sphere
	 */
	newSphere.onclick = function() { 
		option = 0;
	}
	
	/**
	 * Changes to the object cube
	 */
	newCube.onclick = function() {
		option = 1; 
	}
	
	/**
	 * Changes to the object cylinder
	 */
	newCylinder.onclick = function() {
		option = 2;
	}
}

/**
 * Creates an initial texture (color blue)
 * After that, loads an image
 * During the image loading, the image will be mapped into the texture
 */
function setupTexture() {
	texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
	
	var image = new Image();
	image.src = "texture/image.jpg";
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
	};

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
    setupTexture();

    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    mProjectionLoc = gl.getUniformLocation(program, "mProjection");
    texLoc = gl.getUniformLocation(program, "texOpt");
    optLoc = gl.getUniformLocation(program, "option");

    sphereInit(gl);
    cubeInit(gl);
    cylinderInit(gl);
	option = 0;
	filled = 0;
	mappingType = 0;
	
	eventListeners();
    render();
}

/**
 * function that will draw wireframe of the choosen object
 * @param {*} opt will be the option to draw or the "View" or the "Texture"
 */
function objectWireframe(opt){

    gl.uniformMatrix4fv(mModelViewLoc, false , flatten(modelView));
    gl.uniform1i(optLoc, opt);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    
    if(option == 0)
        sphereDrawWireFrame(gl, program);
    else if(option == 1)
        cubeDrawWireFrame(gl, program);
    else 
        cylinderDrawWireFrame(gl, program);
}

/**
 * function that will draw filled of the choosen object
 * @param {*} opt will be the option to draw or the "View" or the "Texture"
 */
function objectDrawFilled(opt){

    gl.uniformMatrix4fv(mModelViewLoc, false , flatten(modelView));
    gl.uniform1i(optLoc, opt);
    
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    
    if(option == 0)
        sphereDrawFilled(gl, program);
    else if(option == 1)
        cubeDrawFilled(gl, program);
    else
        cylinderDrawFilled(gl, program);

}

/**
 * 
 * choose between wireframe or drawfilled
 * @param {*} x will be the object to be drawn
 * @param {*} opt will be the option to draw or the "View" or the "Texture"
 * 
 */
function chooseOption(x, opt){
	option = x;
    if(!boolDrawFilled) {
        objectWireframe(opt);
    }
    else {
        objectDrawFilled(opt);
    } 
}

/**
 * scene graph
 */
function drawExhibitor(){
    var selected = option;
    pushMatrix();
        multRotationY(rotationY);
        multTranslation([0.0,-1.5,0.0]);
    pushMatrix();
    //cylinder
        multScale([1.2,0.1,1.2]);
        chooseOption(2, 0);
    popMatrix();    
        multTranslation([0.0,0.3,0.0]);
    pushMatrix();
    //cube
        multScale([0.2,0.5,0.2]);
        chooseOption(1, 0);
    popMatrix();
        multTranslation([0.0,translateY,0.0]);
    pushMatrix();
    //cube
        multScale([0.1,0.5,0.1]);
        chooseOption(1, 0);
    popMatrix();
        multTranslation([0.0,0.3,0.0]);
    pushMatrix();
    //cube
        multScale([1.1,0.1,1.1]);
        chooseOption(1, 0);
    popMatrix();
    //sphere or cube or cylinder
        multTranslation([0.0,0.55,0.0]);
        chooseOption(selected, filled);
    popMatrix(); 

    option = selected;
}

function render() 
{
    requestAnimationFrame(render);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projection = ortho(-2*aspect,2*aspect, -2, 2,-10,10);
    
    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(projection));

    modelView = lookAt([1,0.5,1], [0,0,0], [0,1,0]);
    
    gl.uniform1i(texLoc, mappingType);
	drawExhibitor();
	  
}
