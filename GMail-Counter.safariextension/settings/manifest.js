this.manifest = {
    "name": "GMail Counter - Settings",
    "icon": "../Icon.png",
    "settings": [
        {
            "tab": "General",
            "group": "Behavior",
            
            "name": "Behavior_label",
            "type": "text",
            "label": "Gmail Label",
            "text": "i.e. \"All\" or \"Inbox\""
        },
        {
            "tab": "General",
            "group": "Behavior",
            "name": "Behavior_openLinksIn",
            "type": "radioButtons",
            "label": "Open links in:",
            "options": [
                {
                    "value": "GmailTab",
                    "text": "any tab already opened on a Gmail page"
                },
                {
                    "value": "activeTab",
                    "text": "the active tab"
                },
                {
                    "value": "newTab",
                    "text": "a new tab"
                },
                {
                    "value": "newWindow",
                    "text": "a new window"
                }
            ]
        },
        {
            "tab": "General",
            "group": "Google Apps",
            "name": "GoogleApps_enable",
            "type": "checkbox",
            "label": "Enable"
        },
        {
            "tab": "General",
            "group": "Google Apps",
            "name": "GoogleApps_domain",
            "type": "text",
            "label": "Domain",
            "text": "i.e. example.com"
        },
        {
            "tab": "Notifications",
            "group": "Sounds",
            "name": "Sounds_enable",
            "type": "checkbox",
            "label": "Enable"
        },
        {
            "tab": "Notifications",
            "group": "Sounds",
            "name": "Sounds_volume",
            "type": "slider",
            "label": "Volume",
            "max": 1,
            "min": 0,
            "step": 0.01,
			"display": true,
            "displayModifier": function (value) {
                return (value * 100).floor() + "%";
            }
        },
        {
            "tab": "Notifications",
            "group": "Sounds",
            "name": "Sounds_Non-Breaking_SPace",
            "type": "description",
            "text": ""
        },
        {
            "tab": "Notifications",
            "group": "Sounds",
            "name": "Sounds_description",
            "type": "description",
            "text": "You can choose any audio file QuickTime can open with a max. size of 512KB."
        },
        {
            "tab": "Notifications",
            "group": "Sounds",
            "name": "Sounds_name",
            "type": "text",
            "label": "Current sound",
            "text": "loading..."
        },
        {
            "tab": "Notifications",
            "group": "Sounds",
            "name": "Sounds_choose",
            "type": "button",
            "text": "Choose another sound..."
        },
        {
            "tab": "Notifications",
            "group": "Head Viewer",
            "name": "HeadViewer_description",
            "type": "description",
            "text": "(a.k.a. the toolbar under Safari's favorites bar)"
        },
        {
            "tab": "Notifications",
            "group": "Head Viewer",
            "name": "HeadViewer_interval",
            "type": "popupButton",
            "label": "Show each email for",
            "options": [
                {
                    "value": "2",
                    "text": "2 seconds"
                },
                {
                    "value": "5",
                    "text": "5 seconds"
                },
                {
                    "value": "10",
                    "text": "10 seconds"
                },
                {
                    "value": "15",
                    "text": "15 seconds"
                },
                {
                    "value": "20",
                    "text": "20 seconds"
                },
                {
                    "value": "30",
                    "text": "30 seconds"
                },
                {
                    "value": "45",
                    "text": "45 seconds"
                },
                {
                    "value": "60",
                    "text": "a minute"
                }
            ]
        },
        {
            "tab": "Notifications",
            "group": "Head Viewer",
            "name": "HeadViewer_autoHide",
            "type": "checkbox",
            "label": "Close the Head Viewer when there is nothing to show"
        },
        {
            "tab": "Notifications",
            "group": "Head Viewer",
            "name": "HeadViewer_Non-Breaking_SPace",
            "type": "description",
            "text": ""
        },
        {
            "tab": "Notifications",
            "group": "Head Viewer",
            "name": "HeadViewer_closeBehavior",
            "type": "radioButtons",
            "label": "Clicking on the \"close\" button will:",
            "options": [
                {
                    "value": "closeAll",
                    "text": "close Head Viewer on every window, until you reopen it"
                }
            ]
        }
    ]
};
