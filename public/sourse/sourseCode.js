var g_debugging = 0;
var g_memory = Array();
var g_max_mem = 255;
var g_max_val = 255;
var g_ip = 0;
var g_mp = 0;
var g_dp = 0;
var g_program = new Array();
var g_targets = new Array();
var g_input = new Array();
var g_output = '';
var g_viewer_width = 63;
var g_quit_debug_run = 0;
var g_debugging_running = 0;
var g_prompt_for_input = 0;
var g_running = 0;
var g_linebreaker = "\n";
var g_timeout = 0;

function init(){
    if (navigator.userAgent.toLowerCase().indexOf("msie") != -1){
        g_linebreaker = "\r";
    }

    document.getElementById('edit_source').value = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.";
    g_debugging = 1;
    init_memory();
    debug_toggle(document.getElementById('mainform'));
    load();
}

function init_memory(){
    for(var i=0; i<=g_max_mem; i++){
        g_mp = i;
        g_memory[i] = 0;
        addFromMemory();
    }
    g_mp = 0;
}

function init_io(){
    g_dp = 0;
    g_output = '';
}

function init_prog(code){
    g_program.length = 0;
    for(var i=0; i<code.length; i++){
        var op = code.charAt(i)
        if (is_valid_op(op)){
            g_program[g_program.length] = op;
        }
    }
    g_ip = 0;
    init_targets();
}

function init_targets(){
    g_targets.length = 0;
    var temp_stack = new Array();
    for(var i=0; i<g_program.length; i++){
        var op = g_program[i];
        if (op == '['){
            temp_stack.push(i);
        }
        if (op == ']'){
            if (temp_stack.length == 0) alert('Parseing error: ] with no matching [');
            var target = temp_stack.pop();
            g_targets[i] = target;
            g_targets[target] = i;
        }
    }
    if (temp_stack.length > 0) alert('Parseing error: [ with no matching ]');
}

function init_input(){
    g_prompt_for_input = true;
    g_input.length = 0;
    var in_data = "";//document.getElementById('edit_input').value;
    for(var i=0; i<in_data.length; i++){
        g_input[g_input.length] = in_data.charAt(i);
    }
    g_dp = 0;
}

function get_input(){
    if (g_prompt_for_input){
        var data = window.prompt("Enter an input character (use #xxx to specify a decimal code, !xxx for an octal code, or $xxx for a hex code):", "#0");
        if ((data == null) || (!data)) return 0;
        if (data.charAt(0) == '#'){
            return parseInt(data.substr(1), 10);
        }
        if (data.charAt(0) == '!'){
            return eval('0'+data.substr(1));
        }
        if (data.charAt(0) == '$'){
            return eval('0x'+data.substr(1));
        }
        return data.charCodeAt(0);
    }else{
        var result = (g_dp >= g_input.length)?0:g_input[g_dp].charCodeAt(0);
        g_dp++;
        return result;
    }
}

function is_valid_op(op){
    if (op == '+') return 1;
    if (op == '-') return 1;
    if (op == '>') return 1;
    if (op == '<') return 1;
    if (op == '[') return 1;
    if (op == ']') return 1;
    if (op == '.') return 1;
    if (op == ',') return 1;
    if (op == '#') return 1;
    return 0;
}

function put_output(c){
    g_output += c;
}

function execute_opcode(op){
    switch(op){
        case '+':
            g_memory[g_mp]++;
            if (g_memory[g_mp] > g_max_val) g_memory[g_mp] = 0; addFromMemory();
            break;
        case '-':
            g_memory[g_mp]--;
            if (g_memory[g_mp] < 0) g_memory[g_mp] = g_max_val; addFromMemory();
            break;
        case '>':
            g_mp++;
            if (g_mp > g_max_mem) g_mp = 0;
            break;
        case '<':
            g_mp--;
            if (g_mp < 0) g_mp = g_max_mem;
            break;
        case '[':
            if (g_memory[g_mp] == 0) g_ip = g_targets[g_ip];
            break;
        case ']':
            g_ip = g_targets[g_ip] - 1;
            break;
        case '.':
            put_output(String.fromCharCode(g_memory[g_mp]));
            break;
        case ',':
            g_memory[g_mp] = get_input(); addFromMemory();
            break;
    }
}

function bf_interpret(prog){

    if (g_running){
        console.log("hello stop");
        bf_stop_run();
        return;
    }
    console.log("hello start");
    g_running = 1;
    init_prog(prog);
    init_memory();
    init_io();
    init_input();
    document.getElementById('edit_source').disabled = true;
    disable_button('button_debug');
    change_button_caption('button_run', 'Stop');

    bf_run_step();
}

