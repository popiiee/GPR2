/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelWebInterface = {};
panelWebInterface.localization = {};
/****************************/

// Panel details
var panelName = "WebInterface";
panelWebInterface._panel = $("#pnl" + panelName);

// Localizations
panelWebInterface.localization = {};

// Assign localizations
localizations.panels[panelName] = $.extend(panelWebInterface.localization, localizations.panels[panelName]);

panelWebInterface.webUIThemes = {
    base: "\r\/* ### Don't change this unless you are sure what you are doing ### */\r\nbody\r\n{\r\nborder:1px solid #eee;\r\n}\r\na,a:visited\r\n{\r\ncolor:#051e42;\r\n}\r\na:hover,a:active\r\n{\r\ncolor:#6c6c6c;\r\n}\r\nTD.directory A\r\n{\r\ncolor:#333;\r\n}\r\nTD.file A\r\n{\r\ncolor:#333;\r\n}\r\n.iconPreviewLink\r\n{\r\ncolor:#333;\r\n}\r\n.rowHover\r\n{\r\nbackground-color:#BDF!important;\r\n}\r\n.rowHoverFixed\r\n{\r\nbackground-color:#BDF!important;\r\n}\r\n.rowHover2\r\n{\r\nbackground-color:#edf4fb!important;\r\n}\r\n.contextMenu\r\n{\r\nborder:solid 1px #CCC;\r\nbackground:#FFF;\r\n}\r\n.contextMenu A\r\n{\r\ncolor:#333;\r\n}\r\n.contextMenu LI.hover A\r\n{\r\ncolor:#FFF;\r\nbackground-color:#39f;\r\n}\r\n.contextMenu LI.disabled A\r\n{\r\ncolor:#AAA;\r\n}\r\n.contextMenu LI.hover.disabled A\r\n{\r\nbackground-color:transparent;\r\n}\r\n.contextMenu LI.separator\r\n{\r\nborder-top:solid 1px #CCC;\r\n}\r\n.disabled\r\n{\r\nbackground-color:#eee!important;\r\n}\r\n.jqueryFilesTable\r\n{\r\nborder-left:1px solid #eee;\r\nborder-right:1px solid #eee;\r\nborder-bottom:1px solid #eee;\r\n}\r\n.jqueryFilesTable thead td\r\n{\r\nbackground:#eee;\r\n}\r\n.jqueryFilesTable td\r\n{\r\nborder-right:1px solid #eee;\r\n}\r\n.customForm\r\n{\r\nborder-top:1px solid #FFF;\r\n}\r\n.customForm td\r\n{\r\nborder-bottom:1px solid #eee;\r\n}\r\n#crumbs\r\n{\r\nborder:1px solid #dedede;\r\n}\r\n#crumbs li\r\n{\r\ncolor:#777;\r\n}\r\n#crumbs li a\r\n{\r\nbackground:url(/WebInterface/jQuery/images/crumbs.gif) no-repeat right center;\r\n}\r\n.filterPanel a,.filterPanel a:visited,.themeSelectionLink\r\n{\r\ncolor:#777;\r\n}\r\n.viewSelectorPanel a.viewlink,.viewSelectorPanel a.viewlink:visited\r\n{\r\ncolor:Black;\r\n}\r\ntable.tablesorter .header\r\n{\r\nborder-left:1px solid #FFF;\r\nborder-top:1px solid #FFF;\r\n}\r\n.fileBox,.fileBoxBasket\r\n{\r\nborder:solid 1px #fff;\r\n}\r\n.fileBox:hover,.fileBoxBasket:hover\r\n{\r\nborder:solid 1px #951919;\r\n}\r\n.fileBox .imgBox,.fileBoxBasket .imgBox\r\n{\r\nborder:solid 1px #ccc;\r\n-moz-box-shadow:3px 2px 4px #ccc;\r\n-webkit-box-shadow:3px 2px 4px #ccc;\r\nbox-shadow:3px 2px 4px #ccc;\r\n}\r\n.fileBoxSelected\r\n{\r\nborder:solid 1px #CCC;\r\n-moz-box-shadow:2px 1px 3px #CCC;\r\n-webkit-box-shadow:2px 1px 3px #CCC;\r\nbox-shadow:2px 1px 3px #CCC;\r\nbackground-color:#feffd3;\r\n}\r\n.fileBoxSelected div\r\n{\r\nbackground-color:#feffd3!important;\r\n}\r\n.fileBox .imgBox .imgLink,.fileBoxBasket .imgBox .imgLink\r\n{\r\ncolor:black;\r\n}\r\n.fileBox a,.fileBox a:visited,.fileBoxBasket a,.fileBox a:visited\r\n{\r\ncolor:Black;\r\n}\r\n.tipsy-inner\r\n{\r\nbackground-color:#ffe;\r\ncolor:black;\r\nborder:1px solid #a6c9e2;\r\n}\r\n.poweredby\r\n{\r\ncolor:#2d2d2d;\r\n}\r\n.copyright\r\n{\r\ncolor:#b8b8b8;\r\n}\r\n.mainNavigation\r\n{\r\nbackground-color:#000;\r\nborder:1px solid #eee;\r\nbackground-color:#f5b451;\r\n}\r\nul.topnav li a\r\n{\r\ncolor:#000;\r\n}\r\nul.topnav li a:hover\r\n{\r\nbackground-color:#eee;\r\n}\r\nul.topnav li span\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\nul.topnav li ul.subnav\r\n{\r\nbackground:#fff;\r\nborder:1px solid #eee;\r\n}\r\nhtml ul.topnav li ul.subnav li a\r\n{\r\nbackground-color:#c6dd82;\r\nborder-bottom:1px solid #eee;\r\n}\r\nhtml ul.topnav li ul.subnav li a:hover\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\n.popupHeader\r\n{\r\nbackground-color:#f1eeee;\r\n}\r\n.tbl\r\n{\r\ncolor:#333;\r\n}\r\n.tblRow\r\n{\r\ncolor:#333;\r\nbackground-color:#f7fafc;\r\n}\r\n.tblAltRow\r\n{\r\ncolor:#284775;\r\nbackground-color:White;\r\n}\r\n.pageHeader\r\n{\r\nbackground-color:#e9eef5;\r\n}\r\n.pageHeader td\r\n{\r\nborder-bottom:5px solid white;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.requiredField\r\n{\r\ncolor:Red;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.popupNote\r\n{\r\ncolor:#a8b35e;\r\n}\r\n#searchResultNotification,#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/folder_magnify.png) no-repeat 5px 1px #fffeee;\r\ncolor:Black;\r\n}\r\n#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/help.png) no-repeat 5px 9px #fffeee;\r\n}\r\n#searchResultNotification a,#searchResultNotification a:visited,#selectionOfItemsOptions a,#selectionOfItemsOptions a:visited\r\n{\r\ncolor:Black;\r\n}\r\nul.filesSelected,ul.filesSelectedInBasket\r\n{\r\nborder-top:1px solid #eee;\r\n}\r\n.filesSelectedInBasket ul\r\n{\r\nborder-top:1px solid #eee;\r\n}\r\nul.groupedItems li\r\n{\r\nborder:1px solid #eee;\r\n}\r\nul.filesSelected li,ul.filesSelectedInBasket li\r\n{\r\nborder-bottom:1px solid #eee;\r\n}\r\n.upload,.shareUploadedItem,.shareAllUploaded\r\n{\r\ncolor:#000!important;\r\n}\r\n.overwriteLink\r\n{\r\ncolor:#000!important;\r\n}\r\n.file\r\n{\r\ncolor:#000!important;\r\n}\r\na.nextButton\r\n{\r\ncolor:#000!important;\r\n}\r\na.whiteError\r\n{\r\ncolor:white;\r\n}\r\n.reupload,.redownload\r\n{\r\ncolor:#000;\r\n}\r\n.clearCompleted\r\n{\r\ncolor:#000!important;\r\n}\r\n.download,.shareBasketItems\r\n{\r\ncolor:#000;\r\n}\r\n.completed\r\n{\r\ncolor:#000;\r\n}\r\n.pause\r\n{\r\ncolor:#000;\r\n}\r\n.resume\r\n{\r\ncolor:#000;\r\n}\r\n.skip\r\n{\r\ncolor:#000;\r\n}\r\n.stop\r\n{\r\ncolor:#000;\r\n}\r\n.appletActionButtons\r\n{\r\nborder:1px solid #ccc;\r\n}\r\n.attention\r\n{\r\ncolor:#ff0404;\r\n}\r\n.autoReplyOptionPanel\r\n{\r\nborder-top:1px solid #fff;\r\n}\r\n.uploadCancel\r\n{\r\ncolor:#000!important;\r\n}\r\n.spinner\r\n{\r\nbackground:url(/WebInterface/jQuery/images/spinner.gif) left no-repeat!important;\r\n}\r\n.customtabs a\r\n{\r\nbackground-color:#eee;\r\ncolor:#2c2a2a!important;\r\n}\r\n.customtabs a.active\r\n{\r\nbackground-color:#807b7b;\r\ncolor:#fff!important;\r\n}\r\n.tab_content\r\n{\r\nborder:1px solid #b8b7b7;\r\n}\r\n.dragOver\r\n{\r\nborder:3px solid #f47373;\r\nborder-color:green;\r\n}\r\n.myForm input[type=text],.myForm textarea\r\n{\r\ncolor:#051e42;\r\nbackground:#f5f5f5;\r\nborder:1px solid black;\r\n}\r\n.submit input\r\n{\r\ncolor:black;\r\nbackground:#f7fafc;\r\nborder:2px solid #ebebeb;\r\n}\r\n.myForm fieldset\r\n{\r\nborder:1px solid black;\r\n}\r\n.myForm legend\r\n{\r\ncolor:White;\r\nbackground:black;\r\nborder:1px solid black;\r\n}\r\n.manageShareTable\r\n{\r\nborder:1px solid #eee;\r\n}\r\n.shareItemDetails\r\n{\r\nborder-top:1px solid #eee;\r\nborder-bottom:1px solid #eee;\r\n}\r\n.highlight\r\n{\r\nbackground-color:#f2f9be;\r\n}\r\n.pagination a\r\n{\r\ntext-decoration:none;\r\nborder:solid 1px #AAE;\r\ncolor:#15B;\r\n}\r\n.pagination .current\r\n{\r\nbackground:#26B;\r\ncolor:#fff;\r\nborder:solid 1px #AAE;\r\n}\r\n.pagination .current.prev,.pagination .current.next\r\n{\r\ncolor:#999;\r\nborder-color:#999;\r\nbackground:#fff;\r\n}\r\n.slowUploadIcon\r\n{\r\nbackground:white;\r\n}\r\n.ui-dialog .ui-widget-content\r\n{\r\nbackground-color:white;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:white;\r\n}\r\n#manageSyncPanel\r\n{\r\nbackground-color:#fff;\r\n}\r\n.exifInfoPanel\r\n{\r\nbackground-color:black;\r\ncolor:white;\r\nborder:1px solid #ccc;\r\n}\r\n.exifInfoPanelCollapsed\r\n{\r\ncolor:white;\r\n}\r\nli .framePreviewBox div\r\n{\r\nborder:1px solid #CCC;\r\n-moz-box-shadow:2px 2px 3px #ccc;\r\n-webkit-box-shadow:2px 2px 3px #ccc;\r\nbox-shadow:2px 2px 3px #ccc;\r\n}\r\ntd .framePreviewBox div\r\n{\r\nborder:1px solid #CCC;\r\n}\r\n",
    dark: "\r\/* ### Don't change this unless you are sure what you are doing ### */\r\nbody,input,select,textarea\r\n{\r\nbackground-color:#000000;\r\nborder:1px solid #4d4d4d;\r\ncolor:#fafafa;\r\n}\r\nhr\r\n{\r\nbackground-color:#000000;\r\nborder:1px solid #4d4d4d;\r\n}\r\na,a:visited,.ui-dialog a,.ui-dialog .ui-widget-content a\r\n{\r\ncolor:#fafafa;\r\n}\r\na:hover,a:active\r\n{\r\ncolor:#fafafa;\r\n}\r\nTD.directory A\r\n{\r\ncolor:#fafafa;\r\n}\r\nTD.file A\r\n{\r\ncolor:#fafafa;\r\n}\r\n.iconPreviewLink\r\n{\r\ncolor:#fafafa;\r\n}\r\n.rowHover\r\n{\r\nbackground-color:#332f31!important;\r\n}\r\n.rowHoverFixed\r\n{\r\nbackground-color:#332f31!important;\r\n}\r\n.rowHover2\r\n{\r\nbackground-color:#332f31!important;\r\n}\r\n.contextMenu\r\n{\r\nborder:solid 1px #4d4d4d;\r\nbackground:#242021;\r\n}\r\n.contextMenu A\r\n{\r\ncolor:#fafafa;\r\n}\r\n.contextMenu LI.hover A\r\n{\r\ncolor:#f2f2dc;\r\nbackground-color:#332f31;\r\n}\r\n.contextMenu LI.disabled A\r\n{\r\ncolor:#AAA;\r\n}\r\n.contextMenu LI.hover.disabled A\r\n{\r\nbackground-color:transparent;\r\n}\r\n.contextMenu LI.separator\r\n{\r\nborder-top:solid 1px #4d4d4d;\r\n}\r\n.disabled\r\n{\r\nbackground-color:#eee!important;\r\n}\r\n.jqueryFilesTable\r\n{\r\nborder-left:1px solid #4d4d4d;\r\nborder-right:1px solid #4d4d4d;\r\nborder-bottom:1px solid #4d4d4d;\r\n}\r\n.jqueryFilesTable thead td\r\n{\r\nbackground:#40403e;\r\n}\r\n.jqueryFilesTable td\r\n{\r\nborder-right:1px solid #4d4d4d;\r\n}\r\n.customForm\r\n{\r\nborder-top:1px solid #4d4d4d;\r\n}\r\n.customForm td\r\n{\r\nborder-bottom:1px solid #4d4d4d;\r\n}\r\n#crumbs\r\n{\r\nborder:1px solid #4d4d4d;\r\n}\r\n#crumbs li\r\n{\r\ncolor:#fafafa;\r\n}\r\n#crumbs li a\r\n{\r\nbackground:url(/WebInterface/jQuery/images/crumbs.gif) no-repeat right center;\r\n}\r\n.filterPanel a,.filterPanel a:visited\r\n{\r\ncolor:#fafafa;\r\n}\r\n.viewSelectorPanel a.viewlink,.viewSelectorPanel a.viewlink:visited\r\n{\r\ncolor:#fafafa;\r\n}\r\ntable.tablesorter .header\r\n{\r\nborder-left:1px solid #4d4d4d;\r\nborder-top:1px solid #4d4d4d;\r\n}\r\n.fileBox,.fileBoxBasket\r\n{\r\ncolor:#fafafa;\r\nborder:solid 1px #000000;\r\n}\r\n.fileBox a,.fileBoxBasket a\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.fileBox:hover,.fileBoxBasket:hover\r\n{\r\nborder:solid 1px #4c4d4b;\r\n}\r\n.fileBox .imgBox,.fileBoxBasket .imgBox\r\n{\r\nborder:solid 1px #4c4d4b;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\n}\r\n.fileBoxSelected\r\n{\r\nbackground-color:#313131;\r\nborder:solid 1px transparent;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\n}\r\n.fileBoxSelected div,.fileBoxSelected div .items-count-thumb\r\n{\r\nbackground-color: transparent !important;\r\n}\r\n.fileBox .imgBox .imgLink,.fileBoxBasket .imgBox .imgLink\r\n{\r\ncolor:#fafafa;\r\n}\r\n.fileBox a,.fileBox a:visited,.fileBoxBasket a,.fileBox a:visited\r\n{\r\ncolor:#fafafa;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#000000!important;\r\nborder:1px solid #4d4d4d!important;\r\ncolor:#fafafa!important;\r\n}\r\np#vtip,.cluetip-default,#cluetip-title\r\n{\r\nbackground-color:#332f31!important;\r\ncolor:#fafafa!important;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#frmShareWindow\r\n{\r\ncolor:#fafafa;\r\n}\r\n#loadingIndicator\r\n{\r\nborder: none !important;\r\n}\r\n.loadingIndicatorWindow\r\n{\r\nbackground-color:#fafafa!important;\r\ncolor:black!important;\r\nborder:0px !important;\r\n;\r\n}\r\n.poweredby\r\n{\r\ncolor:#6b6b64;\r\n}\r\n.copyright\r\n{\r\ncolor:#6b6b64;\r\n}\r\n.mainNavigation\r\n{\r\nborder:1px solid #4d4d4d;\r\nbackground-color:#40403e;\r\ncolor:#fafafa;\r\n}\r\nul.topnav li a\r\n{\r\ncolor:#fafafa;\r\n}\r\nul.topnav li a:hover\r\n{\r\nbackground-color:#1c1c17;\r\n-webkit-border-radius:5px 5px 5px 5px;\r\n-moz-border-radius:5px 5px 5px 5px;\r\nborder-radius:5px 5px 5px 5px;\r\n}\r\nul.topnav li span\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\nul.topnav li ul.subnav\r\n{\r\nbackground:#fff;\r\nborder:1px solid #4d4d4d;\r\n}\r\nhtml ul.topnav li ul.subnav li a\r\n{\r\nbackground-color:#c6dd82;\r\nborder-bottom:1px solid #4d4d4d;\r\n}\r\nhtml ul.topnav li ul.subnav li a:hover\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\n.blockUI\r\n{\r\nborder:1px solid #4d4d4d!important;\r\nbackground-color:#332f31!important;\r\ncolor:#fafafa!important;\r\n}\r\n.popupHeader\r\n{\r\nbackground-color:#1c191a!important;\r\nborder:1px solid #4d4d4d!important;\r\ncolor:#fafafa!important;\r\nmargin-bottom:5px;\r\n}\r\n.tbl\r\n{\r\ncolor:#fafafa;\r\n}\r\n.tblRow\r\n{\r\ncolor:#fafafa;\r\nbackground-color:#332f31;\r\n}\r\n.tblAltRow\r\n{\r\ncolor:#fafafa;\r\nbackground-color:#4a4547;\r\n}\r\n.pageHeader\r\n{\r\nbackground-color:#e9eef5;\r\n}\r\n.pageHeader td\r\n{\r\nborder-bottom:5px solid #4d4d4d;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.requiredField\r\n{\r\ncolor:Red;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.popupNote\r\n{\r\ncolor:#a8b35e;\r\n}\r\n#searchResultNotification,#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/folder_magnify.png) no-repeat 5px 1px #ababa6;\r\ncolor:Black;\r\n}\r\n#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/help.png) no-repeat 5px 9px #fffeee;\r\n}\r\n#searchResultNotification a,#searchResultNotification a:visited,#selectionOfItemsOptions a,#selectionOfItemsOptions a:visited\r\n{\r\ncolor:Black;\r\n}\r\nul.filesSelected,ul.filesSelectedInBasket\r\n{\r\nborder-top:1px solid #4d4d4d;\r\n}\r\n.filesSelectedInBasket ul\r\n{\r\nborder-top:1px solid #4d4d4d;\r\n}\r\nul.groupedItems li\r\n{\r\nborder:1px solid #4d4d4d;\r\n}\r\nul.filesSelected li,ul.filesSelectedInBasket li\r\n{\r\nborder-bottom:1px solid #4d4d4d;\r\n}\r\n.upload,.shareUploadedItem,.shareAllUploaded\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.overwriteLink\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.file\r\n{\r\ncolor:#fafafa!important;\r\n}\r\na.nextButton\r\n{\r\ncolor:#fafafa!important;\r\n}\r\na.whiteError\r\n{\r\ncolor:#fafafa;\r\n}\r\n.reupload,.redownload\r\n{\r\ncolor:#fafafa;\r\n}\r\n.clearCompleted\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.download,.shareBasketItems\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.completed\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.pause,.resume,.skip,.stop\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.appletActionButtons\r\n{\r\nborder:1px solid #4d4d4d;\r\n}\r\n.attention\r\n{\r\ncolor:#ff0404;\r\n}\r\n.autoReplyOptionPanel\r\n{\r\nborder-top:1px solid #4d4d4d;\r\n}\r\n.uploadCancel\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.spinner\r\n{\r\nbackground:url(/WebInterface/jQuery/images/spinner.gif) left no-repeat!important;\r\n}\r\n.customtabs a\r\n{\r\nbackground-color:#eee;\r\ncolor:#2c2a2a!important;\r\n}\r\n.customtabs a.active\r\n{\r\nbackground-color:#807b7b;\r\ncolor:#fff!important;\r\n}\r\n.tab_content\r\n{\r\nborder:1px solid #4d4d4d;\r\n}\r\n.dragOver\r\n{\r\nborder:3px solid #4d4d4d;\r\nborder-color:green;\r\n}\r\n.myForm input[type=text],.myForm textarea\r\n{\r\ncolor:#051e42;\r\nbackground:#f5f5f5;\r\nborder:1px solid 4D4D4D;\r\n}\r\n.submit input\r\n{\r\ncolor:black;\r\nbackground:#f7fafc;\r\nborder:2px solid #4d4d4d;\r\n}\r\n.myForm fieldset\r\n{\r\nborder:1px solid #4d4d4d;\r\n}\r\n.myForm legend\r\n{\r\ncolor:#fafafa;\r\nbackground:black;\r\nborder:1px solid #4d4d4d;\r\n}\r\n.manageShareTable\r\n{\r\nborder:1px solid #4d4d4d;\r\n}\r\n.shareItemDetails\r\n{\r\nborder-top:1px solid #4d4d4d;\r\nborder-bottom:1px solid #4d4d4d;\r\n}\r\n.highlight\r\n{\r\nbackground-color:#f2f9be;\r\n}\r\n.pagination a\r\n{\r\ntext-decoration:none;\r\nborder:solid 1px #4d4d4d;\r\ncolor:#15B;\r\n}\r\n.pagination .current\r\n{\r\nbackground:#26B;\r\ncolor:#fff;\r\nborder:solid 1px #4d4d4d;\r\n}\r\n.pagination .current.prev,.pagination .current.next\r\n{\r\ncolor:#999;\r\nborder-color:#4d4d4d;\r\nbackground:#fff;\r\n}\r\n.slowUploadIcon\r\n{\r\nbackground:#fafafa;\r\n}\r\n.ui-dialog .ui-widget-content\r\n{\r\nbackground-color:#fafafa;\r\n;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#fafafa;\r\n}\r\n#manageSyncPanel\r\n{\r\nbackground-color:#fff;\r\n}\r\n.exifInfoPanel\r\n{\r\nbackground-color:black;\r\ncolor:#fafafa;\r\nborder:1px solid #4d4d4d;\r\n}\r\n.exifInfoPanelCollapsed\r\n{\r\ncolor:#fafafa;\r\n}\r\nli .framePreviewBox div\r\n{\r\nborder:1px solid #4d4d4d;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\ntd .framePreviewBox div\r\n{\r\nborder:1px solid #4d4d4d;\r\n}\r\n.ui-widget-content\r\n{\r\nbackground:#000000!important;\r\ncolor:#fafafa!important;\r\nborder:1px solid #4d4d4d!important;\r\n}\r\n.ui-widget-header\r\n{\r\nbackground:#1c1c17!important;\r\ncolor:#fafafa!important;\r\nborder:none!important;\r\npadding:8px!important;\r\nmargin:0 0 5px 0!important;\r\n}\r\n.ui-progressbar-value.ui-widget-header\r\n{\r\npadding:0!important;\r\nmargin:0!important;\r\nbackground:#1c191a url(/WebInterface/jQuery/images/pbar-ani.gif)!important;\r\n}\r\n#uploadInfoForm\r\n{\r\nbackground-color:#000000;\r\n}\r\n#fileQueueInfo\r\n{\r\nclear:both;\r\nbackground:#000000!important;\r\nborder:1px solid #4d4d4d;\r\n}\r\n.ui-state-error a\r\n{\r\ncolor:#fafafa!important;\r\n}\r\n.uploadDialog .ui-dialog div\r\n{\r\nbackground-color:#fafafa;\r\n}\r\n.fileListPanelInfoText\r\n{\r\nbackground-color:#000000;\r\nborder:1px solid #4d4d4d;\r\n}\r\n.groupCount\r\n{\r\nbackground:#000000;\r\nborder:2px solid #4d4d4d;\r\n}\r\n#dropItemsPanel\r\n{\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.dropzone.hover\r\n{\r\nbackground:#ff9;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#fileRepo\r\n{\r\nborder:1px solid #4d4d4d;\r\nbackground-color:#000000;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.formOption\r\n{\r\nborder:1px solid #eee;\r\n}\r\n.ui-progressbar-value\r\n{\r\nbackground-image:url(/WebInterface/jQuery/images/animated-overlay.gif);\r\n}\r\ndiv#languageSelector {background: transparent;}\r\n\r\ntable.tablesorter thead tr td:last-child {border-top-right-radius: 10px;}\r\ntable.tablesorter thead tr td:first-child {border-top-left-radius: 10px;}\r\ntable.tablesorter tbody tr td:last-child {border: 0px;}\r\n",
    bluewhite: "\r\/* ### Don't change this unless you are sure what you are doing ### */\r\nbody,input,select,textarea\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #4c66a4;\r\ncolor:#000;\r\n}\r\nhr\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #4c66a4;\r\n}\r\na,a:visited,.ui-dialog a,.ui-dialog .ui-widget-content a\r\n{\r\ncolor:#000;\r\n}\r\na:hover,a:active\r\n{\r\ncolor:#000;\r\n}\r\nTD.directory A\r\n{\r\ncolor:#000;\r\n}\r\nTD.file A\r\n{\r\ncolor:#000;\r\n}\r\n.iconPreviewLink\r\n{\r\ncolor:#000;\r\n}\r\n.rowHover\r\n{\r\nbackground-color:#90a3d1!important;\r\n}\r\n.rowHoverFixed\r\n{\r\nbackground-color:#90a3d1!important;\r\n}\r\n.rowHover2\r\n{\r\nbackground-color:#90a3d1!important;\r\n}\r\n.contextMenu\r\n{\r\nborder:solid 1px #4c66a4;\r\nbackground:#4c66a4;\r\n}\r\n.contextMenu A\r\n{\r\ncolor:#FFF;\r\n}\r\n.contextMenu LI.hover A\r\n{\r\ncolor:#153275;\r\nbackground-color:#90a3d1;\r\n}\r\n.contextMenu LI.disabled A\r\n{\r\ncolor:#AAA;\r\n}\r\n.contextMenu LI.hover.disabled A\r\n{\r\nbackground-color:transparent;\r\n}\r\n.contextMenu LI.separator\r\n{\r\nborder-top:solid 1px #4c66a4;\r\n}\r\n.disabled\r\n{\r\nbackground-color:#eee!important;\r\n}\r\n.jqueryFilesTable\r\n{\r\nborder-left:1px solid #4c66a4;\r\nborder-right:1px solid #4c66a4;\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n.jqueryFilesTable thead td\r\n{\r\nbackground:#4c66a4;\r\ncolor:#fff;\r\n}\r\n.jqueryFilesTable td\r\n{\r\nborder-right:1px solid #4c66a4;\r\n}\r\n.customForm\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.customForm td\r\n{\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n#crumbs\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n#crumbs li\r\n{\r\ncolor:#000;\r\n}\r\n#crumbs li a\r\n{\r\nbackground:url(/WebInterface/jQuery/images/crumbs.gif) no-repeat right center;\r\n}\r\n.filterPanel a,.filterPanel a:visited\r\n{\r\ncolor:#000;\r\n}\r\n.viewSelectorPanel a.viewlink,.viewSelectorPanel a.viewlink:visited\r\n{\r\ncolor:#000;\r\n}\r\ntable.tablesorter .header\r\n{\r\nborder-left:1px solid #4c66a4;\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.fileBox,.fileBoxBasket\r\n{\r\ncolor:#000;\r\nborder:solid 1px #fff;\r\n}\r\n.fileBox a,.fileBoxBasket a\r\n{\r\ncolor:#000!important;\r\n}\r\n.fileBox:hover,.fileBoxBasket:hover\r\n{\r\nborder:solid 1px #6578a3;\r\n}\r\n.fileBox .imgBox,.fileBoxBasket .imgBox\r\n{\r\nborder:solid 1px #6578a3;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\n}\r\n.fileBoxSelected\r\n{\r\nborder:solid 1px #6d6e63;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\nbackground-color:#d5def2;\r\n}\r\n.fileBox .imgBox .imgLink,.fileBoxBasket .imgBox .imgLink\r\n{\r\ncolor:#000;\r\n}\r\n.fileBox a,.fileBox a:visited,.fileBoxBasket a,.fileBox a:visited\r\n{\r\ncolor:#000;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#fff!important;\r\nborder:1px solid #4c66a4!important;\r\ncolor:#000!important;\r\n}\r\np#vtip,.cluetip-default,#cluetip-title\r\n{\r\nbackground-color:#90a3d1!important;\r\ncolor:#000!important;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#frmShareWindow\r\n{\r\ncolor:#000;\r\n}\r\n#loadingIndicator\r\n{\r\nborder:0px !important;\r\n;\r\n}\r\n.loadingIndicatorWindow\r\n{\r\nbackground-color:#fff!important;\r\ncolor:#4c66a4!important;\r\nborder:1px solid #4c66a4;\r\n}\r\n.poweredby,.copyright\r\n{\r\ncolor:#999ea8;\r\n}\r\n.mainNavigation\r\n{\r\nborder:1px solid #4c66a4;\r\nbackground-color:#4c66a4;\r\ncolor:#fff;\r\n}\r\nul.topnav li a\r\n{\r\ncolor:#fff;\r\n}\r\nul.topnav li a:hover\r\n{\r\nbackground-color:#bac7e6;\r\ncolor:#203b7a;\r\n-webkit-border-radius:5px 5px 5px 5px;\r\n-moz-border-radius:5px 5px 5px 5px;\r\nborder-radius:5px 5px 5px 5px;\r\n}\r\nul.topnav li span\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\nul.topnav li ul.subnav\r\n{\r\nbackground:#fff;\r\nborder:1px solid #4c66a4;\r\n}\r\nhtml ul.topnav li ul.subnav li a\r\n{\r\nbackground-color:#c6dd82;\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\nhtml ul.topnav li ul.subnav li a:hover\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\n.blockUI\r\n{\r\nborder:1px solid #4c66a4!important;\r\nbackground-color:#FFF!important;\r\ncolor:#000!important;\r\n}\r\n.popupHeader\r\n{\r\nbackground-color:#4c66a4!important;\r\nborder:1px solid #4c66a4!important;\r\ncolor:#fff!important;\r\nmargin-bottom:5px;\r\n}\r\n.uploadNote\r\n{\r\ncolor:#023102!important;\r\n}\r\n.tbl\r\n{\r\ncolor:#000;\r\n}\r\n.tblRow\r\n{\r\ncolor:#000;\r\nbackground-color:#FFF;\r\n}\r\n.tblAltRow\r\n{\r\ncolor:#000;\r\nbackground-color:#FFF;\r\n}\r\n.pageHeader\r\n{\r\nbackground-color:#e9eef5;\r\n}\r\n.pageHeader td\r\n{\r\nborder-bottom:5px solid #4c66a4;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.requiredField\r\n{\r\ncolor:Red;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.popupNote\r\n{\r\ncolor:#a8b35e;\r\n}\r\n#searchResultNotification,#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/folder_magnify.png) no-repeat 5px 1px #ababa6;\r\ncolor:Black;\r\n}\r\n#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/help.png) no-repeat 5px 9px #fffeee;\r\n}\r\n#searchResultNotification a,#searchResultNotification a:visited,#selectionOfItemsOptions a,#selectionOfItemsOptions a:visited\r\n{\r\ncolor:Black;\r\n}\r\nul.filesSelected,ul.filesSelectedInBasket\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.filesSelectedInBasket ul\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\nul.groupedItems li\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\nul.filesSelected li,ul.filesSelectedInBasket li\r\n{\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n.upload,.shareUploadedItem,.shareAllUploaded\r\n{\r\ncolor:#000!important;\r\n}\r\n.overwriteLink\r\n{\r\ncolor:#000!important;\r\n}\r\n.file\r\n{\r\ncolor:#000!important;\r\n}\r\na.nextButton\r\n{\r\ncolor:#000!important;\r\n}\r\na.whiteError\r\n{\r\ncolor:#000;\r\n}\r\n.reupload,.redownload\r\n{\r\ncolor:#000;\r\n}\r\n.clearCompleted\r\n{\r\ncolor:#000!important;\r\n}\r\n.download,.shareBasketItems\r\n{\r\ncolor:#000!important;\r\n}\r\n.completed\r\n{\r\ncolor:#000!important;\r\n}\r\n.pause,.resume,.skip,.stop\r\n{\r\ncolor:#000!important;\r\n}\r\n.appletActionButtons\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.attention\r\n{\r\ncolor:#ff0404;\r\n}\r\n.autoReplyOptionPanel\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.uploadCancel\r\n{\r\ncolor:#000!important;\r\n}\r\n.spinner\r\n{\r\nbackground:url(/WebInterface/jQuery/images/spinner.gif) left no-repeat!important;\r\n}\r\n.customtabs a\r\n{\r\nbackground-color:#eee;\r\ncolor:#2c2a2a!important;\r\n}\r\n.customtabs a.active\r\n{\r\nbackground-color:#807b7b;\r\ncolor:#000!important;\r\n}\r\n.tab_content\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.dragOver\r\n{\r\nborder:3px solid #4c66a4;\r\nborder-color:green;\r\n}\r\n.myForm input[type=text],.myForm textarea\r\n{\r\ncolor:#051e42;\r\nbackground:#f5f5f5;\r\nborder:1px solid 4c66a4;\r\n}\r\n.submit input\r\n{\r\ncolor:black;\r\nbackground:#f7fafc;\r\nborder:2px solid #4c66a4;\r\n}\r\n.myForm fieldset\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.myForm legend\r\n{\r\ncolor:#FFF;\r\nbackground:#4c66a4!important;\r\nborder:1px solid #4c66a4;\r\n}\r\n.manageShareTable\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.shareItemDetails\r\n{\r\nborder-top:1px solid #4c66a4;\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n.highlight\r\n{\r\nbackground-color:#f2f9be;\r\n}\r\n.pagination a\r\n{\r\ntext-decoration:none;\r\nborder:solid 1px #4c66a4;\r\ncolor:#15B;\r\n}\r\n.pagination .current\r\n{\r\nbackground:#26B;\r\ncolor:#fff;\r\nborder:solid 1px #4c66a4;\r\n}\r\n.pagination .current.prev,.pagination .current.next\r\n{\r\ncolor:#999;\r\nborder-color:#4c66a4;\r\nbackground:#fff;\r\n}\r\n.slowUploadIcon\r\n{\r\nbackground:#000;\r\n}\r\n.ui-dialog .ui-widget-content\r\n{\r\nbackground-color:#000;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#000;\r\n}\r\n#manageSyncPanel\r\n{\r\nbackground-color:#fff;\r\n}\r\n.exifInfoPanel\r\n{\r\nbackground-color:black;\r\ncolor:#000;\r\nborder:1px solid #4c66a4;\r\n}\r\n.exifInfoPanelCollapsed\r\n{\r\ncolor:#000;\r\n}\r\nli .framePreviewBox div\r\n{\r\nborder:1px solid #4c66a4;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\ntd .framePreviewBox div\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.ui-widget-content\r\n{\r\nbackground:#fff!important;\r\ncolor:#000!important;\r\nborder:1px solid #4c66a4!important;\r\n}\r\n.ui-widget-header\r\n{\r\nbackground:#4c66a4!important;\r\ncolor:#fff!important;\r\nborder:none!important;\r\npadding:8px!important;\r\nmargin:0 0 5px 0!important;\r\n}\r\n.ui-progressbar-value.ui-widget-header\r\n{\r\npadding:0!important;\r\nmargin:0!important;\r\nbackground:#4c66a4 url(/WebInterface/jQuery/images/pbar-ani.gif)!important;\r\n}\r\n#uploadInfoForm\r\n{\r\nbackground-color:#fff;\r\n}\r\n#fileQueueInfo\r\n{\r\nclear:both;\r\nbackground:#fff!important;\r\nborder:1px solid #4c66a4;\r\n}\r\n.ui-state-error a\r\n{\r\ncolor:#000!important;\r\n}\r\n.uploadDialog .ui-dialog div\r\n{\r\nbackground-color:#000;\r\n}\r\n.fileListPanelInfoText\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #4c66a4;\r\n}\r\n.groupCount\r\n{\r\nbackground:#fff;\r\nborder:2px solid #4c66a4;\r\n}\r\n#dropItemsPanel\r\n{\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.dropzone.hover\r\n{\r\nbackground:#ff9;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#fileRepo\r\n{\r\nborder:1px solid #4c66a4;\r\nbackground-color:#fff;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.formOption\r\n{\r\nborder:1px solid #eee;\r\n}\r\n.ui-progressbar-value\r\n{\r\nbackground-image:url(/WebInterface/jQuery/images/animated-overlay.gif);\r\n}\r\ndiv#languageSelector {background: transparent;}\r\n",
    blue: "\r\/* ### Don't change this unless you are sure what you are doing ### */\r\nbody,input,select,textarea\r\n{\r\nbackground-color:#dae1f2;\r\nborder:1px solid #4c66a4;\r\ncolor:#000;\r\n}\r\nhr\r\n{\r\nbackground-color:#dae1f2;\r\nborder:1px solid #4c66a4;\r\n}\r\na,a:visited,.ui-dialog a,.ui-dialog .ui-widget-content a\r\n{\r\ncolor:#000;\r\n}\r\na:hover,a:active\r\n{\r\ncolor:#000;\r\n}\r\nTD.directory A\r\n{\r\ncolor:#000;\r\n}\r\nTD.file A\r\n{\r\ncolor:#000;\r\n}\r\n.iconPreviewLink\r\n{\r\ncolor:#000;\r\n}\r\n.rowHover\r\n{\r\nbackground-color:#90a3d1!important;\r\n}\r\n.rowHoverFixed\r\n{\r\nbackground-color:#90a3d1!important;\r\n}\r\n.rowHover2\r\n{\r\nbackground-color:#90a3d1!important;\r\n}\r\n.contextMenu\r\n{\r\nborder:solid 1px #4c66a4;\r\nbackground:#4c66a4;\r\n}\r\n.contextMenu A\r\n{\r\ncolor:#FFF;\r\n}\r\n.contextMenu LI.hover A\r\n{\r\ncolor:#153275;\r\nbackground-color:#90a3d1;\r\n}\r\n.contextMenu LI.disabled A\r\n{\r\ncolor:#AAA;\r\n}\r\n.contextMenu LI.hover.disabled A\r\n{\r\nbackground-color:transparent;\r\n}\r\n.contextMenu LI.separator\r\n{\r\nborder-top:solid 1px #4c66a4;\r\n}\r\n.disabled\r\n{\r\nbackground-color:#eee!important;\r\n}\r\n.jqueryFilesTable\r\n{\r\nborder-left:1px solid #4c66a4;\r\nborder-right:1px solid #4c66a4;\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n.jqueryFilesTable thead td\r\n{\r\nbackground:#4c66a4;\r\ncolor:#dae1f2;\r\n}\r\n.jqueryFilesTable td\r\n{\r\nborder-right:1px solid #4c66a4;\r\n}\r\n.customForm\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.customForm td\r\n{\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n#crumbs\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n#crumbs li\r\n{\r\ncolor:#000;\r\n}\r\n#crumbs li a\r\n{\r\nbackground:url(/WebInterface/jQuery/images/crumbs.gif) no-repeat right center;\r\n}\r\n.filterPanel a,.filterPanel a:visited\r\n{\r\ncolor:#000;\r\n}\r\n.viewSelectorPanel a.viewlink,.viewSelectorPanel a.viewlink:visited\r\n{\r\ncolor:#000;\r\n}\r\ntable.tablesorter .header\r\n{\r\nborder-left:1px solid #4c66a4;\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.fileBox,.fileBoxBasket\r\n{\r\ncolor:#000;\r\nborder:solid 1px #dae1f2;\r\n}\r\n.fileBox a,.fileBoxBasket a\r\n{\r\ncolor:#000!important;\r\n}\r\n.fileBox:hover,.fileBoxBasket:hover\r\n{\r\nborder:solid 1px #6578a3;\r\n}\r\n.fileBox .imgBox,.fileBoxBasket .imgBox\r\n{\r\nborder:solid 1px #6578a3;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\n}\r\n.fileBoxSelected\r\n{\r\nborder:solid 1px #6d6e63;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\nbackground-color:#d5def2;\r\n}\r\n.fileBox .imgBox .imgLink,.fileBoxBasket .imgBox .imgLink\r\n{\r\ncolor:#000;\r\n}\r\n.fileBox a,.fileBox a:visited,.fileBoxBasket a,.fileBox a:visited\r\n{\r\ncolor:#000;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#dae1f2!important;\r\nborder:1px solid #4c66a4!important;\r\ncolor:#000!important;\r\n}\r\np#vtip,.cluetip-default,#cluetip-title\r\n{\r\nbackground-color:#90a3d1!important;\r\ncolor:#000!important;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#frmShareWindow\r\n{\r\ncolor:#000;\r\n}\r\n#loadingIndicator\r\n{\r\nborder:0px !important;\r\n;\r\n}\r\n.loadingIndicatorWindow\r\n{\r\nbackground-color:#dae1f2!important;\r\ncolor:#4c66a4!important;\r\nborder:1px solid #4c66a4;\r\n}\r\n.poweredby,.copyright\r\n{\r\ncolor:#999ea8;\r\n}\r\n.mainNavigation\r\n{\r\nborder:1px solid #4c66a4;\r\nbackground-color:#4c66a4;\r\ncolor:#fff;\r\n}\r\nul.topnav li a\r\n{\r\ncolor:#fff;\r\n}\r\nul.topnav li a:hover\r\n{\r\nbackground-color:#bac7e6;\r\ncolor:#203b7a;\r\n-webkit-border-radius:5px 5px 5px 5px;\r\n-moz-border-radius:5px 5px 5px 5px;\r\nborder-radius:5px 5px 5px 5px;\r\n}\r\nul.topnav li span\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\nul.topnav li ul.subnav\r\n{\r\nbackground:#fff;\r\nborder:1px solid #4c66a4;\r\n}\r\nhtml ul.topnav li ul.subnav li a\r\n{\r\nbackground-color:#c6dd82;\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\nhtml ul.topnav li ul.subnav li a:hover\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\n.blockUI\r\n{\r\nborder:1px solid #4c66a4!important;\r\nbackground-color:#dae1f2!important;\r\ncolor:#000!important;\r\n}\r\n.popupHeader\r\n{\r\nbackground-color:#4c66a4!important;\r\nborder:1px solid #4c66a4!important;\r\ncolor:#dae1f2!important;\r\nmargin-bottom:5px;\r\n}\r\n.uploadNote\r\n{\r\ncolor:#023102!important;\r\n}\r\n.tbl\r\n{\r\ncolor:#000;\r\n}\r\n.tblRow\r\n{\r\ncolor:#000;\r\nbackground-color:#FFF;\r\n}\r\n.tblAltRow\r\n{\r\ncolor:#000;\r\nbackground-color:#FFF;\r\n}\r\n.pageHeader\r\n{\r\nbackground-color:#e9eef5;\r\n}\r\n.pageHeader td\r\n{\r\nborder-bottom:5px solid #4c66a4;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.requiredField\r\n{\r\ncolor:Red;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.popupNote\r\n{\r\ncolor:#a8b35e;\r\n}\r\n#searchResultNotification,#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/folder_magnify.png) no-repeat 5px 1px #ababa6;\r\ncolor:Black;\r\n}\r\n#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/help.png) no-repeat 5px 9px #fffeee;\r\n}\r\n#searchResultNotification a,#searchResultNotification a:visited,#selectionOfItemsOptions a,#selectionOfItemsOptions a:visited\r\n{\r\ncolor:Black;\r\n}\r\nul.filesSelected,ul.filesSelectedInBasket\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.filesSelectedInBasket ul\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\nul.groupedItems li\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\nul.filesSelected li,ul.filesSelectedInBasket li\r\n{\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n.upload,.shareUploadedItem,.shareAllUploaded\r\n{\r\ncolor:#000!important;\r\n}\r\n.overwriteLink\r\n{\r\ncolor:#000!important;\r\n}\r\n.file\r\n{\r\ncolor:#000!important;\r\n}\r\na.nextButton\r\n{\r\ncolor:#000!important;\r\n}\r\na.whiteError\r\n{\r\ncolor:#000;\r\n}\r\n.reupload,.redownload\r\n{\r\ncolor:#000;\r\n}\r\n.clearCompleted\r\n{\r\ncolor:#000!important;\r\n}\r\n.download,.shareBasketItems\r\n{\r\ncolor:#000!important;\r\n}\r\n.completed\r\n{\r\ncolor:#000!important;\r\n}\r\n.pause,.resume,.skip,.stop\r\n{\r\ncolor:#000!important;\r\n}\r\n.appletActionButtons\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.attention\r\n{\r\ncolor:#ff0404;\r\n}\r\n.autoReplyOptionPanel\r\n{\r\nborder-top:1px solid #4c66a4;\r\n}\r\n.uploadCancel\r\n{\r\ncolor:#000!important;\r\n}\r\n.spinner\r\n{\r\nbackground:url(/WebInterface/jQuery/images/spinner.gif) left no-repeat!important;\r\n}\r\n.customtabs a\r\n{\r\nbackground-color:#eee;\r\ncolor:#2c2a2a!important;\r\n}\r\n.customtabs a.active\r\n{\r\nbackground-color:#807b7b;\r\ncolor:#000!important;\r\n}\r\n.tab_content\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.dragOver\r\n{\r\nborder:3px solid #4c66a4;\r\nborder-color:green;\r\n}\r\n.myForm input[type=text],.myForm textarea\r\n{\r\ncolor:#051e42;\r\nbackground:#f5f5f5;\r\nborder:1px solid 4c66a4;\r\n}\r\n.submit input\r\n{\r\ncolor:black;\r\nbackground:#f7fafc;\r\nborder:2px solid #4c66a4;\r\n}\r\n.myForm fieldset\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.myForm legend\r\n{\r\ncolor:#FFF;\r\nbackground:#4c66a4!important;\r\nborder:1px solid #4c66a4;\r\n}\r\n.manageShareTable\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.shareItemDetails\r\n{\r\nborder-top:1px solid #4c66a4;\r\nborder-bottom:1px solid #4c66a4;\r\n}\r\n.highlight\r\n{\r\nbackground-color:#f2f9be;\r\n}\r\n.pagination a\r\n{\r\ntext-decoration:none;\r\nborder:solid 1px #4c66a4;\r\ncolor:#15B;\r\n}\r\n.pagination .current\r\n{\r\nbackground:#26B;\r\ncolor:#fff;\r\nborder:solid 1px #4c66a4;\r\n}\r\n.pagination .current.prev,.pagination .current.next\r\n{\r\ncolor:#999;\r\nborder-color:#4c66a4;\r\nbackground:#fff;\r\n}\r\n.slowUploadIcon\r\n{\r\nbackground:#000;\r\n}\r\n.ui-dialog .ui-widget-content\r\n{\r\nbackground-color:#000;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#000;\r\n}\r\n#manageSyncPanel\r\n{\r\nbackground-color:#fff;\r\n}\r\n.exifInfoPanel\r\n{\r\nbackground-color:black;\r\ncolor:#000;\r\nborder:1px solid #4c66a4;\r\n}\r\n.exifInfoPanelCollapsed\r\n{\r\ncolor:#000;\r\n}\r\nli .framePreviewBox div\r\n{\r\nborder:1px solid #4c66a4;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\ntd .framePreviewBox div\r\n{\r\nborder:1px solid #4c66a4;\r\n}\r\n.ui-widget-content\r\n{\r\nbackground:#dae1f2!important;\r\ncolor:#000!important;\r\nborder:1px solid #4c66a4!important;\r\n}\r\n.ui-widget-header\r\n{\r\nbackground:#4c66a4!important;\r\ncolor:#dae1f2!important;\r\nborder:none!important;\r\npadding:8px!important;\r\nmargin:0 0 5px 0!important;\r\n}\r\n.ui-progressbar-value.ui-widget-header\r\n{\r\npadding:0!important;\r\nmargin:0!important;\r\nbackground:#4c66a4 url(/WebInterface/jQuery/images/pbar-ani.gif)!important;\r\n}\r\n#uploadInfoForm\r\n{\r\nbackground-color:#dae1f2;\r\n}\r\n#fileQueueInfo\r\n{\r\nclear:both;\r\nbackground:#dae1f2!important;\r\nborder:1px solid #4c66a4;\r\n}\r\n.ui-state-error a\r\n{\r\ncolor:#000!important;\r\n}\r\n.uploadDialog .ui-dialog div\r\n{\r\nbackground-color:#000;\r\n}\r\n.fileListPanelInfoText\r\n{\r\nbackground-color:#dae1f2;\r\nborder:1px solid #4c66a4;\r\n}\r\n.groupCount\r\n{\r\nbackground:#dae1f2;\r\nborder:2px solid #4c66a4;\r\n}\r\n#dropItemsPanel\r\n{\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.dropzone.hover\r\n{\r\nbackground:#ff9;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#fileRepo\r\n{\r\nborder:1px solid #4c66a4;\r\nbackground-color:#dae1f2;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.formOption\r\n{\r\nborder:1px solid #eee;\r\n}\r\n.ui-progressbar-value\r\n{\r\nbackground-image:url(/WebInterface/jQuery/images/animated-overlay.gif);\r\n}\r\ndiv#languageSelector {background: transparent;}\r\n",
    green: "\r\/* ### Don't change this unless you are sure what you are doing ### */\r\nbody,input,select,textarea\r\n{\r\nbackground-color:#619e5d;\r\nborder:1px solid #57805c;\r\ncolor:#fff;\r\n}\r\nhr\r\n{\r\nbackground-color:#619e5d;\r\nborder:1px solid #57805c;\r\n}\r\na,a:visited,.ui-dialog a,.ui-dialog .ui-widget-content a\r\n{\r\ncolor:#fff;\r\n}\r\na:hover,a:active\r\n{\r\ncolor:#fff;\r\n}\r\nTD.directory A\r\n{\r\ncolor:#fff;\r\n}\r\nTD.file A\r\n{\r\ncolor:#fff;\r\n}\r\n.iconPreviewLink\r\n{\r\ncolor:#fff;\r\n}\r\n.rowHover\r\n{\r\nbackground-color:#497847!important;\r\n}\r\n.rowHoverFixed\r\n{\r\nbackground-color:#497847!important;\r\n}\r\n.rowHover2\r\n{\r\nbackground-color:#497847!important;\r\n}\r\n.contextMenu\r\n{\r\nborder:solid 1px #57805c;\r\nbackground:#3d663b;\r\n}\r\n.contextMenu A\r\n{\r\ncolor:#fff;\r\n}\r\n.contextMenu LI.hover A\r\n{\r\ncolor:#f2f2dc;\r\nbackground-color:#497847;\r\n}\r\n.contextMenu LI.disabled A\r\n{\r\ncolor:#AAA;\r\n}\r\n.contextMenu LI.hover.disabled A\r\n{\r\nbackground-color:transparent;\r\n}\r\n.contextMenu LI.separator\r\n{\r\nborder-top:solid 1px #57805c;\r\n}\r\n.disabled\r\n{\r\nbackground-color:#eee!important;\r\n}\r\n.jqueryFilesTable\r\n{\r\nborder-left:1px solid #57805c;\r\nborder-right:1px solid #57805c;\r\nborder-bottom:1px solid #57805c;\r\n}\r\n.jqueryFilesTable thead td\r\n{\r\nbackground:#12692c;\r\n}\r\n.jqueryFilesTable td\r\n{\r\nborder-right:1px solid #57805c;\r\n}\r\n.customForm\r\n{\r\nborder-top:1px solid #57805c;\r\n}\r\n.customForm td\r\n{\r\nborder-bottom:1px solid #57805c;\r\n}\r\n#crumbs\r\n{\r\nborder:1px solid #57805c;\r\n}\r\n#crumbs li\r\n{\r\ncolor:#fff;\r\n}\r\n#crumbs li a\r\n{\r\nbackground:url(/WebInterface/jQuery/images/crumbs.gif) no-repeat right center;\r\n}\r\n.filterPanel a,.filterPanel a:visited\r\n{\r\ncolor:#fff;\r\n}\r\n.viewSelectorPanel a.viewlink,.viewSelectorPanel a.viewlink:visited\r\n{\r\ncolor:#fff;\r\n}\r\ntable.tablesorter .header\r\n{\r\nborder-left:1px solid #57805c;\r\nborder-top:1px solid #57805c;\r\n}\r\n.fileBox,.fileBoxBasket\r\n{\r\ncolor:#fff;\r\nborder:solid 1px #619e5d;\r\n}\r\n.fileBox a,.fileBoxBasket a\r\n{\r\ncolor:#fff!important;\r\n}\r\n.fileBox:hover,.fileBoxBasket:hover\r\n{\r\nborder:solid 1px #264a25;\r\n}\r\n.fileBox .imgBox,.fileBoxBasket .imgBox\r\n{\r\nborder:solid 1px #264a25;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\n}\r\n.fileBoxSelected\r\n{\r\nborder:solid 1px #6d6e63;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\nbackground-color:#4b8049;\r\n}\r\n.fileBoxSelected div, \r\n.fileBoxSelected div .items-count-thumb{background: transparent !important;\r\n}\r\n.fileBox .imgBox .imgLink,.fileBoxBasket .imgBox .imgLink\r\n{\r\ncolor:#fff;\r\n}\r\n.fileBox a,.fileBox a:visited,.fileBoxBasket a,.fileBox a:visited\r\n{\r\ncolor:#fff;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#619e5d!important;\r\nborder:1px solid #57805c!important;\r\ncolor:#fff!important;\r\n}\r\np#vtip,.cluetip-default,#cluetip-title\r\n{\r\nbackground-color:#497847!important;\r\ncolor:#fff!important;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#frmShareWindow\r\n{\r\ncolor:#12692c!important;\r\n}\r\n#loadingIndicator\r\n{\r\nborder:0px !important;\r\n;\r\n}\r\n.loadingIndicatorWindow\r\n{\r\nbackground-color:#fff!important;\r\ncolor:black!important;\r\n}\r\n.poweredby,.copyright\r\n{\r\ncolor:#336631;\r\n}\r\n.mainNavigation\r\n{\r\nborder:1px solid #57805c;\r\nbackground-color:#12692c;\r\ncolor:#fff;\r\n}\r\nul.topnav li a\r\n{\r\ncolor:#fff;\r\n}\r\nul.topnav li a:hover\r\n{\r\nbackground-color:#376e35;\r\n-webkit-border-radius:5px 5px 5px 5px;\r\n-moz-border-radius:5px 5px 5px 5px;\r\nborder-radius:5px 5px 5px 5px;\r\n}\r\nul.topnav li span\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\nul.topnav li ul.subnav\r\n{\r\nbackground:#fff;\r\nborder:1px solid #57805c;\r\n}\r\nhtml ul.topnav li ul.subnav li a\r\n{\r\nbackground-color:#c6dd82;\r\nborder-bottom:1px solid #57805c;\r\n}\r\nhtml ul.topnav li ul.subnav li a:hover\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\n.blockUI\r\n{\r\nborder:1px solid #57805c!important;\r\nbackground-color:#c5e8c8!important;\r\ncolor:#1c4d20!important;\r\n}\r\n.popupHeader\r\n{\r\nbackground-color:#12692c!important;\r\nborder:1px solid #57805c!important;\r\ncolor:#fff!important;\r\nmargin-bottom:5px;\r\n}\r\n.uploadNote\r\n{\r\ncolor:#023102!important;\r\n}\r\n.tbl\r\n{\r\ncolor:#fff;\r\n}\r\n.tblRow\r\n{\r\ncolor:#1c4d20;\r\nbackground-color:#c5e8c8;\r\n}\r\n.tblAltRow\r\n{\r\ncolor:#1c4d20;\r\nbackground-color:#c5e8c8;\r\n}\r\n.pageHeader\r\n{\r\nbackground-color:#e9eef5;\r\n}\r\n.pageHeader td\r\n{\r\nborder-bottom:5px solid #57805c;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.requiredField\r\n{\r\ncolor:Red;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.popupNote\r\n{\r\ncolor:#a8b35e;\r\n}\r\n#searchResultNotification,#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/folder_magnify.png) no-repeat 5px 1px #ababa6;\r\ncolor:Black;\r\n}\r\n#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/help.png) no-repeat 5px 9px #fffeee;\r\n}\r\n#searchResultNotification a,#searchResultNotification a:visited,#selectionOfItemsOptions a,#selectionOfItemsOptions a:visited\r\n{\r\ncolor:Black;\r\n}\r\nul.filesSelected,ul.filesSelectedInBasket\r\n{\r\nborder-top:1px solid #57805c;\r\n}\r\n.filesSelectedInBasket ul\r\n{\r\nborder-top:1px solid #57805c;\r\n}\r\nul.groupedItems li\r\n{\r\nborder:1px solid #57805c;\r\n}\r\nul.filesSelected li,ul.filesSelectedInBasket li\r\n{\r\nborder-bottom:1px solid #57805c;\r\n}\r\n.upload,.shareUploadedItem,.shareAllUploaded\r\n{\r\ncolor:#fff!important;\r\n}\r\n.overwriteLink\r\n{\r\ncolor:#fff!important;\r\n}\r\n.file\r\n{\r\ncolor:#fff!important;\r\n}\r\na.nextButton\r\n{\r\ncolor:#fff!important;\r\n}\r\na.whiteError\r\n{\r\ncolor:#fff;\r\n}\r\n.reupload,.redownload\r\n{\r\ncolor:#fff;\r\n}\r\n.clearCompleted\r\n{\r\ncolor:#fff!important;\r\n}\r\n.download,.shareBasketItems\r\n{\r\ncolor:#fff!important;\r\n}\r\n.completed\r\n{\r\ncolor:#fff!important;\r\n}\r\n.pause,.resume,.skip,.stop\r\n{\r\ncolor:#fff!important;\r\n}\r\n.appletActionButtons\r\n{\r\nborder:1px solid #57805c;\r\n}\r\n.attention\r\n{\r\ncolor:#ff0404;\r\n}\r\n.autoReplyOptionPanel\r\n{\r\nborder-top:1px solid #57805c;\r\n}\r\n.uploadCancel\r\n{\r\ncolor:#fff!important;\r\n}\r\n.spinner\r\n{\r\nbackground:url(/WebInterface/jQuery/images/spinner.gif) left no-repeat!important;\r\n}\r\n.customtabs a\r\n{\r\nbackground-color:#eee;\r\ncolor:#2c2a2a!important;\r\n}\r\n.customtabs a.active\r\n{\r\nbackground-color:#807b7b;\r\ncolor:#fff!important;\r\n}\r\n.tab_content\r\n{\r\nborder:1px solid #57805c;\r\n}\r\n.dragOver\r\n{\r\nborder:3px solid #57805c;\r\nborder-color:green;\r\n}\r\n.myForm input[type=text],.myForm textarea\r\n{\r\ncolor:#051e42;\r\nbackground:#f5f5f5;\r\nborder:1px solid 57805C;\r\n}\r\n.submit input\r\n{\r\ncolor:black;\r\nbackground:#f7fafc;\r\nborder:2px solid #57805c;\r\n}\r\n.myForm fieldset\r\n{\r\nborder:1px solid #57805c;\r\n}\r\n.myForm legend\r\n{\r\ncolor:#fff;\r\nbackground:#12692c!important;\r\nborder:1px solid #57805c;\r\n}\r\n.manageShareTable\r\n{\r\nborder:1px solid #57805c;\r\n}\r\n.shareItemDetails\r\n{\r\nborder-top:1px solid #57805c;\r\nborder-bottom:1px solid #57805c;\r\n}\r\n.highlight\r\n{\r\nbackground-color:#f2f9be;\r\n}\r\n.pagination a\r\n{\r\ntext-decoration:none;\r\nborder:solid 1px #57805c;\r\ncolor:#15B;\r\n}\r\n.pagination .current\r\n{\r\nbackground:#26B;\r\ncolor:#fff;\r\nborder:solid 1px #57805c;\r\n}\r\n.pagination .current.prev,.pagination .current.next\r\n{\r\ncolor:#999;\r\nborder-color:#57805c;\r\nbackground:#fff;\r\n}\r\n.slowUploadIcon\r\n{\r\nbackground:#fff;\r\n}\r\n.ui-dialog .ui-widget-content\r\n{\r\nbackground-color:#fff;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#fff;\r\n}\r\n#manageSyncPanel\r\n{\r\nbackground-color:#fff;\r\n}\r\n.exifInfoPanel\r\n{\r\nbackground-color:black;\r\ncolor:#fff;\r\nborder:1px solid #57805c;\r\n}\r\n.exifInfoPanelCollapsed\r\n{\r\ncolor:#fff;\r\n}\r\nli .framePreviewBox div\r\n{\r\nborder:1px solid #57805c;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\ntd .framePreviewBox div\r\n{\r\nborder:1px solid #57805c;\r\n}\r\n.ui-widget-content\r\n{\r\nbackground:#619e5d!important;\r\ncolor:#fff!important;\r\nborder:1px solid #57805c!important;\r\n}\r\n.ui-widget-header\r\n{\r\nbackground:#376e35!important;\r\ncolor:#fff!important;\r\nborder:none!important;\r\npadding:8px!important;\r\nmargin:0 0 5px 0!important;\r\n}\r\n.ui-progressbar-value.ui-widget-header\r\n{\r\npadding:0!important;\r\nmargin:0!important;\r\nbackground:#12692c url(/WebInterface/jQuery/images/pbar-ani.gif)!important;\r\n}\r\n#uploadInfoForm\r\n{\r\nbackground-color:#619e5d;\r\n}\r\n#fileQueueInfo\r\n{\r\nclear:both;\r\nbackground:#619e5d!important;\r\nborder:1px solid #57805c;\r\n}\r\n.ui-state-error a\r\n{\r\ncolor:#fff!important;\r\n}\r\n.uploadDialog .ui-dialog div\r\n{\r\nbackground-color:#fff;\r\n}\r\n.fileListPanelInfoText\r\n{\r\nbackground-color:#619e5d;\r\nborder:1px solid #57805c;\r\n}\r\n.groupCount\r\n{\r\nbackground:#619e5d;\r\nborder:2px solid #57805c;\r\n}\r\n#dropItemsPanel\r\n{\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.dropzone.hover\r\n{\r\nbackground:#ff9;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#fileRepo\r\n{\r\nborder:1px solid #57805c;\r\nbackground-color:#619e5d;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.formOption\r\n{\r\nborder:1px solid #eee;\r\n}\r\n.ui-progressbar-value\r\n{\r\nbackground-image:url(/WebInterface/jQuery/images/animated-overlay.gif);\r\n}\r\ndiv#languageSelector {background: transparent;}\r\n",
    greenwhite: "\r\/* ### Don't change this unless you are sure what you are doing ### */\r\nbody,input,select,textarea\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #608265;\r\ncolor:#043b0b;\r\n}\r\nhr\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #608265;\r\n}\r\na,a:visited,.ui-dialog a,.ui-dialog .ui-widget-content a\r\n{\r\ncolor:#043b0b;\r\n}\r\na:hover,a:active\r\n{\r\ncolor:#043b0b;\r\n}\r\nTD.directory A\r\n{\r\ncolor:#043b0b;\r\n}\r\nTD.file A\r\n{\r\ncolor:#043b0b;\r\n}\r\n.iconPreviewLink\r\n{\r\ncolor:#043b0b;\r\n}\r\n.rowHover\r\n{\r\nbackground-color:#b6debb!important;\r\n}\r\n.rowHoverFixed\r\n{\r\nbackground-color:#b6debb!important;\r\n}\r\n.rowHover2\r\n{\r\nbackground-color:#b6debb!important;\r\n}\r\n.contextMenu\r\n{\r\nborder:solid 1px #608265;\r\nbackground:#12692c;\r\n}\r\n.contextMenu A\r\n{\r\ncolor:#FFF;\r\n}\r\n.contextMenu LI.hover A\r\n{\r\ncolor:#084010;\r\nbackground-color:#b6debb;\r\n}\r\n.contextMenu LI.disabled A\r\n{\r\ncolor:#AAA;\r\n}\r\n.contextMenu LI.hover.disabled A\r\n{\r\nbackground-color:transparent;\r\n}\r\n.contextMenu LI.separator\r\n{\r\nborder-top:solid 1px #608265;\r\n}\r\n.disabled\r\n{\r\nbackground-color:#eee!important;\r\n}\r\n.jqueryFilesTable\r\n{\r\nborder-left:1px solid #608265;\r\nborder-right:1px solid #608265;\r\nborder-bottom:1px solid #608265;\r\n}\r\n.jqueryFilesTable thead td\r\n{\r\nbackground:#12692c;\r\ncolor:#fff;\r\n}\r\n.jqueryFilesTable td\r\n{\r\nborder-right:1px solid #608265;\r\n}\r\n.customForm\r\n{\r\nborder-top:1px solid #608265;\r\n}\r\n.customForm td\r\n{\r\nborder-bottom:1px solid #608265;\r\n}\r\n#crumbs\r\n{\r\nborder:1px solid #608265;\r\n}\r\n#crumbs li\r\n{\r\ncolor:#043b0b;\r\n}\r\n#crumbs li a\r\n{\r\nbackground:url(/WebInterface/jQuery/images/crumbs.gif) no-repeat right center;\r\n}\r\n.filterPanel a,.filterPanel a:visited\r\n{\r\ncolor:#043b0b;\r\n}\r\n.viewSelectorPanel a.viewlink,.viewSelectorPanel a.viewlink:visited\r\n{\r\ncolor:#043b0b;\r\n}\r\ntable.tablesorter .header\r\n{\r\nborder-left:1px solid #608265;\r\nborder-top:1px solid #608265;\r\n}\r\n.fileBox,.fileBoxBasket\r\n{\r\ncolor:#043b0b;\r\nborder:solid 1px #fff;\r\n}\r\n.fileBox a,.fileBoxBasket a\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.fileBox:hover,.fileBoxBasket:hover\r\n{\r\nborder:solid 1px #264a25;\r\n}\r\n.fileBox .imgBox,.fileBoxBasket .imgBox\r\n{\r\nborder:solid 1px #264a25;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\n}\r\n.fileBoxSelected\r\n{\r\nborder:solid 1px #6d6e63;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\nbackground-color:#d3f5d7;\r\n}\r\n.fileBox .imgBox .imgLink,.fileBoxBasket .imgBox .imgLink\r\n{\r\ncolor:#043b0b;\r\n}\r\n.fileBox a,.fileBox a:visited,.fileBoxBasket a,.fileBox a:visited\r\n{\r\ncolor:#043b0b;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#fff!important;\r\nborder:1px solid #608265!important;\r\ncolor:#043b0b!important;\r\n}\r\np#vtip,.cluetip-default,#cluetip-title\r\n{\r\nbackground-color:#b6debb!important;\r\ncolor:#043b0b!important;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#frmShareWindow\r\n{\r\ncolor:#12692c!important;\r\n}\r\n#loadingIndicator\r\n{\r\nborder:0px !important;\r\n;\r\n}\r\n.loadingIndicatorWindow\r\n{\r\nbackground-color:#043b0b!important;\r\ncolor:#fff!important;\r\n}\r\n.poweredby,.copyright\r\n{\r\ncolor:#336631;\r\n}\r\n.mainNavigation\r\n{\r\nborder:1px solid #608265;\r\nbackground-color:#12692c;\r\ncolor:#fff;\r\n}\r\nul.topnav li a\r\n{\r\ncolor:#fff;\r\n}\r\nul.topnav li a:hover\r\n{\r\nbackground-color:#376e35;\r\n-webkit-border-radius:5px 5px 5px 5px;\r\n-moz-border-radius:5px 5px 5px 5px;\r\nborder-radius:5px 5px 5px 5px;\r\n}\r\nul.topnav li span\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\nul.topnav li ul.subnav\r\n{\r\nbackground:#fff;\r\nborder:1px solid #608265;\r\n}\r\nhtml ul.topnav li ul.subnav li a\r\n{\r\nbackground-color:#c6dd82;\r\nborder-bottom:1px solid #608265;\r\n}\r\nhtml ul.topnav li ul.subnav li a:hover\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\n.blockUI\r\n{\r\nborder:1px solid #608265!important;\r\nbackground-color:#FFF!important;\r\ncolor:#043b0b!important;\r\n}\r\n.popupHeader\r\n{\r\nbackground-color:#12692c!important;\r\nborder:1px solid #608265!important;\r\ncolor:#fff!important;\r\nmargin-bottom:5px;\r\n}\r\n.uploadNote\r\n{\r\ncolor:#023102!important;\r\n}\r\n.tbl\r\n{\r\ncolor:#043b0b;\r\n}\r\n.tblRow\r\n{\r\ncolor:#043b0b;\r\nbackground-color:#FFF;\r\n}\r\n.tblAltRow\r\n{\r\ncolor:#043b0b;\r\nbackground-color:#FFF;\r\n}\r\n.pageHeader\r\n{\r\nbackground-color:#e9eef5;\r\n}\r\n.pageHeader td\r\n{\r\nborder-bottom:5px solid #608265;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.requiredField\r\n{\r\ncolor:Red;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.popupNote\r\n{\r\ncolor:#a8b35e;\r\n}\r\n#searchResultNotification,#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/folder_magnify.png) no-repeat 5px 1px #ababa6;\r\ncolor:Black;\r\n}\r\n#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/help.png) no-repeat 5px 9px #fffeee;\r\n}\r\n#searchResultNotification a,#searchResultNotification a:visited,#selectionOfItemsOptions a,#selectionOfItemsOptions a:visited\r\n{\r\ncolor:Black;\r\n}\r\nul.filesSelected,ul.filesSelectedInBasket\r\n{\r\nborder-top:1px solid #608265;\r\n}\r\n.filesSelectedInBasket ul\r\n{\r\nborder-top:1px solid #608265;\r\n}\r\nul.groupedItems li\r\n{\r\nborder:1px solid #608265;\r\n}\r\nul.filesSelected li,ul.filesSelectedInBasket li\r\n{\r\nborder-bottom:1px solid #608265;\r\n}\r\n.upload,.shareUploadedItem,.shareAllUploaded\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.overwriteLink\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.file\r\n{\r\ncolor:#043b0b!important;\r\n}\r\na.nextButton\r\n{\r\ncolor:#043b0b!important;\r\n}\r\na.whiteError\r\n{\r\ncolor:#043b0b;\r\n}\r\n.reupload,.redownload\r\n{\r\ncolor:#043b0b;\r\n}\r\n.clearCompleted\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.download,.shareBasketItems\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.completed\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.pause,.resume,.skip,.stop\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.appletActionButtons\r\n{\r\nborder:1px solid #608265;\r\n}\r\n.attention\r\n{\r\ncolor:#ff0404;\r\n}\r\n.autoReplyOptionPanel\r\n{\r\nborder-top:1px solid #608265;\r\n}\r\n.uploadCancel\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.spinner\r\n{\r\nbackground:url(/WebInterface/jQuery/images/spinner.gif) left no-repeat!important;\r\n}\r\n.customtabs a\r\n{\r\nbackground-color:#eee;\r\ncolor:#2c2a2a!important;\r\n}\r\n.customtabs a.active\r\n{\r\nbackground-color:#807b7b;\r\ncolor:#043b0b!important;\r\n}\r\n.tab_content\r\n{\r\nborder:1px solid #608265;\r\n}\r\n.dragOver\r\n{\r\nborder:3px solid #608265;\r\nborder-color:green;\r\n}\r\n.myForm input[type=text],.myForm textarea\r\n{\r\ncolor:#051e42;\r\nbackground:#f5f5f5;\r\nborder:1px solid 608265;\r\n}\r\n.submit input\r\n{\r\ncolor:black;\r\nbackground:#f7fafc;\r\nborder:2px solid #608265;\r\n}\r\n.myForm fieldset\r\n{\r\nborder:1px solid #608265;\r\n}\r\n.myForm legend\r\n{\r\ncolor:#fff;\r\nbackground:#12692c !important;\r\nborder:1px solid #608265;\r\n}\r\n.manageShareTable\r\n{\r\nborder:1px solid #608265;\r\n}\r\n.shareItemDetails\r\n{\r\nborder-top:1px solid #608265;\r\nborder-bottom:1px solid #608265;\r\n}\r\n.highlight\r\n{\r\nbackground-color:#f2f9be;\r\n}\r\n.pagination a\r\n{\r\ntext-decoration:none;\r\nborder:solid 1px #608265;\r\ncolor:#15B;\r\n}\r\n.pagination .current\r\n{\r\nbackground:#26B;\r\ncolor:#fff;\r\nborder:solid 1px #608265;\r\n}\r\n.pagination .current.prev,.pagination .current.next\r\n{\r\ncolor:#999;\r\nborder-color:#608265;\r\nbackground:#fff;\r\n}\r\n.slowUploadIcon\r\n{\r\nbackground:#043b0b;\r\n}\r\n.ui-dialog .ui-widget-content\r\n{\r\nbackground-color:#043b0b;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#043b0b;\r\n}\r\n#manageSyncPanel\r\n{\r\nbackground-color:#fff;\r\n}\r\n.exifInfoPanel\r\n{\r\nbackground-color:black;\r\ncolor:#043b0b;\r\nborder:1px solid #608265;\r\n}\r\n.exifInfoPanelCollapsed\r\n{\r\ncolor:#043b0b;\r\n}\r\nli .framePreviewBox div\r\n{\r\nborder:1px solid #608265;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\ntd .framePreviewBox div\r\n{\r\nborder:1px solid #608265;\r\n}\r\n.ui-widget-content\r\n{\r\nbackground:#fff!important;\r\ncolor:#043b0b!important;\r\nborder:1px solid #608265!important;\r\n}\r\n.ui-widget-header\r\n{\r\nbackground:#376e35!important;\r\ncolor:#fff!important;\r\nborder:none!important;\r\npadding:8px!important;\r\nmargin:0 0 5px 0!important;\r\n}\r\n.ui-progressbar-value.ui-widget-header\r\n{\r\npadding:0!important;\r\nmargin:0!important;\r\nbackground:#12692c url(/WebInterface/jQuery/images/pbar-ani.gif)!important;\r\n}\r\n#uploadInfoForm\r\n{\r\nbackground-color:#fff;\r\n}\r\n#fileQueueInfo\r\n{\r\nclear:both;\r\nbackground:#fff!important;\r\nborder:1px solid #608265;\r\n}\r\n.ui-state-error a\r\n{\r\ncolor:#043b0b!important;\r\n}\r\n.uploadDialog .ui-dialog div\r\n{\r\nbackground-color:#043b0b;\r\n}\r\n.fileListPanelInfoText\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #608265;\r\n}\r\n.groupCount\r\n{\r\nbackground:#fff;\r\nborder:2px solid #608265;\r\n}\r\n#dropItemsPanel\r\n{\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.dropzone.hover\r\n{\r\nbackground:#ff9;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#fileRepo\r\n{\r\nborder:1px solid #608265;\r\nbackground-color:#fff;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.formOption\r\n{\r\nborder:1px solid #eee;\r\n}\r\n.ui-progressbar-value\r\n{\r\nbackground-image:url(/WebInterface/jQuery/images/animated-overlay.gif);\r\n}\r\ndiv#languageSelector {background: transparent;}\r\n",
    red: "\r\/* ### Don't change this unless you are sure what you are doing ### */\r\nbody,input,select,textarea\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #c00;\r\ncolor:#004276;\r\n}\r\nhr\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #c00;\r\n}\r\na,a:visited,.ui-dialog a,.ui-dialog .ui-widget-content a\r\n{\r\ncolor:#004276;\r\n}\r\na:hover,a:active\r\n{\r\ncolor:#004276;\r\n}\r\nTD.directory A\r\n{\r\ncolor:#004276;\r\n}\r\nTD.file A\r\n{\r\ncolor:#004276;\r\n}\r\n.iconPreviewLink\r\n{\r\ncolor:#004276;\r\n}\r\n.rowHover,.rowHoverFixed,.rowHover2\r\n{\r\nbackground-color:#f76a6a!important;\r\ncolor:#fff;\r\n}\r\n.rowHover a,.rowHoverFixed a,.rowHover2 a\r\n{\r\ncolor:#fff!important;\r\n}\r\n.contextMenu\r\n{\r\nborder:solid 1px #c00;\r\ncolor:#fff;\r\nbackground:#f76a6a;\r\n}\r\n.contextMenu A\r\n{\r\ncolor:#fff;\r\n}\r\n.contextMenu LI.hover A\r\n{\r\ncolor:#fff;\r\nbackground-color:#c00;\r\n}\r\n.contextMenu LI.disabled A\r\n{\r\ncolor:#AAA;\r\n}\r\n.contextMenu LI.hover.disabled A\r\n{\r\nbackground-color:transparent;\r\n}\r\n.contextMenu LI.separator\r\n{\r\nborder-top:solid 1px #c00;\r\n}\r\n.disabled\r\n{\r\nbackground-color:#eee!important;\r\n}\r\n.jqueryFilesTable\r\n{\r\nborder-left:1px solid #c00;\r\nborder-right:1px solid #c00;\r\nborder-bottom:1px solid #c00;\r\n}\r\n.jqueryFilesTable thead td\r\n{\r\nbackground:#c00;\r\ncolor:#fff;\r\n}\r\n.jqueryFilesTable td\r\n{\r\nborder-right:1px solid #c00;\r\n}\r\n.customForm\r\n{\r\nborder-top:1px solid #c00;\r\n}\r\n.customForm td\r\n{\r\nborder-bottom:1px solid #c00;\r\n}\r\n#crumbs\r\n{\r\nborder:1px solid #c00;\r\n}\r\n#crumbs li\r\n{\r\ncolor:#004276;\r\n}\r\n#crumbs li a\r\n{\r\nbackground:url(/WebInterface/jQuery/images/crumbs.gif) no-repeat right center;\r\n}\r\n.filterPanel a,.filterPanel a:visited\r\n{\r\ncolor:#004276;\r\n}\r\n.viewSelectorPanel a.viewlink,.viewSelectorPanel a.viewlink:visited\r\n{\r\ncolor:#004276;\r\n}\r\ntable.tablesorter .header\r\n{\r\nborder-left:1px solid #c00;\r\nborder-top:1px solid #c00;\r\n}\r\n.fileBox,.fileBoxBasket\r\n{\r\ncolor:#004276;\r\nborder:solid 1px #fff;\r\n}\r\n.fileBox a,.fileBoxBasket a\r\n{\r\ncolor:#004276!important;\r\n}\r\n.fileBox:hover,.fileBoxBasket:hover\r\n{\r\nborder:solid 1px #e09696;\r\n}\r\n.fileBox .imgBox,.fileBoxBasket .imgBox\r\n{\r\nborder:solid 1px #c00;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\n}\r\n.fileBoxSelected\r\n{\r\nborder:solid 1px #6d6e63;\r\n-moz-box-shadow:none;\r\n-webkit-box-shadow:none;\r\nbox-shadow:none;\r\nbackground-color:#e0d5da;\r\n}\r\n.fileBox .imgBox .imgLink,.fileBoxBasket .imgBox .imgLink\r\n{\r\ncolor:#004276;\r\n}\r\n.fileBox a,.fileBox a:visited,.fileBoxBasket a,.fileBox a:visited\r\n{\r\ncolor:#004276;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#fff!important;\r\nborder:1px solid #c00!important;\r\ncolor:#004276!important;\r\n}\r\np#vtip,.cluetip-default,#cluetip-title\r\n{\r\nbackground-color:#fff!important;\r\ncolor:#004276!important;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#frmShareWindow\r\n{\r\ncolor:#004276;\r\n}\r\n#loadingIndicator\r\n{\r\nborder:0px !important;\r\n;\r\n}\r\n.loadingIndicatorWindow\r\n{\r\nbackground-color:white!important;\r\ncolor:#c00!important;\r\nborder:1px solid #c00;\r\n}\r\n.poweredby,.copyright\r\n{\r\ncolor:#bab3b6;\r\n}\r\n.mainNavigation\r\n{\r\nborder:1px solid #c00;\r\nbackground-color:#c00;\r\ncolor:#fff;\r\n}\r\nul.topnav li a\r\n{\r\ncolor:#fff;\r\n}\r\nul.topnav li a:hover\r\n{\r\nbackground-color:#e09696;\r\n-webkit-border-radius:5px 5px 5px 5px;\r\n-moz-border-radius:5px 5px 5px 5px;\r\nborder-radius:5px 5px 5px 5px;\r\ncolor:#000;\r\n}\r\nul.topnav li span\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\nul.topnav li ul.subnav\r\n{\r\nbackground:#fff;\r\nborder:1px solid #c00;\r\n}\r\nhtml ul.topnav li ul.subnav li a\r\n{\r\nbackground-color:#c6dd82;\r\nborder-bottom:1px solid #c00;\r\n}\r\nhtml ul.topnav li ul.subnav li a:hover\r\n{\r\nbackground-color:#c6dd82;\r\n}\r\n.blockUI\r\n{\r\nborder:1px solid #c00!important;\r\nbackground-color:#fff!important;\r\ncolor:#004276!important;\r\n}\r\n.popupHeader\r\n{\r\nbackground-color:#c00!important;\r\nborder:1px solid #c00!important;\r\ncolor:#fff!important;\r\nmargin-bottom:5px;\r\n}\r\n.uploadNote\r\n{\r\ncolor:#023102!important;\r\n}\r\n.tbl\r\n{\r\ncolor:#004276;\r\n}\r\n.tblRow\r\n{\r\ncolor:#004276;\r\nbackground-color:#fff;\r\n}\r\n.tblAltRow\r\n{\r\ncolor:#004276;\r\nbackground-color:#fff;\r\n}\r\n.pageHeader\r\n{\r\nbackground-color:#e9eef5;\r\n}\r\n.pageHeader td\r\n{\r\nborder-bottom:5px solid #c00;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\n.requiredField\r\n{\r\ncolor:Red;\r\n}\r\n.validationFail\r\n{\r\nborder:1px solid red;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.error,.errorOverwrite\r\n{\r\ncolor:#f00;\r\n}\r\na.error:hover,a.errorOverwrite:hover\r\n{\r\ncolor:#a8b35e;\r\n}\r\n.popupNote\r\n{\r\ncolor:#a8b35e;\r\n}\r\n#searchResultNotification,#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/folder_magnify.png) no-repeat 5px 1px #ababa6;\r\ncolor:Black;\r\n}\r\n#selectionOfItemsOptions\r\n{\r\nbackground:url(/WebInterface/jQuery/images/help.png) no-repeat 5px 9px #fffeee;\r\n}\r\n#searchResultNotification a,#searchResultNotification a:visited,#selectionOfItemsOptions a,#selectionOfItemsOptions a:visited\r\n{\r\ncolor:Black;\r\n}\r\nul.filesSelected,ul.filesSelectedInBasket\r\n{\r\nborder-top:1px solid #c00;\r\n}\r\n.filesSelectedInBasket ul\r\n{\r\nborder-top:1px solid #c00;\r\n}\r\nul.groupedItems li\r\n{\r\nborder:1px solid #c00;\r\n}\r\nul.filesSelected li,ul.filesSelectedInBasket li\r\n{\r\nborder-bottom:1px solid #c00;\r\n}\r\n.upload,.shareUploadedItem,.shareAllUploaded\r\n{\r\ncolor:#004276!important;\r\n}\r\n.overwriteLink\r\n{\r\ncolor:#004276!important;\r\n}\r\n.file\r\n{\r\ncolor:#004276!important;\r\n}\r\na.nextButton\r\n{\r\ncolor:#004276!important;\r\n}\r\na.whiteError\r\n{\r\ncolor:#004276;\r\n}\r\n.reupload,.redownload\r\n{\r\ncolor:#004276;\r\n}\r\n.clearCompleted\r\n{\r\ncolor:#004276!important;\r\n}\r\n.download,.shareBasketItems\r\n{\r\ncolor:#004276!important;\r\n}\r\n.completed\r\n{\r\ncolor:#004276!important;\r\n}\r\n.pause,.resume,.skip,.stop\r\n{\r\ncolor:#004276!important;\r\n}\r\n.appletActionButtons\r\n{\r\nborder:1px solid #c00;\r\n}\r\n.attention\r\n{\r\ncolor:#ff0404;\r\n}\r\n.autoReplyOptionPanel\r\n{\r\nborder-top:1px solid #c00;\r\n}\r\n.uploadCancel\r\n{\r\ncolor:#004276!important;\r\n}\r\n.spinner\r\n{\r\nbackground:url(/WebInterface/jQuery/images/spinner.gif) left no-repeat!important;\r\n}\r\n.customtabs a\r\n{\r\nbackground-color:#eee;\r\ncolor:#2c2a2a!important;\r\n}\r\n.customtabs a.active\r\n{\r\nbackground-color:#807b7b;\r\ncolor:#004276!important;\r\n}\r\n.tab_content\r\n{\r\nborder:1px solid #c00;\r\n}\r\n.dragOver\r\n{\r\nborder:3px solid #c00;\r\nborder-color:green;\r\n}\r\n.myForm input[type=text],.myForm textarea\r\n{\r\ncolor:#051e42;\r\nbackground:#f5f5f5;\r\nborder:1px solid cc0000;\r\n}\r\n.submit input\r\n{\r\ncolor:black;\r\nbackground:#f7fafc;\r\nborder:2px solid #c00;\r\n}\r\n.myForm fieldset\r\n{\r\nborder:1px solid #c00;\r\n}\r\n.myForm legend\r\n{\r\ncolor:#fff;\r\nbackground:#c00 !important;\r\nborder:1px solid #c00;\r\n}\r\n.manageShareTable\r\n{\r\nborder:1px solid #c00;\r\n}\r\n.shareItemDetails\r\n{\r\nborder-top:1px solid #c00;\r\nborder-bottom:1px solid #c00;\r\n}\r\n.highlight\r\n{\r\nbackground-color:#f2f9be;\r\n}\r\n.pagination a\r\n{\r\ntext-decoration:none;\r\nborder:solid 1px #c00;\r\ncolor:#15B;\r\n}\r\n.pagination .current\r\n{\r\nbackground:#26B;\r\ncolor:#fff;\r\nborder:solid 1px #c00;\r\n}\r\n.pagination .current.prev,.pagination .current.next\r\n{\r\ncolor:#999;\r\nborder-color:#c00;\r\nbackground:#fff;\r\n}\r\n.slowUploadIcon\r\n{\r\nbackground:#004276;\r\n}\r\n.ui-dialog .ui-widget-content\r\n{\r\nbackground-color:#004276;\r\n}\r\n#filesBasket\r\n{\r\nbackground-color:#004276;\r\n}\r\n#manageSyncPanel\r\n{\r\nbackground-color:#fff;\r\n}\r\n.exifInfoPanel\r\n{\r\nbackground-color:black;\r\ncolor:#fff;\r\nborder:1px solid #c00;\r\n}\r\n.exifInfoPanelCollapsed\r\n{\r\ncolor:#fff;\r\n}\r\nli .framePreviewBox div\r\n{\r\nborder:1px solid #c00;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\ntd .framePreviewBox div\r\n{\r\nborder:1px solid #c00;\r\n}\r\n.ui-widget-content\r\n{\r\nbackground:#fff!important;\r\ncolor:#004276!important;\r\nborder:1px solid #c00!important;\r\n}\r\n.ui-widget-header\r\n{\r\nbackground:#c00!important;\r\ncolor:#fff!important;\r\nborder:none!important;\r\npadding:8px!important;\r\nmargin:0 0 5px 0!important;\r\n}\r\n.ui-progressbar-value.ui-widget-header\r\n{\r\npadding:0!important;\r\nmargin:0!important;\r\nbackground:#c00 url(/WebInterface/jQuery/images/pbar-ani.gif)!important;\r\n}\r\n#uploadInfoForm\r\n{\r\nbackground-color:#fff;\r\n}\r\n#fileQueueInfo\r\n{\r\nclear:both;\r\nbackground:#fff!important;\r\nborder:1px solid #c00;\r\n}\r\n.ui-state-error a\r\n{\r\ncolor:#004276!important;\r\n}\r\n.uploadDialog .ui-dialog div\r\n{\r\nbackground-color:#004276;\r\n}\r\n.fileListPanelInfoText\r\n{\r\nbackground-color:#fff;\r\nborder:1px solid #c00;\r\n}\r\n.groupCount\r\n{\r\nbackground:#fff;\r\nborder:2px solid #c00;\r\n}\r\n#dropItemsPanel\r\n{\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.dropzone.hover\r\n{\r\nbackground:#ff9;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n#fileRepo\r\n{\r\nborder:1px solid #c00;\r\nbackground-color:#fff;\r\n-moz-box-shadow:none!important;\r\n-webkit-box-shadow:none!important;\r\nbox-shadow:none!important;\r\n}\r\n.formOption\r\n{\r\nborder:1px solid #eee;\r\n}\r\n.ui-progressbar-value\r\n{\r\nbackground-image:url(/WebInterface/jQuery/images/animated-overlay.gif);\r\n}\r\ndiv#languageSelector {background: transparent;}\r\n"
};

