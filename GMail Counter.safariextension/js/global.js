/*
--------------------------------
	global.css
	Author: Elia Cereda
	© 2010 All rights reserved.
	
	Global page Javascript file
--------------------------------

This file is part of Safari's Extension "GMail Counter", developed by Elia Cereda <cereda.extensions@yahoo.it>

If you redestribute, edit or share this file you MUST INCLUDE THIS NOTICE and you cannot remove it without prior written permission by Elia Cereda.
If you use this file or its derivates in your projects you MUST release it with this or any other compatible license.

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
	Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/

Global = {
	
	mailsCount: 0, //Number of unreaded mails
	mailsArray: [], //Array of latest 20 unreaded mails
	
	currentIndex: 0, //The current mail index in the mailsArray
	
	init: function () {
		safari.extension.bars.forEach(function(item) {
			ExtensionBar = item.contentWindow.ExtensionBar;
			
			if (typeof(ExtensionBar) != 'undefined' || typeof(ExtensionBar.activate) != 'undefined') {
				ExtensionBar.activate();
			}
		});
	},
	
	processActivation: function (caller) {
		caller.activate()
	},
	
	validate: function(event) {
		if (event.command === "button") {
			
			GMail.checkLogin(Global.callback);
		}
	},
	
	command: function(event) {
		Global.openLink(GMail.GMailBaseURL(false));
	},
	
	callback: function (sender, message) {
		switch ( sender ) {
			case "checkLogin":
				if (message === true) {
					GMail.updateFeed(Global.callback);
				} else {
					Global.loadData();
				}
			break;
			
			case "updateFeed":
				if (message != "error" && message !== null) {
					GMail.parseFeed(Global.callback);
				} else {
					Global.loadData();
				}
			break;
			
			case "parseFeed":
				switch ( message ) {
					case "noNewMails":
						Global.checkNoNewMails(true);
					break;
					
					default:
						Global.loadData();
					break;
				}
			break;
				
		}
	},
	
	loadData: function () {
		this.mailsCount = GMail.getMailsCount();
		this.mailsArray = GMail.getMailsArray();
		
		safari.extension.toolbarItems.forEach(function(item) {
			if(item.command === "button") {
				if(Global.mailsCount != 0) {
					item.toolTip = "GMail Counter - "+Global.mailsCount+" new message"+(Global.mailsCount == 1?"":"s");
					item.badge = Global.mailsCount;
				} else {
					item.toolTip = "GMail Counter - No new messages";
					item.badge = 0;
				}
			}
		});
	},
	
	checkNoNewMails: function (shouldHide) {
		console.log(shouldHide);
	},

	openLink: function(link) {
		openIn = safari.extension.settings.getItem("openIn");
		
		var _tab = null;
		
		switch ( openIn ) {
			case "newTab":
				_tab = safari.application.activeBrowserWindow.openTab();
			break;
	
			case "GMailTab":
				var _window = null;
				
				safari.application.browserWindows.forEach(function(a) {
					a.tabs.forEach(function(b) {
						if(GMail.isGMailURL(b.url)) {
							_window=a;
							_tab=b;
						}
					});
				});
				
				_window = (_window === null) ? safari.application.activeBrowserWindow : _window;
				_tab =  (_tab === null) ? safari.application.activeBrowserWindow.openTab() : _tab;
				
				_window.activate();
				_tab.activate();
			break;
			
			case "activeTab":
				_tab = safari.application.activeBrowserWindow.activeTab;
			break;
		}
		_tab.url=link;
	}
}

safari.application.addEventListener("validate", Global.validate, false);
safari.application.addEventListener("command", Global.command, false);

window.onload=Global.init;
//safari.extension.settings.addEventListener("change", change, false);