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
    
    // setMessage
    var nextMessage = "";
    var message = $("message");
    var messageText = $("message-text");
    var setMessage = function (newMessage) {
        nextMessage = newMessage;
        message.addClass("switching");
    };
    message.addEventListener("webkitTransitionEnd", function () {
        if (message.hasClass("switching")) {
            messageText.set("text", nextMessage);
            message.removeClass("switching");
        }
    }, false);
});