function bf_stop_run(){
    //enable_text_box('edit_source');
    //enable_text_box('edit_progs');
    enable_button('button_debug');
    change_button_caption('button_run', 'Run');
    g_running = 0;
}

function bf_run_done(){
    if (g_running) {
        set_viewdata('outputview', g_output);
    }
    bf_stop_run();
}

function bf_run_step(){
    var op = g_program[g_ip];
    execute_opcode(op);
    g_ip++;

    if (g_ip >= g_program.length || !g_running){
        bf_run_done();
        return;
    }
    window.setTimeout('bf_run_step();', g_timeout);
}

function pad_num(a, b){
    var c = new String(a);
    for(var i=c.length; i<b; i++) c = '0'+c;
    return c;
}

function update_progview(){
    var pre_slots = Math.floor(g_viewer_width / 2);
    var low_slot = g_ip - pre_slots;

    var line_1 = '';
    for(var i=0; i<g_viewer_width; i++){
        var slot = low_slot + i;
        if ((slot >= 0) && (slot < g_program.length)){
            line_1 += g_program[slot];
        }else{
            line_1 += '_';
        }
    }

    var line_2 = '';
    for(var i=0; i<pre_slots; i++){
        line_2 += ' ';
    }
    line_2 += '^';

    var line_3 = '';
    for(var i=0; i<pre_slots; i++){
        line_3 += ' ';
    }
    line_3 += 'ip='+g_ip;

    set_viewdata('progview', line_1 + g_linebreaker + line_2 + g_linebreaker + line_3);
}

function update_outputview(){
    var line_1 = g_output;
    var line_2 = '';
    for (var i=0; i<g_output.length; i++) line_2 += ' ';
    line_2 += '^';
    set_viewdata('outputview', line_1 + g_linebreaker + line_2);
}

function set_viewdata(view, data){
    var new_node = document.createTextNode(data);
    var p_node = document.getElementById(view);
    p_node.replaceChild(new_node, p_node.childNodes[0]);
}

function run(f){
    console.log(f.source.value);
    bf_interpret(f.source.value);
}

function debug_done(){
    disable_button('button_step');
    disable_button('button_run_debug');
}

function debug_toggle(f){
    if (g_debugging == 1){
        g_debugging = 0;
        document.getElementById('edit_source').disabled = false;
        //enable_text_box('edit_progs');
        enable_button('button_run');
        change_button_caption('button_debug', 'Start Debugger');
        disable_button('button_step');
        disable_button('button_run_debug');
        //set_viewdata('progview', ' ');
        set_viewdata('outputview', ' ');
    }else{
        g_debugging = 1;
        document.getElementById('edit_source').disabled = true;
        //disable_text_box('edit_progs');
        disable_button('button_run');
        change_button_caption('button_debug', 'Quit Debugger');
        enable_button('button_step');
        enable_button('button_run_debug');
        start_debugger();
    }
}

function start_debugger(){
    init_memory();
    init_io();
    init_prog(document.getElementById('edit_source').value);
    init_input();
    //update_progview();
    update_outputview();
}

function run_step(){
    var op = g_program[g_ip];
    execute_opcode(op);
    g_ip++;
    //update_progview();
    update_outputview();

    if (g_ip >= g_program.length){
        debug_done();
    }
}

function start_debug_run(){
    disable_button('button_debug');
    disable_button('button_step');
    change_button_caption('button_run_debug', 'Stop Running');
    g_debugging_running = 1;
}

function stop_debug_run(){
    enable_button('button_debug');
    enable_button('button_step');
    change_button_caption('button_run_debug', 'Run To Breakpoint');
    g_debugging_running = 0;
}

function run_debug(){
    if (g_debugging_running){
        g_quit_debug_run = 1;
    }else{
        start_debug_run();
        g_quit_debug_run = 0;
        run_debug_step();
    }
}

function run_debug_step(){
    run_step();
    if ((g_program[g_ip] == '#') || g_quit_debug_run || (g_ip >= g_program.length)){
        stop_debug_run();
        if (g_ip >= g_program.length){
            debug_done();
        }
        return;
    }
    window.setTimeout('run_debug_step();', 0);
}

function disable_text_box(name){
    var elm = document.getElementById(name);
    elm.disabled = true;
    elm.style.backgroundColor = '#cccccc';
}

function enable_text_box(name){
    var elm = document.getElementById(name);
    elm.disabled = false;
    elm.style.backgroundColor = '';
}

function disable_button(name){
    var elm = document.getElementById(name);
    elm.disabled = true;
}

function enable_button(name){
    var elm = document.getElementById(name);
    elm.disabled = false;
}

function change_button_caption(name, caption){
    var elm = document.getElementById(name);
    elm.value = caption;
}

