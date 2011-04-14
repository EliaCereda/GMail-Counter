window.addEvent("domready", function () {
    var settings = new FancySettings("GMail Counter");
    
    settings.create("General", "Behavior", "text", {
        "name": "label",
        "label": "GMail Label:",
        "text": "e.g. \"notifications\""
    });
    settings.create("General", "Behavior", "radioButtons", {
        "name": "open_emails_in",
        "label": "Open Emails in:",
        "options": [
            {
                "value": "new_tab",
                "text": "a new tab"
            },
            {
                "value": "new_window",
                "text": "a new window"
            },
            {
                "value": "gmail_tab",
                "text": "an already open GMail tab"
            },
            {
                "value": "active_tab",
                "text": "the active tab"
            }
        ]
    });
    
    settings.create("General", "Google Apps", "checkbox", {
        "name": "google_apps_enabled",
        "label": "Enable Google Apps"
    });
    settings.create("General", "Google Apps", "text", {
        "name": "google_apps_domain",
        "label": "Domain:",
        "text": "e.g. \"example.com\""
    });
    
    
    settings.create("Notifications", "Head Viewer", "checkbox", {
        "name": "head_viewer_autohide",
        "label": "Hide automatically"
    });
    settings.create("Notifications", "Head Viewer", "popupButton", {
        "name": "head_viewer_email_time",
        "label": "Show each Email for:",
        "options": [
            {
                "value": 5,
                "text": "5 seconds"
            },
            {
                "value": 10,
                "text": "10 seconds"
            },
            {
                "value": 20,
                "text": "20 seconds"
            },
            {
                "value": 30,
                "text": "30 seconds"
            },
            {
                "value": 60,
                "text": "a minute"
            }
        ]
    });
    var a = settings.create("Notifications", "Head Viewer", "popupButton", {
        "name": "head_viewer_close_button_behavior",
        "label": "Close Button will:",
        "options": [
            {
                "value": "one_window",
                "text": "close the Head Viewer on the current window"
            },
            {
                "value": "all_windows",
                "text": "close the Head Viewer on all windows"
            }
        ]
    });
    var b = settings.create("Notifications", "Head Viewer", "description");
    b.bundle.inject(a.container);
    b.bundle.setStyle("display", "inline-block");
    b.bundle.setStyle("margin-left", "7px");
    b.element.setStyle("margin-bottom", "0");
    a.addEvent("action", function (value) {
        if (value === "all_windows") {
            b.element.set("text", "");
            
        } else {
            b.element.set("text", "... includes new windows!");
        }
    });
    a.fireEvent("action", a.get());
    
    
    settings.create("Notifications", "Sound", "checkbox", {
        "name": "sound_enabled",
        "label": "Enable Sound Notifications"
    });
    settings.create("Notifications", "Sound", "slider", {
        "name": "sound_volume",
        "label": "Volume:"
    });
    settings.create("Notifications", "Sound", "button", {
        "label": "Choose a custom sound:",
        "text": "Browse..."
    });
});
