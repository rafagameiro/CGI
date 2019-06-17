var bunny_normals = [];
var bunny_edges = [];
var bunny_normalCheck = [];
var bunny_edgesCheck = [];

var bunny_points_buffer;
var bunny_normals_buffer;
var bunny_faces_buffer;
var bunny_edges_buffer;

/**
 * Creates the object bunny
 */
function bunnyInit(gl) {
    bunnyBuild();
    bunnyUploadData(gl);
}

/**
 * Checks if an edge has already been added
 * If it was, returns true
 * Else false.
 * 
 */
function checkEdges(a, b) {
	for(var i = 0; i < bunny_edgesCheck.length; i++) {
		var current = bunny_edgesCheck[i];
		if(current[0] == a && current[1] == b)
			return true;
	}
	return false;
}

/**
 * Add to the bunny_edges array, the edges ab, bc and ca.
 * it only adds to the array, if the edge was not checked yet
 * After adding, the edges area added to the bunny_edgesCheck array.
 */
function buildEdges(a, b, c) {
	
	if(!checkEdges(a,b)) {
		bunny_edges.push(a);
		bunny_edges.push(b);
		bunny_edgesCheck.push(vec2(a,b));
	}
	if(!checkEdges(b,c)) {
		bunny_edges.push(b);
		bunny_edges.push(c);
		bunny_edgesCheck.push(vec2(b,c));
	}
	if(!checkEdges(c,a)) {
		bunny_edges.push(c);
		bunny_edges.push(a);
		bunny_edgesCheck.push(vec2(c,a));
	}
}

/**
 * Checks if a vertice already has a normal associated.
 * If it was, returns the position in the array bunny_normalsCheck
 * Else returns -1.
 */
function checkNormal(b) {
	for(var i = 0; i < bunny_normalCheck.length; i++) {
		var current = bunny_normalCheck[i];
		if(current[i] == bunny_points[b])
			return i;
	}
	return -1;
}

/**
 * The program obtains the vertexes A, B and C.
 * After that determines the vector AB and CA and then calculates the cross product.
 */
function calculateNormal(a, b, c) {
	var vertexA = vec3(bunny_points[a*3], bunny_points[a*3+1], bunny_points[a*3+2]);
	var vertexB = vec3(bunny_points[b*3], bunny_points[b*3+1], bunny_points[b*3+2]);
	var vertexC = vec3(bunny_points[c*3], bunny_points[c*3+1], bunny_points[c*3+2]);
	
	var vectorAB = subtract(vertexB, vertexA);
	var vectorAC = subtract(vertexC, vertexA);
	
	return cross(vectorAB, vectorAC);
}

/**
 * Firstly, the program generates the edges.
 * After that it will create the same normal for each vertex which is (0.0, 0.0, 0.0).
 * The program goes through the normals array, 
 * but this time it will generate the normal associated with a triangle where the specific vertex is included.
 * Finally, the program normalizes all normals inside the normals array, in order to obtain unitary vectors.
 */
function bunnyBuild() 
{
    
    for(var i=0; i < bunny_faces.length-3; i+=3)
		buildEdges(bunny_faces[i], bunny_faces[i+1], bunny_faces[i+2]);
    
    for(var i = 0; i < bunny_points.length; i++)
		bunny_normals.push(vec3(0.0, 0.0, 0.0));
    
    for(var i = 0; i < bunny_normals.length-3; i+=3) {
		var normal = calculateNormal(bunny_faces[i], bunny_faces[i+1], bunny_faces[i+2]);
		bunny_normals[i] = add(bunny_normals[i],normal);
		bunny_normals[i+1] = add(bunny_normals[i+1],normal);
		bunny_normals[i+2] = add(bunny_normals[i+2],normal);
	}
		
    for(var i = 0; i < bunny_normals.length; i++)
		bunny_normals[i] = normalize(bunny_normals[i], false);
	
}

/**
 * Initializes the attributes buffer, the faces buffer and edges array.
 */
function bunnyUploadData(gl)
{
    bunny_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bunny_points), gl.STATIC_DRAW);
    
    bunny_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bunny_normals), gl.STATIC_DRAW);
    
    bunny_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bunny_faces), gl.STATIC_DRAW);
    
    bunny_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bunny_edges), gl.STATIC_DRAW);
}

/**
 * Draws the bunny in the wireframe structure.
 */
function bunnyDrawWireFrame(gl, program)
{    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_edges_buffer);
    gl.drawElements(gl.LINES, bunny_edges.length, gl.UNSIGNED_SHORT, 0);
}

/**
 * Draws the bunny using the normals to apply the color.
 */
function bunnyDrawFilled(gl, program)
{
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, bunny_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bunny_faces_buffer);
    gl.drawElements(gl.TRIANGLES, bunny_faces.length, gl.UNSIGNED_SHORT, 0);
}

