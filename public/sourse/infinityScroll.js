$(window).load(function(){
    var el = $('<p>Test item</p>'),
        container = $('.scroll');

    function load(container) {
        for(var i = 0;i<10;i++) {
            $(container).append(el.clone());
        }
    }

    load(container);
    container.on('scroll', function () {
        if (this.scrollHeight - this.clientHeight  <= this.scrollTop) {
            load(container);
        }
    })
});