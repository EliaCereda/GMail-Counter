window.addEvent("domready", function (event) {
    // Create tabs
    var tabs = [
        "Grundeinstellungen",
        "Privates",
        "Details"
    ];
    var contents = [1,2,3];
    
    tabs.each(function (tab, index) {
        tabs[index] = new Element("div", {
            "class": "tab",
            "text": tab
        });
        
        tabs[index].inject($("tab-container"));
    });
    
    contents.each(function (content, index) {
        contents[index] = new Element("div", {
            "class": "content"
        });
        
        contents[index].inject($("content-container"));
    });
    
    new Tabs(tabs, contents);
});
