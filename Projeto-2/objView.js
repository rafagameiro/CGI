var gl;
var canvas;
var program;
var viewSingle;
var filled;
var modelView;
var mProj;
var mPerspective; 
var mModelViewLoc;
var mProjLoc;
var scale; 

/**
 * Change radians to degrees.
 */
function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

/**
 * Cabinet projection
 * Creates the oblique projection matrix.
 * The parameter l starts with value = 0.5 
 * The parameter alpha starts with value = 45.0
 * Both parameter can change during the user interaction.
 */
function obliqueProj(l, alpha) {
	var oblique = mat4(
		vec4( 1.0, 0.0, -l * Math.cos(radians(alpha)), 0.0 ),
		vec4( 0.0, 1.0, -l * Math.sin(radians(alpha)), 0.0 ),
		vec4(0.0, 0.0, 0.0, 0.0),
		vec4(0.0, 0.0, 0.0, 1.0)
	);
	modelView[1] = oblique;
	return oblique;
}

/**
 * Axonometric projection
 * Creates the axonometric projection matrix.
 */
function axonometricProj(theta, gamma) {
    var axonometric = mult(rotateX(gamma),rotateY(theta));
    modelView[1] = axonometric;
}

/**
 * Perspective projection
 * Creates the perspective projection matrix.
 * The parameter d starts with value = 3.0.
 * d can change during the user interaction.
 */
function perspectiveProj(d) {
	var perspective = mat4(
		vec4( 1.0, 0.0, 0.0, 0.0 ),
		vec4( 0.0, 1.0, 0.0, 0.0 ),
		vec4(0.0, 0.0, 0.0, 0.0),
		vec4(0.0, 0.0, -1.0/d, 1.0)
	);
	modelView[1] = mat4();
	mPerspective = mult( mProj , perspective );	
}

/**
 * We calculate the fix applied to the objects
 * Obtain the scale matrix, with the position (0,0) as scale*fix, 
 * in order to keep the image straight
 * After that the program replace some positions in the projection matrix, in order to apply the scale
 * Also, the scale matrix is modified in order to create a projection matrix in perspective,
 * so then the perspective matrix can be replaced.
 * 
 */
function zoom(Sx, Sy, Sz, prevScale) {
	
	var fix = (mProj[0][0])/prevScale;
	var mScale = scalem(Sx*fix, Sy, Sz);
	mProj[0][0] = mScale[0][0];
	mProj[1][1] = mScale[1][1];
	mProj[2][2] = mScale[2][2];
	
	var d = mPerspective[3][2];
	mScale[3][2] = d;
	mPerspective = mScale;
}

/**
 * Creates all possible interactions, the existent buttons in the program can have with user.
 */
