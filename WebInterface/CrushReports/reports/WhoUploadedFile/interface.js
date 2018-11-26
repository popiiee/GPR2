/*Report interface*/

crushReports.reports.WhoUploadedFileTemplateFolder = "WhoDownloadedFile";
crushReports.isLoadingScript = true;
$.getScript("reports/WhoDownloadedFile/interface.js", function(){
    crushReports.reports.WhoUploadedFile = function(data, tpl) {
        crushReports.reports.WhoDownloadedFile(data, tpl, "upload");
    };
    crushReports.callbackOnReady();
    delete crushReports.callbackOnReady;
});