window.addEvent("domready", function () {
    var timer = null;
    document.body.addEvent("mousemove", function () {
        if (timer) { clearTimeout(timer); }
        timer = setTimeout(function () {
            document.body.addClass("active");
        }, 100);
    });
    document.body.addEvent("mouseleave", function () {
        if (timer) { clearTimeout(timer); }
        timer = setTimeout(function () {
            document.body.removeClass("active");
        }, 100);
    });
});
