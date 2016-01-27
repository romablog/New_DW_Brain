var memoryCounter = 0;
var lines = [];

function load() {
    console.log("hello");
    for(var i = 0; i<30;i++) {
        if (memoryCounter <= lines.length && memoryCounter < g_memory.length){
            console.log(memoryCounter);
            lines.push(takeCell(memoryCounter));
            memoryCounter++;
        }
    }
}

/*function buildString(){
    var newLines = [];
    for (var y=0; y < memoryCounter+1; y++){
        var cells = takeCell(y);
        newLines.push(cells.join(' '));
    }
    lines = newLines;
}
*/

function takeCell(index) {
    var wholeLabel = '0x' + pad_num(index, 7) + ' ' + pad_num(g_memory[index], 3);
    return {
        hex: '0x'+ parseInt(index.toString(16), 16),
        data: g_memory[index]
    };
}

function addFromMemory(){
    if (g_mp < lines.length)
        lines[g_mp] = takeCell(g_mp);
}