function eventListeners() {
	
	var newCube = document.getElementById("newCube");
	var newSphere = document.getElementById("newSphere");
	var newCylinder = document.getElementById("newCylinder");
	var newBunny = document.getElementById("newBunny");
	
	var singleView = document.getElementById("singleView");
	var multipleView = document.getElementById("multView");
	var wireframeView = document.getElementById("wireFrame");
	var filledView = document.getElementById("filled");
	
	var obliqueBtn = document.getElementById("obliqueProjection");
	var axonometricBtn = document.getElementById("axonometricProjection");
	var perspectiveBtn = document.getElementById("perspectiveProjection");
	
	var lOblique = document.getElementById("lOblique");
	var alphaOblique = document.getElementById("alphaOblique");
	var thetaAxonometric = document.getElementById("thetaAxonometric");
	var gammaAxonometric = document.getElementById("gammaAxonometric");
	var dPerspective = document.getElementById("dPerspective");
	
	var l = 0.5;
	var alpha = 45.0;
	var theta = -20.26;
	var gamma = 19.42;
	var d = 3.0;
	var fix = 1.0;
	
	var isOblique = true;
	var isAxonometric = false;
	var isPerspective = false;

	/**
	 * If the previous projection as as perspective projection,
	 * resets the perspective matrix.
	 * Resets the modelview projection, becoming an oblique projection matrix.
     * Resets the value of all parameters used in their projections.
     * Resets the correspondent projection boolean to false.
	 */
	function resetAll() {
		if(isPerspective)
			mPerspective = mProj;
		modelView[1] = obliqueProj(0.5, 45.0);
		l = 0.5; lOblique.value = l;
		alpha = 45.0; alphaOblique.value = alpha;
		theta = -20-26; thetaAxonometric.value = theta;
		gamma = 19.42; gammaAxonometric.value = gamma;
		d = 3.0; dPerspective.value = d;
		isOblique = false;
		isAxonometric = false;
		isPerspective = false;	
    }
        
    /**
     * Firstly we obtain the height and width of the window, 
     * so then we can change the canvas current height and width.
     * After calculating the ratio between the height and width, 
     * the program creates a scale matrix with the first parameter as being the multiplication between the ration and the current scale, 
     * so then the figure will not change even after the rezise.
     * Finally, the program only replaces the first line of the projection matrix in order to apply the resize to the objects.
     */
    window.onresize = function(){
		var height = window.innerHeight;
		var width = window.innerWidth;
		
		canvas.height =  height;
		canvas.width = width;
		gl.viewport(0 , 0 , canvas.width ,canvas.height );
		fix = height/width;
		
		var mFix = scalem(fix*scale, 1.0, 1.0);
		mProj[0] = mFix[0];
		mPerspective[0] = mFix[0];

	};
	
	/**
	 * After pressing the keyboard, the program will save the current scale.
	 * If the key pressed was one of the button arrows (up and down), 
	 * the program will modify the scale value.
	 * After that the program call the function zoom in order to apply the new scale to the objects.
	 */
	window.addEventListener("keypress", function(event) {
		var prevScale = scale;
		switch(event.keyCode) {
			case 38: scale *= 1.1;
				break; 
			case 40: scale /= 1.1;
				break;
		}
		zoom(scale, scale, scale, prevScale);
	}); 
	
	lOblique.oninput = function() {
		if(isOblique) {
			l = lOblique.value;
			obliqueProj(l, alpha);
		}
	}
	
	alphaOblique.oninput = function() {
		if(isOblique) {
			alpha = alphaOblique.value;
			obliqueProj(l, alpha);
		}
	}
	
	thetaAxonometric.oninput = function() {
		if(isAxonometric) {
			theta = thetaAxonometric.value;
			axonometricProj(theta, gamma);
		}
	}
	
	gammaAxonometric.oninput = function() {
		if(isAxonometric) {
			gamma = gammaAxonometric.value;
			axonometricProj(theta, gamma);
		}
	}
	
	dPerspective.oninput = function() {
		if(isPerspective) {
			d = dPerspective.value;
			perspectiveProj(d);
		}
	}
	
	/**
	 * Calls the function resetAll().
	 * Turns the value of the boolean variable isOblique to true.
	 * Calls the function obliqueProj with parameters l(0.5) and alpha(45.0).
	 */
	obliqueBtn.onclick = function() {
		resetAll();
		isOblique = true;
		obliqueProj(l, alpha);
	}
	
	/**
	 * Calls the function resetAll().
	 * Turns the value of the boolean variable isAxonometric to true.
	 * 
	 * Calls the function axonometricProj with the parameters angle1 and angle2
	 */
	axonometricBtn.onclick = function() {
		resetAll();
		isAxonometric = true;
		var angle1 = Math.atan(Math.sqrt(Math.tan(radians(42.0))/Math.tan(radians(7.0)))) - Math.PI/2.0;
		var angle2 = Math.asin(Math.sqrt(Math.tan(radians(42.0)) * Math.tan(radians(7.0))));
		axonometricProj(toDegrees(angle1), toDegrees(angle2));
	} 
	
	/**
	 * Calls the function resetAll().
	 * Turns the value of the boolean variable isPerspective to true.
	 * Calls the function perspectiveProj with parameter d(3.0).
	 */
	perspectiveBtn.onclick = function() {
		resetAll();
		isPerspective = true;
		perspectiveProj(d);
	}
	
	/**
	 * Changes to single view.
	 */
	singleView.onclick = function() {
		viewSingle = true;
	}
	
	/**
	 * Changes to multiple view.
	 */
	multipleView.onclick = function() {
		viewSingle = false;
	}
	
	/**
	 * Changes to wireframe view.
	 */
	wireframeView.onclick = function() {
		filled = false;
	}
	
	/**
	 * Changes to filled view.
	 */
	filledView.onclick = function() {
		filled = true;
	}
	
	/**
	 * Calls the function resetAll().
	 * Turns the value of the boolean variable isOblique to true.
	 * primitives = 1 to identify that is a cube.
	 */
	newCube.onclick = function() {
		resetAll();
		isOblique = true;
		primitives = 1; 
	}
	
	/**
	 * Calls the function resetAll().
	 * Turns the value of the boolean variable isOblique to true.
	 * primitives = 2 to identify that is a sphere.
	 */
	newSphere.onclick = function() {
		resetAll();
		isOblique = true;
		primitives = 2; 
	}
	
	/**
	 * Calls the function resetAll().
	 * Turns the value of the boolean variable isOblique to true.
	 * primitives = 3 to identify that is a cylinder.
	 */
	newCylinder.onclick = function() {
		resetAll();
		isOblique = true;
		primitives = 3; 
	}
	
	/**
	 * Calls the function resetAll().
	 * Turns the value of the boolean variable isOblique to true.
	 * primitives = 4 to identify that is a bunny.
	 */
	newBunny.onclick = function() {
		resetAll();
		isOblique = true;
		primitives = 4; 
	}
}

