window.addEvent("domready", function (event) {
    var tab = new Tab($("tab-container"), $("content-container"));
    tab.new();
    tab.new();
    tab.new();
    tab.new();
    tab.new();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    return;
    // Create tabs
    var tabs = [
        "Preferences",
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