// Interface methods
panelWebInterface.init = function() {
    applyLocalizations(panelName, localizations.panels);
    window.dataBindEvents.push(panelWebInterface.bindData);
    panelWebInterface.bindEvents();
    $("#themeSelector", panelWebInterface._panel).dialog({
        autoOpen: false,
        width: 700,
        modal: true,
        resizable: false,
        closeOnEscape: true
    });
}

panelWebInterface.clearForm = function(panel) {
    panel = panel || panelWebInterface._panel;
    panel.find("input, select, textarea").each(function() {
        if ($(this).attr("type") == "checkbox") {
            if ($(this).closest("td").is(".checkboxArea")) return;
            crushFTP.UI.checkUnchekInput($(this));
        } else {
            $(this).val("");
        }
    });
}

panelWebInterface.bindData = function(userInfo, jsonDeep, panel) {
    var dataPanel = panel || panelWebInterface._panel;
    panelWebInterface.clearForm(dataPanel);
    if (panel) {
        panel.removeClass("inheritValSet");
    }
    if (userInfo.user) {
        userManager.data.bindValuesFromJson(dataPanel, userInfo.user, false, panel);
        panelWebInterface.extraCustomizations = false;
        if(userInfo.user.extraCustomizations){
            panelWebInterface.extraCustomizations = userInfo.user.extraCustomizations;
        }
        var webButtonsList = $("#buttonsList", dataPanel).empty();
        //Binding buttons
        userManager.UI.multiOptionControlDataBind(userInfo.user, "web_buttons", webButtonsList, function(curItem) {
            var key = unescape(curItem.key);
            if (key == "null") return false;
            if (curItem.isgroupRoot == "true")
                return $("<li class='ui-widget-content groupRootItem' key='" + key + "'><div class='groupRoot'>" + key + "</div></li>");
            else if (curItem.isSubItem == "true")
                return $("<li class='ui-widget-content groupSubItem' key='" + key + "'><div class='groupSubItem'>" + key + "</div></li>");
            else
                return $("<li class='ui-widget-content' key='" + key + "'>" + key + "</li>");
        }, !panel);

        panelWebInterface.onButtonSelection();
        //Binding Customizations
        var webCustomizationsDefaultControl = $("#webCustomizationsDefaultList", dataPanel);
        try{
            webCustomizationsDefaultControl.parent().isolatedScroll();
        }catch(ex){}
        webCustomizationsDefaultControl.find("li:hidden").show();
        userManager.UI.multiOptionControlDataBind(userInfo.user, "web_customizations", $("#webCustomizationsList", dataPanel).empty(), function(curItem) {
            var key = curItem.key;
            var value = (curItem.value);
            var keyText = key;
            var itemInDefaultList = webCustomizationsDefaultControl.find("li[key='" + key + "']");
            var htmlArea = false;
            if (itemInDefaultList.length > 0) {
                keyText = itemInDefaultList.text();
                itemInDefaultList.hide();
            }
            var _val = value;
            if (itemInDefaultList.attr("htmlArea")) {
                _val = unescape(_val);
                //_val = crushFTP.methods.htmlEncode(_val);
            }
            var newElem = $("<li class='ui-widget-content' defaultVal='" + itemInDefaultList.attr("defaultVal") + "' _type='" + itemInDefaultList.attr("_type") + "' htmlArea='" + itemInDefaultList.attr("htmlArea") + "' headerText='" + keyText + "' key='" + key + "'>" + keyText + " : <span class='value'>" + (value) + "</span></li>");
            if(itemInDefaultList.attr("notes"))
                newElem.attr("notes", itemInDefaultList.attr("notes"));
            newElem.data("selectedVal", _val);
            return newElem;
        }, !panel, function() {
            webCustomizationsDefaultControl.find("li:hidden").show();
        });

        try{
            $("#webCustomizationsList", dataPanel).parent().isolatedScroll();
        }catch(ex){}
        $("#webCustomizationsList", dataPanel).find("li[htmlArea='true']").each(function() {
            var html = $(this).find("span.value").html();
            $(this).find("span.value").css("display", "block").empty().text(html);
            //$(this).find("iframe").contents().find('body').append(html);
        });

        //Bind all form dropdown lists
        panelWebInterface.bindFormsDropdown($("select.formsField", dataPanel));

        //Method to set selection of custom forms
        function assignSelectedForm(list, value, flagAlways) {
            if (!value || !list) return;
            var dataInheritedFrom = false;
            var curData = userManager.methods.seperateValueAndInheritValue(value);
            value = curData.value;
            dataInheritedFrom = curData.inherit || dataInheritedFrom;
            value = unescape(value).split(":");
            if (value.length > 0) {
                list.val(value[0]);
                if (flagAlways && value.length > 2) {
                    crushFTP.UI.checkUnchekInput(flagAlways, value[2] != "once");
                }
            }
            userManager.methods.showInheritValueLabel(list, dataInheritedFrom);
        }

        //Assign selected common upload form
        assignSelectedForm($("#commonUploadForm", dataPanel), userInfo.user["commonUploadForm"]);
        //Assign selected upload form
        assignSelectedForm($("#uploadForm", dataPanel), userInfo.user["uploadForm"]);
        //Assign selected welcome form
        assignSelectedForm($("#welcomeForm", dataPanel), userInfo.user["messageForm"], $("#showAlways", dataPanel));
        //Assign selected paste form
        assignSelectedForm($("#pasteForm", dataPanel), userInfo.user["pasteForm"]);

        if (!panel) {
            $("#uploadForm", dataPanel).closest("fieldset").removeClass("inheritSet");
            var fieldToUse = "uploadForm";
            if (typeof crushFTP.storage("currentUser").user["uploadForm"] == "undefined") {
                fieldToUse = "pasteForm";
                if (typeof crushFTP.storage("currentUser").user["pasteForm"] == "undefined") {
                    fieldToUse = "welcomeForm";
                }
            }
            userManager.data.setInheritPropertyOfSection($("select.formsField:first", dataPanel), fieldToUse, true);
            var dataInheritedFrom = false;
            var dataInheritedFrom = crushFTP.data.getValueFromJson(userInfo.user, fieldToUse).inheritedFrom || "default";
            userManager.methods.showInheritValueLabel($("select.formsField:first", dataPanel), dataInheritedFrom);
        }

        //Bind domains
        userManager.UI.multiOptionControlDataBind(userInfo.user, "domain_root_list", $("#virtualDomainsList", dataPanel).empty(), function(curItem) {
            var domain = unescape(curItem.domain);
            var path = unescape(curItem.path);
            if (domain == "null")
                return false;
            return $("<li class='ui-widget-content'>" + domain + " -> " + path + "</li>");
        }, !panel);

        //Post Bind Method
        userManager.UI.panelsPostbindEvent(dataPanel, panel);
    }
    if (!$(document).data("crushftp_enterprise"))
    {
        $(".enterpriseFeatureTag", panel).show();
    }
    else
    {
        $(".enterpriseFeatureTag", panel).hide();
    }
}

