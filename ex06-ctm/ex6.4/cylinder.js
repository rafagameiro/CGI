var cylinder_points = [];
var cylinder_normals = [];
var cylinder_faces = [];
var cylinder_edges = [];

var cylinder_points_buffer;
var cylinder_normals_buffer;
var cylinder_faces_buffer;
var cylinder_edges_buffer;

var CYLINDER_LONS=30;

function cylinderInit(gl) {
    cylinderBuild(CYLINDER_LONS);
    cylinderUploadData(gl);
}

function cylinderBuild(nlon)
{
    // theta will be longitude
    var d_theta = 2*Math.PI / nlon;
    var r = 0.5;
    
    // Generate middle
    for(var j=0, theta=0; j<nlon; j++, theta+=d_theta) {
       var pt = vec3(r*Math.cos(theta),r*Math.sin(theta),0);
       cylinder_points.push(pt);
       var n = vec3(pt);
       cylinder_normals.push(normalize(n));
    }
    
    // general middle faces
    var offset=1;
    
    for(var j=0; j<nlon-1; j++) {
        var p = offset+nlon+j;
        cylinder_faces.push(p);
        cylinder_faces.push(p+nlon);
        cylinder_faces.push(p+nlon+1);      
    }
    
    for(var j=0; j<nlon;j++, p++) {
       var p = 1 + nlon + j;
       cylinder_edges.push(p);
       if(j!=nlon-1) 
           cylinder_edges.push(p+1);
       else cylinder_edges.push(p+1-nlon);
    }
    
}

function cylinderUploadData(gl)
{
    cylinder_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cylinder_points), gl.STATIC_DRAW);
    
    cylinder_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cylinder_normals), gl.STATIC_DRAW);
    
    cylinder_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(cylinder_faces), gl.STATIC_DRAW);
    
    cylinder_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(cylinder_edges), gl.STATIC_DRAW);
}

function cylinderDrawWireFrame(gl, program)
{    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_edges_buffer);
    gl.drawElements(gl.LINES, cylinder_edges.length, gl.UNSIGNED_SHORT, 0);
}

function cylinderDrawFilled(gl, program)
{
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinder_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_faces_buffer);
    gl.drawElements(gl.TRIANGLES, cylinder_faces.length, gl.UNSIGNED_SHORT, 0);
}

function cylinderAddFace(a, b, c, d, n)
{
    var offset = cylinder_points.length;
    
    cylinder_points.push(cylinder_vertices[a]);
    cylinder_points.push(cylinder_vertices[b]);
    cylinder_points.push(cylinder_vertices[c]);
    cylinder_points.push(cylinder_vertices[d]);
    for(var i=0; i<4; i++)
        cylinder_normals.push(n);
    
    // Add 2 triangular faces (a,b,c) and (a,c,d)
    cylinder_faces.push(offset);
    cylinder_faces.push(offset+1);
    cylinder_faces.push(offset+2);
    
    cylinder_faces.push(offset);
    cylinder_faces.push(offset+2);
    cylinder_faces.push(offset+3);
    
    // Add first edge (a,b)
    cylinder_edges.push(offset);
    cylinder_edges.push(offset+1);
    
    // Add second edge (b,c)
    cylinder_edges.push(offset+1);
    cylinder_edges.push(offset+2);
}
