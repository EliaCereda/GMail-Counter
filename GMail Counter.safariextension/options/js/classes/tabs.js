(function () {
    function tabClicked(event) {
        this.select(event.target);
    }
    
    window.Tabs = new Class({
        "initialize": function (tabs, contents) {
            tabs.each((function (tab, index) {
                tabs[index].content = contents[index];
                tab.addEvent("click", tabClicked.bind(this));
            }).bind(this));
            
            this.select(tabs[0]);
        },
        
        "deselect": function () {
            if (this.selectedTab) {
                this.selectedTab.removeClass("selected");
                this.selectedTab.content.setStyle("display", "none");
                
                this.selectedTab = null;
            }
        },
        
        "select": function (tab) {
            this.deselect();
            
            tab.addClass("selected");
            tab.content.setStyle("display", "block");
            
            this.selectedTab = tab;
        }
    });
})();
