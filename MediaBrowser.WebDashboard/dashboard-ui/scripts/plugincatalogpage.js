define(["jQuery","loading","libraryMenu","cardStyle"],function($,loading,libraryMenu){"use strict";function reloadList(page){loading.show(),AppInfo.enableAppStorePolicy?$(".optionAdultContainer",page).hide():$(".optionAdultContainer",page).show(),query.IsAppStoreSafe=!0;var promise1=ApiClient.getAvailablePlugins(query),promise2=ApiClient.getInstalledPlugins();Promise.all([promise1,promise2]).then(function(responses){populateList({catalogElement:$("#pluginTiles",page),noItemsElement:$("#noPlugins",page),availablePlugins:responses[0],installedPlugins:responses[1]})})}function populateList(options){populateListInternal(options)}function populateListInternal(options){var availablePlugins=options.availablePlugins,installedPlugins=options.installedPlugins,allPlugins=availablePlugins.filter(function(p){return p.category=p.category||"General",p.categoryDisplayName=Globalize.translate("PluginCategory"+p.category.replace(" ","")),(!options.categories||options.categories.indexOf(p.category)!=-1)&&((!options.targetSystem||p.targetSystem==options.targetSystem)&&"UserInstalled"==p.type)});availablePlugins=allPlugins.sort(function(a,b){var aName=a.category,bName=b.category;return aName>bName?1:bName>aName?-1:(aName=a.name,bName=b.name,aName>bName?1:bName>aName?-1:0)});var i,length,plugin,currentCategory,html="";if(!options.categories){currentCategory=Globalize.translate("HeaderTopPlugins"),html+='<div class="detailSectionHeader"><h1>'+currentCategory+"</h1></div>";var topPlugins=allPlugins.slice(0).sort(function(a,b){if(a.installs>b.installs)return-1;if(b.installs>a.installs)return 1;var aName=a.name,bName=b.name;return aName>bName?1:bName>aName?-1:0});html+='<div class="itemsContainer vertical-wrap">';var limit=screen.availWidth>=1920?15:12;for(i=0,length=Math.min(topPlugins.length,limit);i<length;i++)html+=getPluginHtml(topPlugins[i],options,installedPlugins);html+="</div>",html+="<br/>",html+="<br/>"}var hasOpenTag=!1;for(currentCategory=null,options.showCategory===!1&&(html+='<div class="itemsContainer vertical-wrap">',hasOpenTag=!0),i=0,length=availablePlugins.length;i<length;i++){plugin=availablePlugins[i];var category=plugin.categoryDisplayName;category!=currentCategory&&(options.showCategory!==!1&&(currentCategory&&(hasOpenTag=!1,html+="</div>",html+="<br/>",html+="<br/>"),html+='<div class="detailSectionHeader"><h1>'+category+"</h1></div>",html+='<div class="itemsContainer vertical-wrap">',hasOpenTag=!0),currentCategory=category),html+=getPluginHtml(plugin,options,installedPlugins)}hasOpenTag&&(html+="</div>"),!availablePlugins.length&&options.noItemsElement&&$(options.noItemsElement).hide(),$(options.catalogElement).html(html),loading.hide()}function getPluginHtml(plugin,options,installedPlugins){var html="",href=plugin.externalUrl?plugin.externalUrl:"addplugin.html?name="+encodeURIComponent(plugin.name)+"&guid="+plugin.guid;options.context&&(href+="&context="+options.context);var target=plugin.externalUrl?' target="_blank"':"";html+="<div class='card backdropCard scalableCard backdropCard-scalable'>",html+='<div class="cardBox cardBox-bottompadded visualCardBox">',html+='<div class="cardScalable visualCardBox-cardScalable">',html+='<div class="cardPadder cardPadder-backdrop"></div>',html+='<a class="cardContent" href="'+href+'"'+target+">",html+=plugin.thumbImage?'<div class="cardImage" style="background-image:url(\''+plugin.thumbImage+"');\">":'<div class="cardImage" style="background-image:url(\'css/images/items/list/collection.png\');">',plugin.isPremium&&(html+=plugin.price>0?"<div class='premiumBanner'><img src='css/images/supporter/premiumflag.png' /></div>":"<div class='premiumBanner'><img src='css/images/supporter/supporterflag.png' /></div>"),html+="</div>",html+="</a>",html+="</div>",html+='<div class="cardFooter visualCardBox-cardFooter">',html+="<div class='cardText'>",html+=plugin.name,html+="</div>";var installedPlugin=plugin.isApp?null:installedPlugins.filter(function(ip){return ip.Id==plugin.guid})[0];return html+="<div class='cardText cardText-secondary'>",html+=installedPlugin?Globalize.translate("LabelVersionInstalled").replace("{0}",installedPlugin.Version):"&nbsp;",html+="</div>",html+="</div>",html+="</div>",html+="</div>"}function getTabs(){return[{href:"plugins.html",name:Globalize.translate("TabMyPlugins")},{href:"plugincatalog.html",name:Globalize.translate("TabCatalog")}]}var query={TargetSystems:"Server",IsAdult:!1};$(document).on("pageinit","#pluginCatalogPage",function(){var page=this;$("#selectSystem",page).on("change",function(){query.TargetSystems=this.value,reloadList(page)}),$("#chkAdult",page).on("change",function(){query.IsAdult=!!this.checked&&null,reloadList(page)})}).on("pageshow","#pluginCatalogPage",function(){libraryMenu.setTabs("plugins",1,getTabs);var page=this;reloadList(page)}),window.PluginCatalog={renderCatalog:populateList}});