panelWebInterface.bindFormsDropdown = function(list) {

    //Bind forms dropdown list
    if (!list) return;
    userManager.UI.multiOptionControlDataBind(crushFTP.storage("GUIXMLPrefs"), "CustomForms", list, function(curItem) {
        var id = curItem.id;
        var name = unescape(curItem.name);
        return $("<option value='" + id + "'>" + name + "</option>");
    }, false, function() {
        list.prepend("<option value=''></option>");
    });
}

panelWebInterface.buttons = [
  '(delete)::::javascript:performAction("delete");|Delete',
  '(rename)::::javascript:performAction("rename");|Rename',
  // '(write)::::javascript:performAction("edit");|Edit',
  '(download)::::javascript:performAction("download");|Download',
  '(download)::::javascript:performAction("quickAdvancedDownload");|Advanced Download',
  '(download)::::javascript:performAction("downloadAll");|Download All',
  '(zip)::::javascript:performAction("zip");|ZipDownload',
  '(unzip)::::javascript:performAction("unzip");|Unzip',
  '(zipItems)::::javascript:performAction("zipItems");|Zip Selected',
  '(exploreZip)::::javascript:performAction("exploreZip");|Explore zip contents',
  "(custom)::::javascript:expandAllItems();|Expand/Collapse All Items",
  '(mkdir)::::javascript:performAction("createFolderDiv");|Create Folder',
  '(upload)::::javascript:performAction("upload");|Upload',
  '(search)::::javascript:performAction("searchDiv");|Search',
  '(options)::::javascript:performAction("userOptions");|User Options',
  '(cut)::::javascript:performAction("cut");|Cut',
  '(copy)::::javascript:performAction("copy");|Copy',
  '(paste)::::javascript:performAction("paste");|Paste',
  '(slideshow)::::javascript:performAction("slideshow");|Slideshow',
  '(slideshow)::::javascript:performAction("quickView");|QuickView',
  '(view)::::javascript:performAction("downloadLowRes");|Download Low-Res',
  '(downloadKeywords)::::javascript:performAction("downloadKeywords");|Download Keywords',
  //, '(slideshow)::::javascript:performAction("Preview");|Preview'
  '(view)::::javascript:performAction("batchComplete");|BatchComplete',
  '(share)::::javascript:performAction("share");|Share',
  '(share)::::javascript:performAction("quickShare");|Quick Share',
  '(share)::::javascript:performAction("manageShares");|Manage Shares',
  '(showbasket)::::javascript:performAction("showBasket");|Show Basket',
  '(addbasket)::::javascript:performAction("addToBasket");|Add To Basket',
  '(updateKeywords)::::javascript:performAction("updateKeywords");|Edit Keywords',
  '(changeIcon)::::javascript:performAction("changeIcon");|Change Icon',
  "(custom)::::/WebInterface/CrushTunnel.jnlp|Download CrushTunnel",
  "(custom)::::/WebInterface/help/index.html|Help",
  "(login)::::/WebInterface/login.html|Login",
  "(logout)::::javascript:doLogout();|Logout",
  "(custom)::::(groupButton)|Group",
  "(custom)::::(url,file, or javascript)|Custom"
];

