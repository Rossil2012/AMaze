var ctx, wid, hei, cols, rows, maze, stack = [], start = {x:-1, y:-1}, end = {x:-1, y:-1}, grid = 8, padding = 16, s, density=0.5;
function drawMaze() {
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            switch( maze[i][j] ) {
                case 0: ctx.fillStyle = "black"; break;
                case 1: ctx.fillStyle = "gray"; break;
                case 2: ctx.fillStyle = "red"; break;
                case 3: ctx.fillStyle = "yellow"; break;
                case 4: ctx.fillStyle = "#500000"; break;
                case 8: ctx.fillStyle = "blue"; break;
            }
            ctx.fillRect( grid * i, grid * j, grid, grid  );
        }
    }
}

function drawBlock(sx, sy, a) {
    switch( a ) {
        case 0: ctx.fillStyle = "black"; break;
        case 1: ctx.fillStyle = "gray"; break;
        case 2: ctx.fillStyle = "red"; break;
        case 3: ctx.fillStyle = "yellow"; break;
        case 4: ctx.fillStyle = "#500000"; break;
        case 8: ctx.fillStyle = "blue"; break;
    }
    ctx.fillRect( grid * sx, grid * sy, grid, grid  );
}

function getFNeighbours( sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && maze[sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
    }
    if( sx + 1 < cols - 1 && maze[sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
    }
    if( sy - 1 > 0 && maze[sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
    }
    if( sy + 1 < rows - 1 && maze[sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
    }
    return n;
}

function getSur()
{
    var n = [];
    var sx = this.x, sy = this.y;
    if(sx - 1 > 0 && (maze[sx - 1][sy] == 0 || maze[sx - 1][sy] == 3)) 
    {
        n.push( { x:sx - 1, y:sy } );
    }
    if(sx + 1 < cols - 1 && (maze[sx + 1][sy] == 0 || maze[sx + 1][sy] == 3)) 
    {
        n.push( { x:sx + 1, y:sy } );
    }
    if(sy - 1 > 0 && (maze[sx][sy - 1] == 0 || maze[sx][sy - 1] == 3)) 
    {
        n.push( { x:sx, y:sy - 1 } );
    }
    if(sy + 1 < rows - 1 && (maze[sx][sy + 1] == 0 || maze[sx][sy + 1] == 3)) 
    {
        n.push( { x:sx, y:sy + 1 } );
    }
    return n;
}

function getSur8()
{
    var n = [];
    var sx = this.x, sy = this.y;
    if (sx - 1 > 0) 
    {
        if (maze[sx - 1][sy] == 0 || maze[sx - 1][sy] == 3)
        {
            n.push( { x:sx - 1, y:sy } );
        }
        if (sy - 1 > 0 && (maze[sx - 1][sy - 1] == 0 || maze[sx - 1][sy - 1] == 3))
        {
            n.push( { x:sx - 1, y:sy - 1 } );
        }
        if (sy + 1 < rows - 1 && (maze[sx - 1][sy + 1] == 0 || maze[sx - 1][sy + 1] == 3))
        {
            n.push( { x:sx - 1, y:sy + 1 } );
        }
    }
    if (sx + 1 < cols - 1) 
    {
        if (maze[sx + 1][sy] == 0 || maze[sx + 1][sy] == 3)
        {
            n.push( { x:sx + 1, y:sy } );
        }
        if (sy - 1 > 0 && (maze[sx + 1][sy - 1] == 0 || maze[sx + 1][sy - 1] == 3))
        {
            n.push( { x:sx + 1, y:sy - 1 } );
        }
        if (sy + 1 < rows - 1 && (maze[sx + 1][sy + 1] == 0 || maze[sx + 1][sy + 1] == 3))
        {
            n.push( { x:sx + 1, y:sy + 1 } );
        }
    }
    if ( sy - 1 > 0 && (maze[sx][sy - 1] == 0 || maze[sx][sy - 1] == 3)) 
    {
        n.push( { x:sx, y:sy - 1 } );
    }
    if ( sy + 1 < rows - 1 && (maze[sx][sy + 1] == 0 || maze[sx][sy + 1] == 3) ) 
    {
        n.push( { x:sx, y:sy + 1 } );
    }
    return n;
}

function getF()
{
    return this.g + this.h;
}

function node(X, Y, G, H, P)
{
    this.x = X;
    this.y = Y;
    this.g = G;
    this.h = H;
    this.prev = P;
    this.getSur = getSur;
    this.getSur8 = getSur8;
    this.getF = getF;
}

function enqueue(ele)
{
    var i = this.data.push(ele) - 1;
    while (i > 1)
    {
        if (this.data[Math.floor(i / 2)].getF() >= ele.getF())
        {
            this.data[i] = this.data[Math.floor(i / 2)];
            i = Math.floor(i / 2);
            this.data[i] = ele;
        }
        else
        {
            break;
        }
    }
}

function dequeue()
{
    var ele;
    if (this.data.length == 2)
    {
        ele = this.data.pop();
    }
    else
    {
        ele = this.data[1];
        var end = this.data.pop();
        var i = 1;
        while (2 * i < this.data.length)
        {
            var smallChildIdx;
            if (2 * i + 1 < this.length)
            {
                smallChildIdx = (this.data[2 * i].getF() < this.data[2 * i + 1].getF())?2 * i:2 * i + 1;
            }
            else
            {
                smallChildIdx = 2 * i;
            }
            if (this.data[smallChildIdx].getF() <= end.getF())
            {  
                this.data[i] = this.data[smallChildIdx];
                i = smallChildIdx;
            }
            else
            {
                break;
            }
        }
        this.data[i] = end; 
    }
    
    return ele;
}

function isEmpty()
{
    return (this.data.length == 1);
}

function idxOf(ele)
{
    for (var i = 0; i < this.data.length; ++i)
    {
        if (this.data[i].x == ele.x && this.data[i].y == ele.y)
        {
            return i;
        }
    }
    return -1;
}

function minPriorityQueue()
{
    this.data = [new node(0, 0, 0, 0, null)];
    this.enqueue = enqueue;
    this.dequeue = dequeue;
    this.isEmpty = isEmpty;
    this.idxOf = idxOf;
}

function idxOflist(list, ele)
{
    for (var i = 0; i < list.length; ++i)
    {
        if (list[i].x == ele.x && list[i].y == ele.y)
        {
            return i;
        }
    }
    return -1;
}

function print(cur)
{
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            if (maze[i][j] == 3)
            {
                maze[i][j] = 0;
                drawBlock(i, j, 0);
            }
        }
    }
    while(cur.prev)
    {
        maze[cur.x][cur.y] = 3;
        cur = cur.prev;
    }
    drawMaze();
    drawBlock(end.x, end.y, 8);
}

function newSolveMaze()
{

    var open = new minPriorityQueue(), close = [];
    open.enqueue(new node(start.x, start.y, 0, Math.abs(start.x - end.x) + Math.abs(start.y - end.y), null));

    while (!open.isEmpty())
    {
        var tmp = open.dequeue();
        var sur;
        var mazeType = document.getElementById("sltType").value;
        if (mazeType == "Maze1") 
        {
            sur = tmp.getSur();
        }
        else if (mazeType == "Maze2")
        {
            sur = tmp.getSur8();
        }

        if (tmp.x == end.x && tmp.y == end.y)
        {
            print(tmp);
            return;
        }

        for (var i = 0; i < sur.length; ++i)
        {
            var t = sur[i];
            var closeIdx = idxOflist(close, t), openIdx = open.idxOf(t);

            //isIncloselist
            if (closeIdx != -1)
            {
                continue;
            }

            //isInopenlist
            if (openIdx != -1)
            {
                if (open.data[openIdx].g > tmp.g + 1)
                {
                    open.data[openIdx].g = tmp.g + 1;
                    open.data[openIdx].prev = tmp;
                }
            }
            //notInopenlist nor closelist
            else
            {
                open.enqueue(new node(t.x, t.y, tmp.g + 1, Math.abs(start.x - end.x) + Math.abs(start.y - end.y), tmp));
            }

        }
        close.push(tmp);
        drawBlock(tmp.x, tmp.y, 4);
    }
    drawBlock(start.x, start.y, 8);
    drawBlock(end.x, end.y, 8);
}

function solveMaze1() { //replace
    if( start.x == end.x && start.y == end.y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( maze[i][j] ) {
                    case 2: maze[i][j] = 3; break;
                    case 4: maze[i][j] = 0; break;
                }
            }
        }
        drawMaze();
        return;
    }
    var neighbours = getFNeighbours( start.x, start.y, 0 );
    if( neighbours.length ) {
        stack.push( start );
        start = neighbours[0];
        maze[start.x][start.y] = 2;
    } else {
        maze[start.x][start.y] = 4;
        start = stack.pop();
    }
 
    drawMaze();
    requestAnimationFrame( solveMaze1 );
}
function getCursorPos( event ) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor( ( event.clientX - rect.left ) / grid / s), 
        y = Math.floor( ( event.clientY - rect.top  ) / grid / s);
    if( maze[x][y] ) return;
    if( start.x == -1 ) {
        start = { x: x, y: y };
        maze[start.x][start.y] = 8;
        drawMaze();
    } else {
        end = { x: x, y: y };
        //maze[end.x][end.y] = 8;
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                if (maze[i][j] == 4)
                {
                    maze[i][j] = 0;
                }
            }
        }
        drawMaze();
        newSolveMaze();
    }
}
function getNeighbours( sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && maze[sx - 1][sy] == a && sx - 2 > 0 && maze[sx - 2][sy] == a ) {
        n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
    }
    if( sx + 1 < cols - 1 && maze[sx + 1][sy] == a && sx + 2 < cols - 1 && maze[sx + 2][sy] == a ) {
        n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
    }
    if( sy - 1 > 0 && maze[sx][sy - 1] == a && sy - 2 > 0 && maze[sx][sy - 2] == a ) {
        n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
    }
    if( sy + 1 < rows - 1 && maze[sx][sy + 1] == a && sy + 2 < rows - 1 && maze[sx][sy + 2] == a ) {
        n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
    }
    return n;
}
function createArray( c, r ) {
    var m = new Array( c );
    for( var i = 0; i < c; i++ ) {
        m[i] = new Array( r );
        for( var j = 0; j < r; j++ ) {
            m[i][j] = 1;
        }
    }
    return m;
}
function createMaze1() {
    var neighbours = getNeighbours( start.x, start.y, 1 ), l;
    if( neighbours.length < 1 ) {
        if( stack.length < 1 ) {
            drawMaze(); stack = [];
            start.x = start.y = -1;
            document.getElementById( "canvas" ).addEventListener( "mousedown", getCursorPos, false );
            document.getElementById("btnCreateMaze").removeAttribute("disabled");

            return;
        }
        start = stack.pop();
    } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        maze[l.x][l.y] = 0;

        l = neighbours[i + 1]; 
        maze[l.x][l.y] = 0;

        start = l
        stack.push( start )
    }
    drawMaze();
    requestAnimationFrame( createMaze1 );
}

