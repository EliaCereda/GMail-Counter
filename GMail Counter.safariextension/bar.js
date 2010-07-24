		var active = "1";
		var newTab;
		
		function init() {
			repositionate();

			body = document.getElementById('body');
			color_1 = document.getElementById('background_1').innerHTML;
				background_1 = color_1.split(";")[0]
				text_1 = color_1.split(";")[1]
			
			body.style.background = background_1;
			body.style.color = text_1;
			
			data = getLatestDatas();
			update(data);
		}
			
		function repositionate() {
			container_1 = document.getElementById('container_1');
			container_2 = document.getElementById('container_2');
			
			container_1_style = document.defaultView.getComputedStyle(container_1, "");
			container_2_style = document.defaultView.getComputedStyle(container_2, "");
			
			container_1_size = container_1_style.width.split("px");
			container_2_size = container_2_style.width.split("px");
			
			container_1_width = container_1_size[0];
			container_2_width = container_2_size[0];
			
			window_size = window.innerWidth;
			
			container_1_position = (window_size/2) - (container_1_width/2);
			container_2_position = (window_size/2) - (container_2_width/2);
			
			container_1.style.left = container_1_position+"px";
			container_2.style.left = container_2_position+"px";
			
			return 1;
			
		}
		function toggle() {
			container_1 = document.getElementById('container_1');
			container_2 = document.getElementById('container_2');
			
			messageNumber_1 = document.getElementById('messageNumber_1');
			messageNumber_2 = document.getElementById('messageNumber_2');
			
			
			body = document.getElementById('body');
			newButton = document.getElementById('new');
			
			color_1 = document.getElementById('background_1').innerHTML;
				background_1 = color_1.split(";")[0]
				text_1 = color_1.split(";")[1]
				new_1 = color_1.split(";")[2]
			color_2 = document.getElementById('background_2').innerHTML;
				background_2 = color_2.split(";")[0]
				text_2 = color_2.split(";")[1]
				new_2 = color_2.split(";")[2]
			
			switch ( active ) {
				case "1":
					container_2.style.webkitTransform='translate(0,0)';
					container_1.style.webkitTransform='translate(0,-40px)';
					
					messageNumber_2.style.webkitTransform='translate(0,0)';
					messageNumber_1.style.webkitTransform='translate(0,40px)';
					
					body.style.background = background_2;
					body.style.color = text_2;
					
					if(new_2 == 1) {
						removeClass(newButton, "new_light");
						addClass(newButton, "new_dark");
					} else {
						removeClass(newButton, "new_dark");
						addClass(newButton, "new_light");
					}
					
					active = "2";
					break;
				
				case "2":
					container_1.style.webkitTransform='translate(0,0)';
					container_2.style.webkitTransform='translate(0,-40px)';
					
					messageNumber_1.style.webkitTransform='translate(0,0)';
					messageNumber_2.style.webkitTransform='translate(0,40px)';
					
					body.style.background = background_1;
					body.style.color = text_1;
					
					if(new_1 == 1) {
						removeClass(newButton, "new_light");
						addClass(newButton, "new_dark");
					} else {
						removeClass(newButton, "new_dark");
						addClass(newButton, "new_light");
					}
					
					active = "1";
					break;
			}
			
		}
		
		function update (data) {
			content = data['content'];
			sender = data['sender'];
			background = data['background'];
			link = data['link'];
			
			current = data["current"];
			total = data["total"]
			
			a = (active==1)?2:1;
			
			content_span = document.getElementById("content_"+a);
			sender_span = document.getElementById("sender_"+a);
			background_span = document.getElementById("background_"+a);
			link_span = document.getElementById("link_"+a);
			
			current_span = document.getElementById("current_"+a);
			total_span = document.getElementById("total_"+a);
			
			content_span.innerHTML = content;
			sender_span.innerHTML = sender;
			background_span.innerHTML = background;
			link_span.innerText = link;
			
			current_span.innerHTML = current;
			total_span.innerHTML = total;
			
			repositionate();
			toggle();
			return 1;
		}
		
		function getLatestDatas(  ) {
			currentIndex = safari.extension.globalPage.contentWindow.currentIndex;
			mails = safari.extension.globalPage.contentWindow.mails;
			console.log(mails)
			
			data = mails[currentIndex];
			return data;
		}
		
		function next() {
			safari.extension.globalPage.contentWindow.updateBars();
		}
		
		function openInTab(link) {

			if (safari.extension.settings.getItem("tab")) {
				if (typeof(newTab) == 'undefined' || typeof(newTab.url) == 'undefined') {
					newTab = safari.application.activeBrowserWindow.openTab();
				}
				newTab.url = link;
				newTab.activate();
				newTab.browserWindow.activate();
			} else {
				safari.application.activeBrowserWindow.activeTab.url = link;
			}
		}
		
		function newMessage() {
			baseURL = safari.extension.globalPage.contentWindow.getGmailUrl(false);
			openInTab(baseURL+"#compose");
		}
		
		function hideBars() {
			safari.extension.globalPage.contentWindow.hideBars();
		}

//Thanks to www.OpenJS.com for this code
		function hasClass(ele,cls) {
			return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
		}

		function addClass(ele,cls) {
			if (!this.hasClass(ele,cls)) ele.className += " "+cls;
		}
		
		function removeClass(ele,cls) {
			if (hasClass(ele,cls)) {
		    	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
				ele.className=ele.className.replace(reg,' ');
			}
		}
//END of OpenJS's code

		window.onresize = repositionate;