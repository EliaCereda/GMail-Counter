this.manifest = {
    "name": i18n.get("title"),
    "icon": "../Icon.png",
    "settings": [
        {
            "tab":  i18n.get("general"),
            "group": i18n.get("behavior"),
            
            "name": "Behavior_label",
            "type": "text",
            "label": i18n.get("Behavior_label"),
            "text": i18n.get("Behavior_label-text")
        },
        {
            "tab": i18n.get("general"),
            "group": i18n.get("behavior"),
            "name": "Behavior_openLinksIn",
            "type": "radioButtons",
            "label": i18n.get("Behavior_openLinksIn"),
            "options": [
                [
                    "GmailTab",
                    i18n.get("Behavior_openLinksIn-GmailTab")
                ],
                [
                    "activeTab",
                    i18n.get("Behavior_openLinksIn-activeTab")
                ],
                [
                    "newTab",
                    i18n.get("Behavior_openLinksIn-newTab")
                ],
                [
                    "newWindow",
                    i18n.get("Behavior_openLinksIn-newWindow")
                ]
            ]
        },
        {
            "tab": i18n.get("general"),
            "group": i18n.get("GoogleApps"),
            "name": "GoogleApps_enable",
            "type": "checkbox",
            "label": i18n.get("enable")
        },
        {
            "tab": i18n.get("general"),
            "group": i18n.get("GoogleApps"),
            "name": "GoogleApps_domain",
            "type": "text",
            "label": i18n.get("GoogleApps_domain"),
            "text": i18n.get("GoogleApps_domain-text")
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("sounds"),
            "name": "Sounds_enable",
            "type": "checkbox",
            "label": i18n.get("enable")
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("sounds"),
            "name": "Sounds_volume",
            "type": "slider",
            "label": i18n.get("Sounds_volume"),
            "max": 1,
            "min": 0,
            "step": 0.01,
			"display": true,
            "displayModifier": function (value) {
                return (value * 100).floor() + "%";
            }
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("sounds"),
            "name": "Sounds_Non-Breaking_SPace",
            "type": "description",
            "text": ""
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("sounds"),
            "name": "Sounds_description",
            "type": "description",
            "text": i18n.get("Sounds_description")
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("sounds"),
            "name": "Sounds_name",
            "type": "text",
            "label": i18n.get("Sounds_name"),
            "text": i18n.get("Sounds_name-text")
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("sounds"),
            "name": "Sounds_choose",
            "type": "button",
            "text": i18n.get("Sounds_choose")
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("HeadViewer"),
            "name": "HeadViewer_description",
            "type": "description",
            "text": i18n.get("HeadViewer_description")
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("HeadViewer"),
            "name": "HeadViewer_interval",
            "type": "popupButton",
            "label": i18n.get("HeadViewer_interval"),
            "options": [
                [
                    "2",
                    "2 "+i18n.get("HeadViewer_interval-secondsSuffix")
                ],  
                [   
                    "5",
                    "5 "+i18n.get("HeadViewer_interval-secondsSuffix")
                ],  
                [   
                    "10",
                    "10 "+i18n.get("HeadViewer_interval-secondsSuffix")
                ],  
                [   
                    "15",
                    "15 "+i18n.get("HeadViewer_interval-secondsSuffix")
                ],  
                [   
                    "20",
                    "20 "+i18n.get("HeadViewer_interval-secondsSuffix")
                ],  
                [   
                    "30",
                    "30 "+i18n.get("HeadViewer_interval-secondsSuffix")
                ],  
                [   
                    "45",
                    "45 "+i18n.get("HeadViewer_interval-secondsSuffix")
                ],  
                [   
                    "60",
                    i18n.get("HeadViewer_interval-aMinute")
                ]
            ]
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("HeadViewer"),
            "name": "HeadViewer_autoHide",
            "type": "checkbox",
            "label": i18n.get("HeadViewer_autoHide")
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("HeadViewer"),
            "name": "HeadViewer_Non-Breaking_SPace",
            "type": "description",
            "text": ""
        },
        {
            "tab": i18n.get("notifications"),
            "group": i18n.get("HeadViewer"),
            "name": "HeadViewer_closeBehavior",
            "type": "radioButtons",
            "label": i18n.get("HeadViewer_closeBehavior"),
            "options": [
                [
                    "closeAll",
                    i18n.get("HeadViewer_closeBehavior-closeAll")
                ]
            ]
        }
    ]
};