function createMaze1NonAni() {

    while(true) {

        var neighbours = getNeighbours( start.x, start.y, 1 ), l;
        if( neighbours.length < 1 ) {
            if( stack.length < 1 ) {
                drawMaze(); stack = [];
                start.x = start.y = -1;
                document.getElementById( "canvas" ).addEventListener( "mousedown", getCursorPos, false );
                document.getElementById("btnCreateMaze").removeAttribute("disabled");
    
                return;
            }
            start = stack.pop();
        } else {
            var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
            l = neighbours[i]; 
            maze[l.x][l.y] = 0;
    
            l = neighbours[i + 1]; 
            maze[l.x][l.y] = 0;
    
            start = l
            stack.push( start )
        }    
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}
function createMaze2() {

    var r = Math.random();

    maze[start.x][start.y] = r < density ? 0 : 1;
    
    drawMaze();

    if(start.x == (cols - 2) && start.y == (rows - 2)){

        start.x = start.y = -1;
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        document.getElementById( "canvas" ).addEventListener( "mousedown", getCursorPos, false );
        return;
    }

    start.x = start.x + 1;
    if(start.x == cols - 1){
        start.x = 1;
        start.y = start.y + 1;
    }

    requestAnimationFrame(createMaze2);
}

function createMaze2NonAni() {

    for(var i = 1; i < cols - 1; i++){
        for(var j = 1; j < rows - 1; j++){
            maze[i][j] = Math.random() < density ? 0 : 1;
        }
    }
    drawMaze();
    start.x = start.y = -1;
    document.getElementById( "canvas" ).addEventListener( "mousedown", getCursorPos, false );
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}
function createCanvas() {
    var canvas = document.createElement( "canvas" );
    wid = document.getElementById("maze").offsetWidth - padding; 
    hei = 400;
    
    canvas.width = wid; canvas.height = 400;
    canvas.id = "canvas";
    ctx = canvas.getContext( "2d" );
    ctx.fillStyle = "gray"; ctx.fillRect( 0, 0, wid, hei );
    var div = document.getElementById("maze")
    div.appendChild( canvas ); 
}

function init() {
    createCanvas();
}

function onCreate() {

    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");

    wid = document.getElementById("maze").offsetWidth - padding; 
    hei = 400;

    cols = eval(document.getElementById("cols").value); 
    rows = eval(document.getElementById("rows").value);

    var mazeType = document.getElementById("sltType").value;

    if(mazeType == "Maze1") {
        cols = cols + 1 - cols % 2;
        rows = rows + 1 - rows % 2;    
    }

    maze = createArray( cols, rows );

    var canvas = document.getElementById("canvas");
    canvas.width = wid;
    canvas.height = hei;
    s = canvas.width / (grid * cols);
    canvas.height = s * grid * rows;

    ctx.scale(s, s);

 
    if(mazeType == "Maze1") {

        start.x = Math.floor( Math.random() * ( cols / 2 ) );
        start.y = Math.floor( Math.random() * ( rows / 2 ) );
        if( !( start.x & 1 ) ) start.x++; if( !( start.y & 1 ) ) start.y++;
        maze[start.x][start.y] = 0;

        if(document.getElementById("chkAnimated").checked) {

            createMaze1();
        }
        else {
            createMaze1NonAni();
        }
    }
    else {

        density = document.getElementById("density").value / 100;
        start.x = 1;
        start.y = 1;

        if(document.getElementById("chkAnimated").checked) {
            createMaze2();
        }
        else {
            createMaze2NonAni();
        }
    }
}

function onSltType() {
    if(document.getElementById("sltType").value == "Maze2") {
        document.getElementById("density").removeAttribute("disabled");
    }
    else {
        document.getElementById("density").setAttribute("disabled", "disabled");
    }
}