if ($(document).data("crushftp_enterprise")) {
    panelWebInterface.buttons.splice(26, 0, '(downloadSyncApp)::::javascript:performAction("downloadSyncApp", "CrushSync");|Download Sync App');
    panelWebInterface.buttons.splice(27, 0, '(downloadCrushFTPDrive)::::javascript:performAction("downloadCrushFTPDrive", "CrushFTPDrive");|Download CrushFTPDrive');
    panelWebInterface.buttons.splice(27, 0, '(downloadAttachmentRedirector)::::javascript:performAction("downloadAttachmentRedirector", "AttachmentRedirector");|Download AttachmentRedirector');
    panelWebInterface.buttons.splice(28, 0, '(syncManager)::::javascript:popupManageSync();|Sync Manager');
}


panelWebInterface.buttons.push('(setMetaInfo)::::javascript:setMetaInfo({customFormToUse:"formName", noKeyValPairFields : true});|Set Meta Property');
panelWebInterface.buttons.push('(getHistory)::::javascript:getHistory();|Show History');

panelWebInterface.bindEvents = function() {
    //Toggle sections for this panel
    userManager.UI.togglePanels(panelWebInterface._panel);

    $(".checkboxArea>input[type='checkbox']", panelWebInterface._panel).change(function() {
        var curUserData = crushFTP.storage("currentUserInherited");
        if (!$(this).is(":checked")) {
            curUserData = {
                user: crushFTP.storage("currentUsersLowerLevelsData")
            };
            $(this).closest("fieldset").addClass("inheritSet");
        } else
            $(this).closest("fieldset").removeClass("inheritSet");
        if (!$(this).closest("fieldset").hasClass("notInheritable"))
            panelWebInterface.bindData(curUserData, false, $(this).closest("fieldset"));
    });

    // Customization events
    var webCustomizationsDefaultControl = $("#webCustomizationsDefaultList", panelWebInterface._panel);
    var webCustomizationsList = $("#webCustomizationsList", panelWebInterface._panel);
    webCustomizationsDefaultControl.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#addCustomization", panelWebInterface._panel).trigger('click');
            return false;
        }
    });

    webCustomizationsList.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#editCustomization", panelWebInterface._panel).trigger('click');
            return false;
        }
    });

    //Add customization
    $("a#addCustomization", panelWebInterface._panel).click(function() {
        var selected = webCustomizationsDefaultControl.find("li.ui-selected");
        if (selected.length > 0) {
            var promptVal = selected.attr("key");
            var isColorBox = false;
            var isHTMLArea = false;
            if (promptVal.toLowerCase().indexOf("color") >= 0) {
                promptVal = "Enter HTML color value for " + selected.text();
                isColorBox = true;
            } else {
                promptVal = selected.text();
            }
            if (selected.attr("htmlArea") == "true") {
                isHTMLArea = true;
            }
            var options = false;
            if (selected.attr("_type") == "languageSelection") {
                options = ["en|English","cn|Chinese","cs|Czech","da|Danish","nl|Dutch","fr|French","de|German","hu|Hungarian","it|Italian","ko|Korean","pl|Polish","ro|Romanian","ru|Russian","sk|Slovak","es|Spanish","se|Swedish"];
            } else if (selected.attr("_type") == "advanceModeDefaultOptions") {
                options = ["OVERWRITE|Overwrite", "RESUME|Resume", "ASK|Ask"];
            } else if (selected.attr("_type") == "advanceModeConfirmDefaultOptions") {
                options = ["OVERWRITE|Overwrite", "OVERWRITE_ALL|Overwrite All", "RESUME|Resume", "RESUME_ALL|Resume All", "SKIP|Skip", "SKIP_ALL|Skip All"];
            } else if (selected.attr("_type") == "waveformType") {
                options = ["always|Always", "onplay|While playing", "never|Never"];
            }
            if (selected.attr("key") == "maxImageSizeForThumbnail") {
                options = ["1|Small", "2|Medium", "3|Large"];
            }
            // if (selected.attr("defaultVal") == "true" || selected.attr("defaultVal") == "false") {
            //     options = ["true|True", "false|False"];
            // }
            var note = selected.attr("notes") || false;
            if(note)
                note = "<div style='margin-top:10px'>"+note+"</div>";
            if(selected.attr("key").toString().toLowerCase().trim()!="metainfokeystoshowintreeview")
            {
                jPrompt(promptVal + " : ", unescape(selected.attr("defaultVal")), "Input", function(value) {
                    if (value != null) {
                        // Append selected option to list and hide from default list
                        var newElem = selected.clone()
                            .removeClass("ui-widget-header")
                            .removeClass("ui-selected")
                            .append(" : <span class='value'></span>")
                            .data("selectedVal", (value))
                            .attr("htmlArea", isHTMLArea)
                            .attr("headerText", selected.text());
                        webCustomizationsList.append(newElem);
                        if (isHTMLArea) {
                            //value = crushFTP.methods.decode(value);
                            webCustomizationsList.find("li:last").find("span.value").text(value);
                        } else
                            webCustomizationsList.find("li:last").find("span.value").text(value);
                        selected.hide();
                        panelWebInterface._panel.trigger("changed", [webCustomizationsList]);
                    }
                }, options, false, {
                    isColorBox: isColorBox,
                    isTextArea: isHTMLArea,
                    appendAfterInput : note
                });
            }
            else
            {
                var existingData = [];
                var items = unescape(selected.attr("defaultVal")).split("\n");
                var value;
                for (var i = 0; i < items.length; i++) {
                    if(items[i]!='' && items[i]!=undefined)
                    {
                        var curVal = items[i].split("||");
                        if(curVal.length!=0)
                        {
                            existingData.push({
                                key : curVal[0]!=undefined?curVal[0]:'',
                                name : curVal[1]!=undefined?curVal[1]:'',
                                value : curVal[2]!=undefined?curVal[2]:''
                            });
                        }
                    }
                }
                var CustomizationMetaInfoDialog = $('#CustomizationMetaInfoDialog');
                var CustomizationMetaInfoDialogData=$('#CustomizationMetaInfoDialogData').html();
                CustomizationMetaInfoDialog.empty().append(CustomizationMetaInfoDialogData);
                $("#CustomizationMetaInfoDialogData").show();
                var CustomizationMetaInfoDialogTemplate = CustomizationMetaInfoDialog.html();
                CustomizationMetaInfoDialog.dialog({
                    resizable: false,
                    modal: true,
                    width: 700,
                    title : "Input",
                    minHeight : 250,
                    create: function() {
                        $(this).css("maxHeight", 350);
                        $(this).css("minHeight", 150);
                    },
                    open: function() {
                        $('body').css('overflow','hidden');
                    },
                    close: function() {
                        $('body').css('overflow','auto');
                    },
                    buttons: {
                        OK: function() {
                            var result="";
                            CustomizationMetaInfoDialog.find(".key-val-field:visible").each(function(){
                                var key = $(this).find("input.key").val();
                                var name = $(this).find("input.name").val();
                                var val = $(this).find("input.value").val();
                                if(key){
                                    result = result+key+"||"+name+"||"+val+"\n";
                                }
                            });
                            value=result.substring(0,result.length-1);
                            selected.data("selectedVal", (value));
                            var newElem = selected.clone()
                                .removeClass("ui-widget-header")
                                .removeClass("ui-selected")
                                .append(" : <span class='value'></span>")
                                .data("selectedVal", (value))
                                .attr("htmlArea", isHTMLArea)
                                .attr("headerText", selected.text());
                            newElem.find("span.value").text(value);
                            webCustomizationsList.append(newElem);
                            panelWebInterface._panel.trigger("changed", [webCustomizationsList]);
                            selected.hide();
                            $(this).dialog("close");
                        },
                        Cancel: function() {
                            $(this).dialog("close");
                        }
                    }
                });
                CustomizationMetaInfoDialog.find(".key-val-field").EnableMultiField({
                    confirmOnRemove: true,
                    data: existingData,
                    linkText : "",
                    linkClass : "_addItem",
                    removeLinkText : "",
                    removeLinkClass : "_removeItem",
                    addEventCallback : function(newElem, clonnedFrom){
                        newElem.addClass("added-item").find("input:first").focus();
                        newElem.find("input,textarea").each(function(index, el) {
                            $(this).removeAttr('id');
                        });
                        newElem.find("input:visible:first").focus();
                    },
                    removeEventCallback : function(prev, self, uid){
                    }
                });
            }
        }
        return false;
    });

    //Edit selected customization
    $("a#editCustomization", panelWebInterface._panel).click(function() {
        var selected = webCustomizationsList.find("li.ui-selected");
        if (selected.length > 0) {
            var promptVal = selected.attr("key");
            var isColorBox = false;
            var isHTMLArea = false;
            if (promptVal.toLowerCase().indexOf("color") >= 0) {
                promptVal = "Enter HTML color value for " + selected.attr("headerText");
                isColorBox = true;
            } else {
                promptVal = selected.attr("headerText");
            }
            var val = (selected.data("selectedVal"));
            if (selected.attr("htmlArea") == "true") {
                isHTMLArea = true;
            }
            var options = false;
            if (selected.attr("_type") == "languageSelection") {
                options = ["en|English","cn|Chinese","cs|Czech","da|Danish","nl|Dutch","fr|French","de|German","hu|Hungarian","it|Italian","ko|Korean","pl|Polish","ro|Romanian","ru|Russian","sk|Slovak","es|Spanish","se|Swedish"];
            } else if (selected.attr("_type") == "advanceModeDefaultOptions") {
                options = ["OVERWRITE|Overwrite", "RESUME|Resume", "ASK|Ask"];
            } else if (selected.attr("_type") == "advanceModeConfirmDefaultOptions") {
                options = ["OVERWRITE|Overwrite", "OVERWRITE_ALL|Overwrite All", "RESUME|Resume", "RESUME_ALL|Resume All", "SKIP|Skip", "SKIP_ALL|Skip All"];
            } else if (selected.attr("_type") == "waveformType") {
                options = ["always|Always", "onplay|While playing", "never|Never"];
            }
            if (selected.attr("key") == "maxImageSizeForThumbnail") {
                options = ["1|Small", "2|Medium", "3|Large"];
            }
            // if (selected.attr("defaultVal") == "true" || selected.attr("defaultVal") == "false") {
            //     options = ["true|True", "false|False"];
            // }
            var note = selected.attr("notes") || false;
            if(note)
                note = "<div style='margin-top:10px'>"+note+"</div>";
            if(selected.attr("key").toString().toLowerCase().trim()!="metainfokeystoshowintreeview")
            {
                jPrompt(promptVal + " : ", val, "Input", function(value) {
                    if (value != null) {
                        // Update data and value of selected option
                        selected.data("selectedVal", (value));
                        if (isHTMLArea) {
                            //value = crushFTP.methods.decode(value);
                            selected.find("span.value").text(value);
                        } else
                            selected.find("span.value").text(value);
                        panelWebInterface._panel.trigger("changed", [webCustomizationsList]);
                    }
                }, options, false, {
                    isColorBox: isColorBox,
                    isTextArea: isHTMLArea,
                    appendAfterInput : note
                });
            }
            else
            {
                var existingData = [];
                var items = val.split("\n");
                var value;
                for (var i = 0; i < items.length; i++) {
                    if(items[i]!='' && items[i]!=undefined)
                    {
                        var curVal = items[i].split("||");
                        if(curVal.length!=0)
                        {
                            existingData.push({
                                key : curVal[0]!=undefined?curVal[0]:'',
                                name : curVal[1]!=undefined?curVal[1]:'',
                                value : curVal[2]!=undefined?curVal[2]:''
                            });
                        }
                    }
                }
                var CustomizationMetaInfoDialog = $('#CustomizationMetaInfoDialog');
                var CustomizationMetaInfoDialogData=$('#CustomizationMetaInfoDialogData').html();
                CustomizationMetaInfoDialog.empty().append(CustomizationMetaInfoDialogData);
                $("#CustomizationMetaInfoDialogData").show();
                var CustomizationMetaInfoDialogTemplate = CustomizationMetaInfoDialog.html();
                CustomizationMetaInfoDialog.dialog({
                    resizable: false,
                    modal: true,
                    width: 700,
                    title : "Input",
                    minHeight : 250,
                    create: function() {
                        $(this).css("maxHeight", 350);
                        $(this).css("minHeight", 150);
                    },
                    open: function() {
                        $('body').css('overflow','hidden');
                    },
                    close: function() {
                        $('body').css('overflow','auto');
                    },buttons: {
                        OK: function() {
                            var result="";
                            CustomizationMetaInfoDialog.find(".key-val-field:visible").each(function(){
                                var key = $(this).find("input.key").val();
                                var name = $(this).find("input.name").val();
                                var val = $(this).find("input.value").val();
                                if(key){
                                    result = result+key+"||"+name+"||"+val+"\n";
                                }
                            });
                            value=result.substring(0,result.length-1);
                            selected.data("selectedVal", (value));
                            if (isHTMLArea) {
                                selected.find("span.value").text(value);
                            } else
                                selected.find("span.value").text(value);
                            panelWebInterface._panel.trigger("changed", [webCustomizationsList]);
                            $(this).dialog("close");
                        },
                        Cancel: function() {
                            $(this).dialog("close");
                        }
                    }
                });
                CustomizationMetaInfoDialog.find(".key-val-field").EnableMultiField({
                    confirmOnRemove: true,
                    data: existingData,
                    linkText : "",
                    linkClass : "_addItem",
                    removeLinkText : "",
                    removeLinkClass : "_removeItem",
                    addEventCallback : function(newElem, clonnedFrom){
                        newElem.addClass("added-item").find("input:first").focus();
                        newElem.find("input,textarea").each(function(index, el) {
                            $(this).removeAttr('id');
                        });
                        newElem.find("input:visible:first").focus();
                    },
                    removeEventCallback : function(prev, self, uid){
                    }
                });
            }
        }
        return false;
    });

    // Remove selected customization
    $("a#removeCustomization", panelWebInterface._panel).click(function() {
        // Remove from list and show in default list
        crushFTP.UI.removeItem(webCustomizationsList, function(focused, removed) {
            var removedKey = $(removed).attr("key");
            webCustomizationsDefaultControl.find("li[key='" + removedKey + "']").show();
            panelWebInterface._panel.trigger("changed", [webCustomizationsList]);
        }, true);
        return false;
    });

    // Button events
    var webButtonsList = $("#buttonsList", panelWebInterface._panel);
    webButtonsList.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#editMenuItem", panelWebInterface._panel).trigger('click');
            return false;
        }
    });
    try{
        webButtonsList.parent().isolatedScroll();
    }catch(ex){}
    // Move button up/down
    $("a#moveUpMenuItem, a#moveDownMenuItem", panelWebInterface._panel).click(function() {
        if ($(this).hasClass('ui-state-disabled'))
            return false;
        var selected = webButtonsList.find("li.ui-selected.ui-widget-header");
        if (selected.length > 0) {
            if (selected.hasClass('groupRootItem')) {
                if ($(this).is("#moveUpMenuItem")) {
                    if (selected.prev().length > 0 && selected.prev().is(".groupSubItem")) {
                        var toMove = false;
                        if (selected.next().is(".groupSubItem"))
                            toMove = selected.nextUntil(":not(.groupSubItem)");
                        selected.prevUntil(".groupRootItem").filter(":last").prev().before(selected);
                        if (toMove)
                            selected.after(toMove);
                    } else {
                        var toMove = false;
                        if (selected.next().is(".groupSubItem"))
                            toMove = selected.nextUntil(":not(.groupSubItem)");
                        crushFTP.UI.moveItem(selected, true, true);
                        if (toMove)
                            selected.after(toMove);
                    }
                } else {
                    var toMove = false;
                    if (selected.next().is(".groupSubItem"))
                        toMove = selected.nextUntil(":not(.groupSubItem)");

                    if (selected.next().length > 0 && selected.next().is(".groupRootItem")) {
                        var newPlace = selected.next().nextUntil(":not(.groupSubItem)").filter(":last");
                        if (newPlace.length > 0)
                            newPlace.after(selected);
                        else
                            crushFTP.UI.moveItem(selected, false, true);
                        if (toMove)
                            selected.after(toMove);
                    } else if (toMove && toMove.length > 0 && toMove.filter(":last").next().is(".groupRootItem")) {
                        var newPlace = toMove.filter(":last").next().nextUntil(":not(.groupSubItem)").filter(":last");
                        if (newPlace.length > 0)
                            newPlace.after(selected);
                        else
                            crushFTP.UI.moveItem(selected, false, true);
                        if (toMove)
                            selected.after(toMove);
                    } else {
                        if (toMove && toMove.length > 0)
                            toMove.filter(":last").next().after(selected);
                        else
                            crushFTP.UI.moveItem(selected, false, true);
                        selected.after(toMove);
                    }
                }
            } else
                crushFTP.UI.moveItem(selected, $(this).is("#moveUpMenuItem"), true);
            panelWebInterface._panel.trigger("changed", [webButtonsList]);
            panelWebInterface.resetMoveButtons();
            selected.closest("div.sideScroll").scrollTo(selected);
        }
        return false;
    });

    //Remove selected button
    $("a#removeMenuItem", panelWebInterface._panel).click(function() {
        if ($(this).hasClass('ui-state-disabled'))
            return false;
        var selectedButtonItem = webButtonsList.find("li.ui-selected");
        if (selectedButtonItem.hasClass('groupRootItem')) {
            jConfirm("You are trying to remove a Group Item. Select options : ", "Confirm", function(value) {
                if (value) {
                    var toRemove;
                    if (selectedButtonItem.next().is(".groupSubItem"))
                        toRemove = selectedButtonItem.nextUntil(":not(.groupSubItem)");
                    if (toRemove) {
                        toRemove.remove();
                    }
                    selectedButtonItem.remove();
                    panelWebInterface._panel.trigger("changed", [webButtonsList]);
                    panelWebInterface.resetMoveButtons();
                }
            }, {
                prependButtons: [{
                    button: '<a href="javascript:void(0);" id="popup_continue" class="button" style="margin-right:10px;"><span style="display:inline-block;margin:-1px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-check"></span><span class="">Keep Sub-items</span></a>&nbsp;&nbsp;',
                    clickEvent: function() {
                        var toKeep;
                        if (selectedButtonItem.next().is(".groupSubItem"))
                            toKeep = selectedButtonItem.nextUntil(":not(.groupSubItem)");
                        if (toKeep) {
                            toKeep.each(function(index, el) {
                                $(this).removeClass('groupSubItem').find("div.groupSubItem").removeClass('groupSubItem');
                                var buttonData = $(this).data("controlData");
                                buttonData.isgroupRoot =
                                    buttonData.isSubItem = false;
                                $(this).data("controlData", buttonData);
                            });
                        }
                        selectedButtonItem.remove();
                        $("#popup_cancel").click();
                        panelWebInterface._panel.trigger("changed", [webButtonsList]);
                        panelWebInterface.resetMoveButtons();
                    }
                }],
                okButtonText: "Remove Group with Sub-items",
                okButtonClassAdd: "ui-icon-trash",
                popupWidth: 650
            });
        } else {
            crushFTP.UI.removeItem(webButtonsList, function() {
                panelWebInterface.buttonSelected(selectedButtonItem, selectedButtonItem.hasClass('groupRootItem'));
                panelWebInterface._panel.trigger("changed", [webButtonsList]);
                panelWebInterface.resetMoveButtons();
            });
        }
        return false;
    });

    //Add new button
    $("a#addMenuItem, #addSubMenuItem", panelWebInterface._panel).click(function() {

        if ($(this).hasClass('ui-state-disabled'))
            return false;
        var isSubItem = $(this).is("#addSubMenuItem");
        var buttons = $.extend(true, [], panelWebInterface.buttons);
        var selectedButtonItem = webButtonsList.find("li.ui-selected");
        if (isSubItem) {
            if (!selectedButtonItem.hasClass("groupRootItem")) {
                return false;
            }
            var filteredButtons = [];
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].indexOf("(groupButton)") < 0)
                    filteredButtons.push(buttons[i]);
            };
            buttons = filteredButtons;
        }

        //$("#WebInterfaceButtonDialog").find("#bannedIPlist").unbind("change").bind("change", function() {});
        $("#WebInterfaceButtonDialog").dialog({
            resizable: false,
            modal: true,
            width: 450,
            create: function() {
                $(this).css("maxHeight", 300);
            },
            open: function(command, key) {
                $("#filter_Button").val("");
                var formWebInterfaceButtonList1 = $("#WebInterfaceButtonList");
                $("#WebInterfaceButtonList").html("");
                for (var i = 0; i < panelWebInterface.buttons.length; i++) {
                    var newControl = $("<li class='ui-widget-content' WebInterfaceButtonId=" + encodeURIComponent(panelWebInterface.buttons[i]) + "> " + panelWebInterface.buttons[i].split("|")[1] + " </li>");
                    formWebInterfaceButtonList1.append(newControl);
                }
                ascending_order_ButtonList();

                var filter_WebInterfaceButton = $("#filter_Button").unbind("keyup").keyup(function(evt) {
                    var evt = (evt) ? evt : ((event) ? event : null);
                    var phrase = this.value;
                    delay(function() {

                        listToFilter = $("#WebInterfaceButtonList");
                        listToFilter.find("li").hide();
                        listToFilter.find("li:Contains('" + phrase + "')").show();
                        $("#WebInterfaceButtonList li").removeClass("ui-selected ui-widget-header");
                        $("#WebInterfaceButtonList li:visible:first").addClass("ui-selected ui-widget-header");
                        window.last_searched_usd_c = phrase;
                    }, 500);
                });
                $("#WebInterfaceButtonList li:first").addClass("ui-selected ui-widget-header");
                $(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable").position({
                    my: "center",
                    at: "center",
                    of: window
                });
            },
            buttons: {
                OK: function() {
                    $(this).dialog("close");
                    var webinterfacebuttonID = decodeURIComponent($('#WebInterfaceButtonList .ui-selected').attr("webinterfacebuttonid")).split("|");
                    var webinterfacebuttonValue = $('#WebInterfaceButtonList .ui-selected').html();
                    var command = webinterfacebuttonID[0];
                    var key = webinterfacebuttonValue.trim();
                    var data = command.split("::::");
                    var privs = data[0];
                    command = data[1];
                    var buttonName = key;
                    function enterButtonName() {
                        jPrompt("Enter a name for this button : ", buttonName, "Button Name", function(value) {
                            if (value != null) {
                                buttonName = value;
                                function opnMetaPopup()
                                {
                                    $("#MetaPopupDialog").dialog({
                                        resizable: false,
                                        modal: true,
                                        width: 450,
                                        create: function() {
                                            $(this).css("maxHeight", 300);
                                        },
                                        open: function() {
                                            var textstring=command;
                                            var formsPanel = $("#MetaPopupDialog #customFormToUseId").empty();
                                            var forms = crushFTP.storage("GUIXMLPrefs").CustomForms.CustomForms_subitem;
                                            for(var i=0;i<forms.length;++i){
                                                if(formsPanel.find("option[value='"+forms[i].name+"']").length==0)
                                                    formsPanel.prepend("<option value="+forms[i].name+">"+forms[i].name+"</option>");
                                            }
                                            formsPanel.prepend("<option value=''></option>");
                                            crushFTP.UI.checkUnchekInput($("#MetaPopupDialog #noKeyValPairFieldsYes"), true);
                                            crushFTP.UI.checkUnchekInput($("#MetaPopupDialog #noKeyValPairFieldsNo"), false);
                                            $("#MetaPopupDialog #showFormAboveKeyPairFieldId").val("false");

                                        },
                                        buttons: {
                                            OK: function() {
                                                var formsPanel = $("#MetaPopupDialog #customFormToUseId");
                                                value = "javascript:setMetaInfo({customFormToUse:'"+formsPanel.val()+"', noKeyValPairFields:'"+$("#MetaPopupDialog #noKeyValPairFieldsYes").is(":checked")+"',formBeforeKeyValPair:'"+$("#MetaPopupDialog #showFormAboveKeyPairFieldId").val()+"'});"
                                                var appendTo = false;
                                                if (isSubItem) {
                                                    appendTo = selectedButtonItem;
                                                    if (appendTo.next().is(".groupSubItem"))
                                                        appendTo = appendTo.nextUntil(":not(.groupSubItem)").filter(":last");
                                                }
                                                var listClass = isSubItem ? "groupSubItem" : "";
                                                var isSub = isSubItem || "false";
                                                crushFTP.UI.addItem(webButtonsList, $("<li class='ui-widget-content " + listClass + "' key='" + privs + ":" + buttonName + "'><div class='" + listClass + "'>" + privs + ":" + buttonName + "</div></li>"), {
                                                    key: privs + ":" + buttonName,
                                                    for_menu: true,
                                                    requiredPriv: privs,
                                                    value: value,
                                                    isSubItem: isSub,
                                                    for_context_menu: false
                                                }, false, appendTo);
                                                panelWebInterface.buttonSelected(webButtonsList, webButtonsList.find(".ui-widget-header"));
                                                panelWebInterface._panel.trigger("changed", [webButtonsList]);
                                                $(this).dialog("close");
                                            },
                                            Cancel: function() {
                                                $(this).dialog("close");
                                            }
                                        }
                                    });
                                }

                                function enterCommand() {
                                    jPrompt("In general you should leave this value as its default. <br> Enter the 'href' target for this button : ", command, "Target", function(value) {
                                        if (value != null) {
                                            var appendTo = false;

                                            if (isSubItem) {
                                                appendTo = selectedButtonItem;
                                                if (appendTo.next().is(".groupSubItem"))
                                                    appendTo = appendTo.nextUntil(":not(.groupSubItem)").filter(":last");
                                            }
                                            var listClass = isSubItem ? "groupSubItem" : "";
                                            var isSub = isSubItem || "false";
                                            crushFTP.UI.addItem(webButtonsList, $("<li class='ui-widget-content " + listClass + "' key='" + privs + ":" + buttonName + "'><div class='" + listClass + "'>" + privs + ":" + buttonName + "</div></li>"), {
                                                key: privs + ":" + buttonName,
                                                for_menu: true,
                                                requiredPriv: privs,
                                                value: value,
                                                isSubItem: isSub,
                                                for_context_menu: false
                                            }, false, appendTo);
                                            panelWebInterface.buttonSelected(webButtonsList, webButtonsList.find(".ui-widget-header"));
                                            panelWebInterface._panel.trigger("changed", [webButtonsList]);
                                        }
                                    });
                                }
                                if (command == "(groupButton)") {
                                    if (isSubItem) {
                                        alert("You can not add group here");
                                        return false;
                                    }
                                    crushFTP.UI.addItem(webButtonsList, $("<li class='ui-widget-content groupRootItem' key='" + privs + ":" + buttonName + "'><div class='groupRoot'>" + privs + ":" + buttonName + "</div></li>"), {
                                        key: privs + ":" + buttonName,
                                        for_menu: true,
                                        isgroupRoot: true,
                                        requiredPriv: privs,
                                        value: command,
                                        for_context_menu: false
                                    });
                                    panelWebInterface.buttonSelected(webButtonsList, webButtonsList.find(".ui-widget-header"));
                                    panelWebInterface._panel.trigger("changed", [webButtonsList]);
                                }
                                else
                                {
                                    if(value.toString().toLowerCase().trim()!="set meta property")
                                        enterCommand();
                                    else
                                        opnMetaPopup();
                                }
                            }
                        });
                    }
                    enterButtonName();
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
        return false;
    });

    //Edit selected button
    $("a#editMenuItem", panelWebInterface._panel).click(function() {
        if ($(this).hasClass('ui-state-disabled'))
            return false;
        var selected = webButtonsList.find("li.ui-selected");
        var isSubItem = selected.hasClass("groupSubItem");
        if (selected && selected.length > 0) {
            var controlData = selected.data("controlData");
            var key = unescape(controlData.key);
            if (key) {
                var term = [];
                term.push(key.substr(0, key.indexOf(":")));
                term.push(key.replace(term[0] + ':', ''));
                key = term;
            }
            var buttonName = $.trim(key[1]);
            var privs = $.trim(key[0]);
            jPrompt("Enter a name for this button : ", buttonName, "Button Name", function(value) {
                if (value != null) {
                    buttonName = value;
                    var command = unescape(controlData.value);
                    function opnMetaPopup()
                    {
                        $("#MetaPopupDialog").dialog({
                            resizable: false,
                            modal: true,
                            width: 450,
                            create: function() {
                                $(this).css("maxHeight", 300);
                            },
                            open: function() {
                                var formsPanel = $("#MetaPopupDialog #customFormToUseId").empty();
                                var forms = crushFTP.storage("GUIXMLPrefs").CustomForms.CustomForms_subitem;
                                for(var i=0;i<forms.length;++i){
                                    if(formsPanel.find("option[value='"+forms[i].name+"']").length==0)
                                        formsPanel.prepend("<option value="+forms[i].name+">"+forms[i].name+"</option>");
                                }
                                formsPanel.prepend("<option value=''></option>");
                                $("#MetaPopupDialog #showFormAboveKeyPairFieldId").val("false");
                                var textstring=command.replace("javascript:setMetaInfo({",'');
                                textstring = textstring.replace(/[`~!@#$%^&*()_|+\-=?;'".<>\{\}\[\]\\\/]/gi, '');
                                var items = textstring.split(",");
                                var Values;
                                for (var i = 0; i < items.length; i++) {
                                    var curIPs = items[i].split(":");
                                    if(curIPs.length!=0)
                                    {
                                        if(curIPs[0].trim()=='customFormToUse')
                                            formsPanel.val(curIPs[customFormToUse]=curIPs[1].trim());
                                        if(curIPs[0].trim()=='noKeyValPairFields')
                                        {
                                            if(curIPs[1].trim()=='true')
                                                crushFTP.UI.checkUnchekInput($("#MetaPopupDialog #noKeyValPairFieldsYes"), true);
                                            else
                                                crushFTP.UI.checkUnchekInput($("#MetaPopupDialog #noKeyValPairFieldsNo"), true);
                                        }
                                        if(curIPs[0].trim()=='formBeforeKeyValPair')
                                            $("#MetaPopupDialog #showFormAboveKeyPairFieldId").val(curIPs[customFormToUse]=curIPs[1].trim());
                                    }
                                 }
                            },
                            buttons: {
                                OK: function() {
                                    value = "javascript:setMetaInfo({customFormToUse:'"+$("#MetaPopupDialog #customFormToUseId").val()+"', noKeyValPairFields:'"+$("#MetaPopupDialog #noKeyValPairFieldsYes").is(":checked")+"',formBeforeKeyValPair:'"+$("#MetaPopupDialog #showFormAboveKeyPairFieldId").val()+"'});"
                                    if (value != null) {
                                        var listClass = isSubItem ? "groupSubItem" : "";
                                        crushFTP.UI.replaceItem(selected, $("<li class='ui-widget-content " + listClass + "' key='" + privs + ":" + buttonName + "'><div class='" + listClass + "'>" + privs + ":" + buttonName + "</div></li>"), {
                                            key: privs + ":" + buttonName,
                                            for_menu: controlData.for_menu,
                                            requiredPriv: privs,
                                            value: value,
                                            for_context_menu: controlData.for_context_menu
                                        }, function() {
                                            panelWebInterface._panel.trigger("changed", [webButtonsList]);
                                        });
                                    }
                                    $(this).dialog("close");
                                },
                                Cancel: function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }

                    function enterCommand() {
                        jPrompt("In general you should leave this value as its default. <br> Enter the 'href' target for this button : ", command, "Target", function(value) {

                            if (value != null) {
                                var listClass = isSubItem ? "groupSubItem" : "";
                                crushFTP.UI.replaceItem(selected, $("<li class='ui-widget-content " + listClass + "' key='" + privs + ":" + buttonName + "'><div class='" + listClass + "'>" + privs + ":" + buttonName + "</div></li>"), {
                                    key: privs + ":" + buttonName,
                                    for_menu: controlData.for_menu,
                                    requiredPriv: privs,
                                    value: value,
                                    for_context_menu: controlData.for_context_menu
                                }, function() {
                                    panelWebInterface._panel.trigger("changed", [webButtonsList]);
                                });
                            }
                        });
                    }
                    if (command == "(groupButton)") {
                        crushFTP.UI.replaceItem(selected, $("<li class='ui-widget-content groupRootItem' key='" + privs + ":" + buttonName + "'><div class='groupRoot'>" + privs + ":" + buttonName + "</div></li>"), {
                            key: privs + ":" + buttonName,
                            for_menu: controlData.for_menu,
                            requiredPriv: privs,
                            value: command,
                            isgroupRoot: true,
                            for_context_menu: controlData.for_context_menu
                        }, function() {
                            panelWebInterface._panel.trigger("changed", [webButtonsList]);
                        });
                    }
                    else
                    {
                        if(value.toString().toLowerCase().trim()!="set meta property")
                            enterCommand();
                        else
                            opnMetaPopup();
                    }
                }
            });
        }
        return false;
    });

    //Bind on select of button from list
    webButtonsList.unbind("onSelect").bind("onSelect", function(evt, list, selected) {
        panelWebInterface.buttonSelected(list, selected);
    });

    webCustomizationsDefaultControl.find("li").click(function() {
        if (!$(this).hasClass("ui-widget-header")) {
            webCustomizationsDefaultControl.find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
            $(this).addClass("ui-widget-header ui-selected");
        }
    });

    //Change data of selected button when option changes
    var buttonsPanel = $("#buttonsPanel", panelWebInterface._panel);
    $("#buttonOnMenuBar, #buttonOnContextMenu", buttonsPanel).change(function() {
        if ($(this).hasClass('ui-state-disabled'))
            return false;
        var selected = webButtonsList.find("li.ui-selected");
        if (selected && selected.length > 0) {
            var controlData = selected.data("controlData");
            if ($(this).is(":checked")) {
                if ($(this).is("#buttonOnMenuBar")) {
                    controlData.for_menu = "true";
                } else if ($(this).is("#buttonOnContextMenu")) {
                    controlData.for_context_menu = "true";
                }
            } else {
                if ($(this).is("#buttonOnMenuBar")) {
                    controlData.for_menu = "false";
                } else if ($(this).is("#buttonOnContextMenu")) {
                    controlData.for_context_menu = "false";
                }
            }
            selected.data("controlData", controlData);
            panelWebInterface._panel.trigger("changed", [webButtonsList]);
        } else {
            crushFTP.UI.checkUnchekInput($("#buttonOnMenuBar", buttonsPanel), false);
            crushFTP.UI.checkUnchekInput($("#buttonOnContextMenu", buttonsPanel), false);
        }
    });

    // Virtual Domain events
    var virtualDomainsList = $("#virtualDomainsList", panelWebInterface._panel);
    virtualDomainsList.bind("dblclick", function(evt){
        if(evt.target && $(evt.target).is("li")){
            $("a#editDomain", panelWebInterface._panel).trigger('click');
            return false;
        }
    });
    // Move domain up/down
    $("a#moveUpDomain, a#moveDownDomain", panelWebInterface._panel).click(function() {
        if ($(this).hasClass('ui-state-disabled'))
            return false;
        if (virtualDomainsList.find("li.ui-selected").length > 0) {
            crushFTP.UI.moveItem(virtualDomainsList.find("li.ui-selected"), $(this).is("#moveUpDomain"), true);
            panelWebInterface._panel.trigger("changed", [virtualDomainsList]);
        }
        return false;
    });

    //Remove selected domain
    $("a#deleteDomain", panelWebInterface._panel).click(function() {
        crushFTP.UI.removeItem(virtualDomainsList, function() {
            panelWebInterface._panel.trigger("changed", [virtualDomainsList]);
        });
        return false;
    });

    //Add/Edit selected domain
    $("a#addDomain", panelWebInterface._panel).click(function(evt, control) {
        var domain = "";
        var path = "";
        if (control && control.length > 0 && control.data) {
            var controlData = control.data("controlData");
            domain = controlData.domain;
            path = controlData.path;
        }
        jPrompt("Please enter the domain. (Pattern matching is allowed such as *.domain.com) : ", domain, "Input", function(domain) {
            if (domain != null) {
                if (domain.length == 0) {
                    jAlert("Please enter domain", "Message", function() {
                        $("a#addDomain", panelWebInterface._panel).trigger("click", [control]);
                    });
                    return;
                }

                function enterPath() {
                    jPrompt("Please enter the root folder for this domain in this user's VFS : <br />Example : /CrushFTP_Root/", path, "Input", function(path) {
                        if (path != null) {
                            if (path.length == 0) {
                                jAlert("Please enter path", "Message", function() {
                                    enterPath();
                                });
                                return;
                            }
                            if (control) // If edit mode
                            {
                                crushFTP.UI.addItem(virtualDomainsList, $("<li class='ui-widget-content'>" + domain + " -> " + path + "</li>"), {
                                    domain: domain,
                                    path: path
                                }, function(newControl) {
                                    control.replaceWith(newControl); // Append to list and replace selected with new item
                                });
                            } else // If add mode
                            {
                                crushFTP.UI.addItem(virtualDomainsList, $("<li class='ui-widget-content'>" + domain + " -> " + path + "</li>"), {
                                    domain: domain,
                                    path: path
                                });
                            }
                            panelWebInterface._panel.trigger("changed", [virtualDomainsList]);
                        }
                    });
                }
                enterPath();
            }
        });
        return false;
    });

    //Event to edit domain
    $("a#editDomain", panelWebInterface._panel).click(function() {
        var selected = virtualDomainsList.find("li.ui-selected");
        if (selected && selected.length > 0) {
            $("a#addDomain", panelWebInterface._panel).trigger("click", [selected]);
        }
        return false;
    });

    function filterCustomizations(phrase, isUsed) {
        var listToFilter;
        if (isUsed)
            listToFilter = $("#webCustomizationsList", panelWebInterface._panel);
        else
            listToFilter = $("#webCustomizationsDefaultList", panelWebInterface._panel);

        listToFilter.find("li").hide();
        if (isUsed)
            listToFilter.find("li:Contains('" + phrase + "')").show();
        else {
            var usedItems = $("#webCustomizationsList", panelWebInterface._panel);
            listToFilter.find("li:Contains('" + phrase + "')").each(function() {
                var that = $(this);
                if (usedItems.find("li[key='" + $(this).attr("key") + "']").length == 0)
                    that.show();
            });
        }
    }

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    var ascending_order_ButtonList = (function() {

        var items = $('#WebInterfaceButtonList li').get();
        items.sort(function(a, b) {
            var keyA = $(a).text();
            var keyB = $(b).text();

            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

        var ul = $('#WebInterfaceButtonList');
        $.each(items, function(i, li) {
            ul.append(li);
        });
    });

    var descending_order_ButtonList = (function() {

        var items = $('#WebInterfaceButtonList li').get();
        items.sort(function(a, b) {
            var keyA = $(a).text();
            var keyB = $(b).text();

            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });

        var ul = $('#WebInterfaceButtonList');
        $.each(items, function(i, li) {
            ul.append(li);
        });

    });

    $("#clearFilter_filterWebInterfaceButton").click(function() {
        $("#filter_Button").val("").trigger("keyup");
        $("#WebInterfaceButtonList li").removeClass("ui-selected ui-widget-header");
        $("#WebInterfaceButtonList li:first").addClass("ui-selected ui-widget-header");
        return false;
    });

    $("#Ascending_orderCall").click(function() {
        ascending_order_ButtonList();
        $(this).hide();
        $("#Descending_orderCall").show();
        return false;
    });

    $("#Descending_orderCall").click(function() {
        descending_order_ButtonList();
        $(this).hide();
        $("#Ascending_orderCall").show();
        return false;
    });

    var filterAvailableCustomizations = $("#filterAvailableCustomizations", panelWebInterface._panel).unbind("keyup").keyup(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var phrase = this.value;
        if (panelWebInterface.last_searched_avl_c && window.last_searched_avl_c === phrase) {
            return false;
        }
        delay(function() {
            filterCustomizations(phrase);
            window.last_searched_avl_c = phrase;
        }, 500);
    });

    var filterAddedCustomizations = $("#filterAddedCustomizations", panelWebInterface._panel).unbind("keyup").keyup(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var phrase = this.value;
        if (panelWebInterface.last_searched_usd_c && window.last_searched_usd_c === phrase) {
            return false;
        }
        delay(function() {
            filterCustomizations(phrase, true);
            window.last_searched_usd_c = phrase;
        }, 500);
    });

    $("#clearAvlFilter", panelWebInterface._panel).click(function() {
        filterAvailableCustomizations.val("").trigger("keyup");
        return false;
    });

    $("#clearUsdFilter", panelWebInterface._panel).click(function() {
        filterAddedCustomizations.val("").trigger("keyup");
        return false;
    });

    var themeSelector = $("#themeSelector", panelWebInterface._panel);
    $("#addThemeCss", panelWebInterface._panel).click(function() {
        themeSelector.dialog("open");
        return false;
    });
    themeSelector.find("a").click(function() {
        panelWebInterface.addThemeCSS($(this).attr("_rel"));
        themeSelector.dialog("close");
        return false;
    });

    function filterButtonsMethod(phrase) {
        var listToFilter = $("#buttonsList", panelWebInterface._panel);
        listToFilter.find("li").hide();
        listToFilter.find("li:Contains('" + phrase + "')").show();

        listToFilter.find("li.ui-widget-header").removeClass('selected ui-widget-header');
        panelWebInterface.onButtonSelection();
    }

    var filterButtons = $("#filterButtons", panelWebInterface._panel).unbind("keyup").keyup(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var phrase = this.value;
        if (window.last_searched_button === phrase) {
            return false;
        }
        delay(function() {
            filterButtonsMethod(phrase);
            window.last_searched_button = phrase;
        }, 500);
    });

    $("#clearButtonsFilter", panelWebInterface._panel).click(function() {
        filterButtons.val("").trigger("keyup");
        return false;
    });

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
}

panelWebInterface.addThemeCSS = function(theme) {
    var customCssTA = $("#css", panelWebInterface._panel);
    var curCSS = customCssTA.val();
    var themeCss = panelWebInterface.webUIThemes[theme] || "";
    if (curCSS.indexOf("/*WebUIThemeStart*/") >= 0) {
        var start = curCSS.indexOf("/*WebUIThemeStart*/");
        var end = curCSS.indexOf("/*WebUIThemeEnd*/");
        var buildThemeCSS = curCSS.substr(0, start) + "/*WebUIThemeStart*/" + themeCss + "/*WebUIThemeEnd*/" + curCSS.substr(end + ("/*WebUIThemeEnd*/").length, curCSS.length);
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    } else {
        var buildThemeCSS = curCSS + "/*WebUIThemeStart*/" + themeCss + "/*WebUIThemeEnd*/";
        customCssTA.val(buildThemeCSS).trigger("change").focus();
    }
}

panelWebInterface.resetMoveButtons = function() {
    var selected = $("#buttonsList", panelWebInterface._panel).find("li.ui-widget-header");
    var buttonsPanel = $("#buttonsPanel", panelWebInterface._panel);
    if (selected.length > 0) {
        $("#editMenuItem,#removeMenuItem,#moveUpMenuItem,#moveDownMenuItem").removeClass('ui-state-disabled');
        $("#buttonOnMenuBar").parent().next().removeClass('ui-state-disabled');
        $("#buttonOnContextMenu").parent().next().removeClass('ui-state-disabled');
        $("#buttonOnMenuBar").closest("td").removeClass('ui-state-disabled');
        $("#buttonOnContextMenu").closest("td").removeClass('ui-state-disabled');
        $("#addSubMenuItem").addClass('ui-state-disabled');
        if (selected.hasClass('groupSubItem')) {
            if (selected.prev().length > 0 && selected.prev().hasClass('groupSubItem'))
                $("#moveUpMenuItem").removeClass('ui-state-disabled');
            else
                $("#moveUpMenuItem").addClass('ui-state-disabled');

            if (selected.next().length > 0 && selected.next().hasClass('groupSubItem'))
                $("#moveDownMenuItem").removeClass('ui-state-disabled');
            else
                $("#moveDownMenuItem").addClass('ui-state-disabled');
        } else if (selected.hasClass('groupRootItem')) {
            if (selected.prev().length > 0)
                $("#moveUpMenuItem").removeClass('ui-state-disabled');
            else
                $("#moveUpMenuItem").addClass('ui-state-disabled');

            if (selected.next().length > 0 && selected.next().is(".groupSubItem")) {
                if (selected.nextUntil(":not(.groupSubItem)").filter(":last").next().length > 0)
                    $("#moveDownMenuItem").removeClass('ui-state-disabled');
                else
                    $("#moveDownMenuItem").addClass('ui-state-disabled');
            } else if (selected.next().length > 0) {
                $("#moveDownMenuItem").removeClass('ui-state-disabled');
            } else
                $("#moveDownMenuItem").addClass('ui-state-disabled');

            $("#addSubMenuItem").removeClass('ui-state-disabled');
        } else {
            if (selected.prev().length > 0)
                $("#moveUpMenuItem").removeClass('ui-state-disabled');
            else
                $("#moveUpMenuItem").addClass('ui-state-disabled');

            if (selected.next().length > 0)
                $("#moveDownMenuItem").removeClass('ui-state-disabled');
            else
                $("#moveDownMenuItem").addClass('ui-state-disabled');
        }
    } else {
        $("#addSubMenuItem,#editMenuItem,#removeMenuItem,#moveUpMenuItem,#moveDownMenuItem").addClass('ui-state-disabled');
        $("#buttonOnMenuBar").parent().next().addClass('ui-state-disabled');
        $("#buttonOnContextMenu").parent().next().addClass('ui-state-disabled');
        $("#buttonOnMenuBar").closest("td").addClass('ui-state-disabled');
        $("#buttonOnContextMenu").closest("td").addClass('ui-state-disabled');
    }
}

panelWebInterface.onButtonSelection = function(flag, isgroupRoot) {
    if (flag) {
        $("#editMenuItem,#removeMenuItem,#moveUpMenuItem,#moveDownMenuItem").removeClass('ui-state-disabled');
        $("#buttonOnMenuBar").parent().next().removeClass('ui-state-disabled');
        $("#buttonOnContextMenu").parent().next().removeClass('ui-state-disabled');
        $("#buttonOnMenuBar").closest("td").removeClass('ui-state-disabled');
        $("#buttonOnContextMenu").closest("td").removeClass('ui-state-disabled');
        if (isgroupRoot)
            $("#addSubMenuItem").removeClass('ui-state-disabled');
        else
            $("#addSubMenuItem").addClass('ui-state-disabled');
        panelWebInterface.resetMoveButtons();
    } else {
        $("#addSubMenuItem,#editMenuItem,#removeMenuItem,#moveUpMenuItem,#moveDownMenuItem").addClass('ui-state-disabled');
        $("#buttonOnMenuBar").parent().next().addClass('ui-state-disabled');
        $("#buttonOnContextMenu").parent().next().addClass('ui-state-disabled');
        $("#buttonOnMenuBar").closest("td").addClass('ui-state-disabled');
        $("#buttonOnContextMenu").closest("td").addClass('ui-state-disabled');
    }
}

// Event on button select
panelWebInterface.buttonSelected = function(list, selected) {
    var buttonsPanel = $("#buttonsPanel", panelWebInterface._panel);
    var for_menu = "";
    var for_context_menu = "";
    if (selected) // If button is selected
    {
        // Options for selected button
        var controlData = selected.data("controlData");
        if (controlData) {
            if (controlData.for_menu)
                for_menu = controlData.for_menu.toString().toLowerCase();
            if (controlData.for_context_menu)
                for_context_menu = controlData.for_context_menu.toString().toLowerCase();
        }
    }
    panelWebInterface.onButtonSelection(selected, selected && selected.hasClass('groupRootItem'));
    crushFTP.UI.checkUnchekInput($("#buttonOnMenuBar", buttonsPanel), for_menu == "true");
    crushFTP.UI.checkUnchekInput($("#buttonOnContextMenu", buttonsPanel), for_context_menu == "true");
}


panelWebInterface.generateSpecialItemsXML = function(name, type) {
    type = type || "add";
    var xml = "";
    if (name == "Customizations") {
        if (type == "add") {
            //Web customization
            if (panelWebInterface._panel.find("#webCustomizationsCheck").find("input:checked").length > 0) {
                xml += "\r\n<web_customizations type=\"vector\">";
                var webCustomizationsList = $("#webCustomizationsList", panelWebInterface._panel);
                webCustomizationsList.find("li").each(function() {
                    if ($(this) && $(this).attr("key") && $(this).data("selectedVal")) {
                        var _val = crushFTP.methods.htmlEncode(($(this).data("selectedVal")));
                        xml += "\r\n<web_customizations_subitem type=\"properties\">";
                        xml += "\r\n<key>" + $(this).attr("key") + "</key>";
                        xml += "\r\n<value>" + _val + "</value>";
                        xml += "\r\n</web_customizations_subitem>";
                    }
                });
                xml += "\r\n</web_customizations>";
            }
        } else
            xml = "web_customizations";
    } else if (name == "Forms") {
        if (type == "add") {
            //Custom Forms
            if (panelWebInterface._panel.find("#webFormsCheck").find("input:checked").length > 0) {
                $("select.formsField", panelWebInterface._panel).each(function() {
                    var selectedVal = $(this).val();
                    var tag = $(this).attr("id");
                    if (selectedVal && selectedVal.length > 0) {
                        var formName = $(this).find(":selected").text() || "";
                        var isAlways = "";
                        if (tag == "welcomeForm") {
                            tag = "messageForm";
                            if ($("#showAlways", panelWebInterface._panel).is(":checked")) {
                                isAlways = ":always";
                            } else {
                                isAlways = ":once";
                            }
                        }
                        selectedVal = selectedVal || "";
                        isAlways = isAlways || "";
                        xml += "\r\n<" + tag + ">" + selectedVal + ":" + formName + isAlways + "</" + tag + ">";
                    } else {
                        if (tag == "welcomeForm") {
                            tag = "messageForm";
                        }
                        xml += "\r\n<" + tag + "></" + tag + ">";
                    }
                });
            }
        } else
            xml = "messageForm;uploadForm;pasteForm";
    } else if (name == "Buttons") {
        if (type == "add") {
            //Web buttons
            if (panelWebInterface._panel.find("#webButtonsCheck").find("input:checked").length > 0) {
                xml += "\r\n<web_buttons type=\"vector\">";
                var webButtonsList = $("#buttonsList", panelWebInterface._panel);
                var hasButtons = false;
                webButtonsList.find("li").each(function() {
                    var buttonData = $(this).data("controlData");
                    if (buttonData) {
                        buttonData.isSubItem = buttonData.isSubItem || "false";
                        buttonData.isgroupRoot = buttonData.isgroupRoot || "false";

                        buttonData.isSubItem = buttonData.isSubItem == "undefined" ? "false" : buttonData.isSubItem;
                        buttonData.isgroupRoot = buttonData.isgroupRoot == "undefined" ? "false" : buttonData.isgroupRoot;

                        hasButtons = true;
                        xml += "\r\n<web_buttons_subitem type=\"properties\">";
                        xml += "\r\n<key>" + buttonData.key + "</key>";
                        xml += "\r\n<for_menu>" + buttonData.for_menu + "</for_menu>";
                        xml += "\r\n<isgroupRoot>" + buttonData.isgroupRoot + "</isgroupRoot>";
                        xml += "\r\n<isSubItem>" + buttonData.isSubItem + "</isSubItem>";
                        xml += "\r\n<requiredPriv>" + buttonData.requiredPriv + "</requiredPriv>";
                        xml += "\r\n<value>" + crushFTP.methods.htmlEncode(buttonData.value) + "</value>";
                        xml += "\r\n<for_context_menu>" + buttonData.for_context_menu + "</for_context_menu>";
                        xml += "\r\n</web_buttons_subitem>";
                    }
                });
                if (!hasButtons) {
                    xml += "\r\n<web_buttons_subitem type=\"properties\">";
                    xml += "\r\n<key>null</key>";
                    xml += "\r\n<for_menu>false</for_menu>";
                    xml += "\r\n<isgroupRoot>false</isgroupRoot>";
                    xml += "\r\n<isSubItem>flase</isSubItem>";
                    xml += "\r\n<requiredPriv>null</requiredPriv>";
                    xml += "\r\n<value>null</value>";
                    xml += "\r\n<for_context_menu>null</for_context_menu>";
                    xml += "\r\n</web_buttons_subitem>";
                }
                xml += "\r\n</web_buttons>";
            }
        } else
            xml = "web_buttons";
    } else if (name == "Domains") {
        if (type == "add") {
            //Virtual domains root
            if (panelWebInterface._panel.find("#domainRootListCheck").find("input:checked").length > 0) {
                xml += "\r\n<domain_root_list type=\"vector\">";
                var virtualDomainsList = $("#virtualDomainsList", panelWebInterface._panel);
                var hasDomain = false;
                virtualDomainsList.find("li").each(function() {
                    var domainData = $(this).data("controlData");
                    if (domainData) {
                        hasDomain = true;
                        xml += "\r\n<domain_root_list_subitem type=\"properties\">";
                        xml += "\r\n<path>" + crushFTP.methods.htmlEncode(domainData.path) + "</path>";
                        xml += "\r\n<domain>" + crushFTP.methods.htmlEncode(domainData.domain) + "</domain>";
                        xml += "\r\n</domain_root_list_subitem>";
                    }
                });
                if (!hasDomain) {
                    xml += "\r\n<domain_root_list_subitem type=\"properties\">";
                    xml += "\r\n<path>null</path>";
                    xml += "\r\n<domain>null</domain>";
                    xml += "\r\n</domain_root_list_subitem>";
                }
                xml += "\r\n</domain_root_list>";
            }
        } else
            xml = "domain_root_list";
    }
    else if (name == "extraCustomizations") {
        if (type == "add") {
            var items = panelWebInterface.extraCustomizations;
            if(items){
                xml += "\r\n<extraCustomizations type=\"properties\">";
                for (var item in items) {
                    if(item != "type")
                        xml += "<" + item + ">" + items[item] + "</" + item + ">";
                }
                xml += "\r\n</extraCustomizations>";
            }
        } else
            xml = "extraCustomizations";
    }
    return xml;
}

panelWebInterface.generateXML = function() {
    var xml = "";

    //General items
    panelWebInterface._panel.find("td.checkboxArea").not(".specialProperty").find("input:checked").each(function() {
        var formPanel = $(this).closest("td").next();
        xml += "\r\n" + userManager.data.buildXMLToSubmitForm(formPanel);
    });
    xml += panelWebInterface.generateSpecialItemsXML("Customizations");
    xml += panelWebInterface.generateSpecialItemsXML("extraCustomizations");
    xml += panelWebInterface.generateSpecialItemsXML("Forms");
    xml += panelWebInterface.generateSpecialItemsXML("Buttons");
    xml += panelWebInterface.generateSpecialItemsXML("Domains");
    return xml;
}