/**
 * The program creates the orthogonal projection matrixes
 * The program changes the values of the canvas height and width, 
 * so then the canvas can occupy the entire window.
 * After that a scale matrix is created based on the ratio between the height and width of the canvas.
 * Finally that matrix becomes the initial projection matrix. 
 */
function initMatrixes() {
    
    var mFrontView = mat4();
	var mUpView = mult(mat4(), rotateX(90));
	var mSideView = mult(mat4(), rotateY(90));
	var mModelView = obliqueProj(0.5, 45);
	
	modelView[0] = mUpView;
	modelView[1] = mModelView;
	modelView[2] = mFrontView;
	modelView[3] = mSideView;
	
	
	canvas.height =  window.innerHeight;
	canvas.width = window.innerWidth;	
	var ratio = canvas.height/canvas.width;
		
	
	var mFix = scalem(ratio, 1.0, 1.0);
    mProj = mFix;
    mPerspective = mFix;
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    bunnyInit(gl);
    modelView = [];
    projection = [];
    scale = 1.0;
    viewSingle = false;
    filled = false;
    
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    primitives = 1;
    mProjLoc = gl.getUniformLocation(program, "mProjection");
    mModelViewLoc = gl.getUniformLocation(program, "mModelView");
    
    initMatrixes();
    render();
    
    eventListeners();
}

/**
 * Creates a primitive, that can be a cube, a sphere, a cylinder or a bunny.
 * If the option the boolean filled is true, the object is created with colors.
 */
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

/**
 * Splits the canvas in 4 parts.
 * Each will have a different orthogonal projection.
 * The upper left corner has a front view projction,
 * the upper right corner has a side view projection, 
 * and the bottom left corner has a up view projection.
 * The bottom right corner starts with an oblique projection.
 */
function multipleView() {	
	
	gl.viewport(0,0,canvas.width/2, canvas.height/2);
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(mProj));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView[0]));
	drawPrimitive();
	
	gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(mPerspective));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView[1]));
	drawPrimitive();
	
	gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(mProj));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView[2]));
	drawPrimitive();
	
	gl.viewport(canvas.width/2,canvas.height/2,canvas.width/2, canvas.height/2);	
	
	gl.uniformMatrix4fv(mProjLoc, false, flatten(mProj));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView[3]));
	drawPrimitive();		
}

/**
 * Displays a single projection, which can be an oblique, an axonometric or a perspective.
 */
function singleView() {
	gl.viewport(0,0,canvas.width, canvas.height);
	gl.uniformMatrix4fv(mProjLoc, false, flatten(mPerspective));
	gl.uniformMatrix4fv(mModelViewLoc, false, flatten(modelView[1]));
	drawPrimitive();
}

/**
 * Clears the color buffer and the z-buffer.
 * If the boolean viewSingle is true, 
 * the program calls the function singleView().
 * Else the program calls the funtion multipleView().
 * After that the program call the function RequestAnimFrame(),
 * so then the function render() will be called each frame.
 */
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if(!viewSingle) 
		multipleView();
	else 
		singleView();
	
   requestAnimFrame(render);
}
