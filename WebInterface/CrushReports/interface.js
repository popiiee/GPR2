/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var crushReports = {};
crushReports.localization = {};
/****************************/

// Panel details
crushReports.panelName = "panelCrushReports";
crushReports._panel = $("#" + crushReports.panelName);

$(document).ready(function() {
    var queryStr = window.location.search.replace("?parameters=", "");
    var parameters = queryStr;
    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    var isEmbed = inIframe();
    $.ajax({
        type: "GET",
        async: "true",
        url: "/WebInterface/function/?command=runReport&" + parameters,
        dataType: "xml",
        async: false,
        contentType: "text/xml; charset=\"utf-8\"",
        success: function(xmlresponse) {
            $(".reports-all").hide();
            if (xmlresponse == null) {
                $("#upload-download-summary-table").empty();
                var notfoundtbl = "<thead><tr>" +
                    "<th style='text-align:center;'>No Data found!</th>" +
                    "</tr></thead><tbody>";
                $("#upload-download-summary-table").html(notfoundtbl + "<tbody>");
                $("#reports_summary_div").show();
                $("#report-parameters-panel").hide();
                return false;
            }
            var xmlresult = xmlresponse.getElementsByTagName("results")[0];

            if (xmlresponse != undefined && xmlresponse != "" && xmlresponse != null && xmlresult != undefined && xmlresult != "" && xmlresult != null) {
                var paraarray = parameters.split("&");
                var reportcall = "";
                var paraErrorMsg = "";
                var isError=false;

                for (var i = 0; i < paraarray.length; i++) {
                    if(paraarray[i].split("=")[0] == 'error')
                    {
                        paraErrorMsg=paraarray[i].split("=")[1];
                        isError=true;
                    }
                    if (paraarray[i].split("=")[0] == 'reportName')
                    {
                        reportcall = paraarray[i].split("=")[1];
                        //break;
                    }
                }
                if(!isError && reportcall!="")
                {
                    var x = xmlresponse.getElementsByTagName("results")[0];
                    var parametersStr = $(x).find("results > params").text().slice(1, -1)
                    var paraarray = parametersStr.split(",");
                    var parametersDivRenderStr = "";

                    for (var i = 0; i < paraarray.length; i++) {
                        var para1=paraarray[i].split("=")[0].toLowerCase().trim();
                        if(para1!='c2f' && para1!='instance' && para1!='reportname' && para1!='command' && para1!='export'){
                            parametersDivRenderStr += ("<div class='parameters-div'>" +
                                "<span class='parameters-title'>" + paraarray[i].split("=")[0] + " : </span>" +
                                "<span>" + paraarray[i].split("=")[1] + "</span>" +
                                "</div>");
                        }
                    }

                    $("#report-parameters .panel-body").append("<div>" + parametersDivRenderStr + "</div>");
                    switch (reportcall.toLowerCase()) {
                        case "accountactivitysummary":
                            $("#report-title").html("Account Activity Summary");
                            $("#reports_summary_div").show();
                            accountActivitySummary(xmlresponse);
                            break;
                        case "topdownloadsuploads":
                            $("#report-title").html("Top Downloads and Uploads");
                            $("#top_downloads_uploads_div").show();
                            $(".top-downloads-uploads-extra").show();
                            $("#extra-details-callapse").show();
                            topDownloadsUploads(xmlresponse);
                            collapseall();
                            break;
                        case "sharessummary":
                            $("#report-title").html("Shares Summary");
                            $("#reports_summary_div").show();
                            sharesSummary(xmlresponse);
                            break;
                        case "uploaddownloadsummary":
                            $(".main-chart").show();
                            $("#report-title").html("Upload and Download Summary");
                            $("#reports_summary_div").show();
                             $(".upload-downloads-summary-extra").show();
                            $("#extra-details-callapse").show();
                            uploadDownloadSummary(xmlresponse);
                            collapseall();
                            break;
                        case "auditsummary":
                            $(".main-chart").show();
                            $("#report-title").html("Audit Summary");
                            $(".audit-summary-extra").show();
                            $("#extra-details-callapse").show();
                            $("#reports_summary_div").show();
                            auditSummary(xmlresponse);
                            collapseall();
                            break;
                        case "uploaddownloadratios":
                            $(".main-chart").show();
                            $("#report-title").html("Upload and Download Ratios");
                            $(".UpDwRt-extra").show();
                            $("#extra-details-callapse").show();
                            $("#reports_summary_div").show();
                            uploadDownloadRatios(xmlresponse);
                            break;
                        case "failedlogins":
                            $("#report-title").html("Failed Logins");
                            $(".faildlogin-extra").show();
                            $("#extra-details-callapse").show();
                            $("#reports_summary_div").show();
                            failedLogins(xmlresponse);
                            break;
                        case "currentlogins":
                            $("#report-title").html("Current Logins");
                            $("#reports_summary_div").show();
                            currentLogins(xmlresponse);
                            break;
                        case "uploadformssearch":
                            $("#report-title").html("Upload Forms Search");
                            $("#reports_summary_div").show();
                            uploadFormsSearch(xmlresponse);
                            break;
                        case "welcomeformssearch":
                            $("#report-title").html("Welcome Forms Search");
                            uploadFormsSearch(xmlresponse);
                            $("#reports_summary_div").show();
                            break;
                        case "userfolderpermissions":
                            $("#report-title").html("User folder Permissions");
                            $("#reports_summary_div").show();
                            userfolderPermissions(xmlresponse);
                            break;
                        case "userfoldersizes":
                            $("#report-title").html("User folder Size");
                            $("#reports_summary_div").show();
                            userfolderSizes(xmlresponse);
                            break;
                        case "userusage":
                            $("#report-title").html("User Usage");
                            $("#reports_summary_div").show();
                            $(".user-usg-extra").show();
                            $("#extra-details-callapse").show();
                            userUsage(xmlresponse);
                            break;
                        case "exportuserpass":
                            $("#report-title").html("Export UserPass");
                            $("#reports_summary_div").show();
                            exportUserPass(xmlresponse);
                            break;
                        case "jobschedules":
                            $("#report-title").html("Job Schedules");
                            $("#reports_summary_div").show();
                            jobSchedules(xmlresponse);
                            break;
                        case "userips":
                            $("#report-title").html("User IPs");
                            $("#reports_summary_div").show();
                            $(".user-ip-count-extra").show();
                            $("#extra-details-callapse").show();
                            userIPs(xmlresponse);
                            break;
                        case "whodownloadedfile":
                            $("#report-title").html("Who Downloaded File");
                            $(".whoDwnFile-extra").show();
                            $("#extra-details-callapse").show();
                            $("#reports_summary_div").show();
                            whoDownloadedFile(xmlresponse);
                            collapseall();
                            break;
                        case "whorenamedfile":
                            $("#report-title").html("Who Renamed File");
                            $("#reports_summary_div").show();
                            $(".whoRenFile-extra").show();
                            $("#extra-details-callapse").show();
                            whoRenamedFile(xmlresponse);
                            collapseall();
                            break;
                        case "whodeletedfile":
                            $("#report-title").html("Who Deleted File");
                            $("#reports_summary_div").show();
                            $(".whoDelFile-extra").show();
                            $("#extra-details-callapse").show();
                            whoDeletedFile(xmlresponse);
                            collapseall();
                            break;
                        case "whouploadedfile":
                            $("#report-title").html("Who Uploaded File");
                            $("#reports_summary_div").show();
                            $(".whoUplFile-extra").show();
                            $("#extra-details-callapse").show();
                            whoUploadedFile(xmlresponse);
                            collapseall();
                            break;
                        case "expiringaccounts":
                            $("#report-title").html("Expiring Accounts");
                            $("#reports_summary_div").show();
                            expiringAccounts(xmlresponse);
                            break;
                        default:
                            $("#reportDialogNew").hide();
                    }
                    // set highlight for all...
                    setTimeout(function() {
                        $("input[type='search']").on('keyup', function() {
                            $("#" + $(this).attr("aria-controls")).removeHighlight();
                            $("#" + $(this).attr("aria-controls")).highlight($(this).val());
                        });

                        // Set ellipsis for <SVG> <TEXT> html -- Start ---
                        setTimeout(function() {
                            var p=$('#extra-details-callapse-panel svg text');
                            p.each(function() {
                                if(p.html().length>10)
                                {
                                    p.html(p.html().substring(0,8)+"...");
                                }
                            });
                        },1000);
                        // -- END ---
                    }, 500);

                }
                else
                {
                    // Error From Parameter....
                    $("#upload-download-summary-table").empty();
                    var notfoundtbl ="";
                    if(paraErrorMsg!="")
                    {
                        notfoundtbl = "<thead><tr>" +
                        "<th style='text-align:center;color:red;'>"+paraErrorMsg+"</th>" +
                        "</tr></thead><tbody>";
                    }
                    else
                    {
                        notfoundtbl = "<thead><tr>" +
                        "<th style='text-align:center;color:red;'>Error!</th>" +
                        "</tr></thead><tbody>";
                    }

                    $("#upload-download-summary-table").html(notfoundtbl + "<tbody>");
                    $("#reports_summary_div").show();
                    $("#report-parameters-panel").hide();
                }
            } else {
                $("#upload-download-summary-table").empty();
                var notfoundtbl = "<thead><tr>" +
                    "<th style='text-align:center;'>No Data found!</th>" +
                    "</tr></thead><tbody>";
                $("#upload-download-summary-table").html(notfoundtbl + "<tbody>");
                $("#reports_summary_div").show();
                $("#report-parameters-panel").hide();
            }
        },
        error: function(e) {
            $("#upload-download-summary-table").empty();
            var notfoundtbl = "<thead><tr>" +
                "<th style='text-align:center;'>No Data found!</th>" +
                "</tr></thead><tbody>";
            $("#upload-download-summary-table").html(notfoundtbl + "<tbody>");
            $("#reports_summary_div").show();
            $("#report-parameters-panel").hide();
            return "error";
        }
    });

    function collapseall() {
        setTimeout(function() {
            $('.panel-collapse.in').collapse('hide');
        }, 100);
    }

    function bindDataTableGrid(tabname, pageSize) {
        var pageofsize = 50;
        if (pageSize != undefined && pageSize != '' && pageSize != null)
            pageofsize = pageSize;
        var table = $('#' + tabname).DataTable({
            dom: 'lBfrtip',
            searchHighlight: true,
            iDisplayLength: pageofsize,
            buttons: [{
                    extend: 'csvFlash',
                    title: 'CrushCSV_export'
                }
            ]
        });
    }

    function bindDataTableLazyLoadingGrid(dataset, tabname, pageSize, maxWidth) {
        var pageofsize = 50;
        if (pageSize != undefined && pageSize != '' && pageSize != null)
            pageofsize = pageSize;
        var maxwidth = '150px';
        if (maxWidth != undefined && maxWidth != '' && maxWidth != null)
            maxwidth = maxWidth + 'px';
        var table = $('#' + tabname).DataTable({
            data: dataset,
            deferRender: true,
            scrollY: 500,
            scrollCollapse: true,
            scroller: true,
            searchHighlight: true,
            fnRowCallback: function(nRow, aData, iDisplayIndex) {
                var x = nRow;
                $(x).find('td').each(function() {
                    $(this).addClass('reports-td');
                    $(this).css("max-width", maxwidth);
                    $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
                });
                return nRow;
            },
            //dom: 'Bfrtip',
            iDisplayLength: pageofsize,
            buttons: [{
                    extend: 'csvFlash',
                    title: 'CrushCSV_export'
                }
            ]
        });
        $('.dataTables_scrollBody').css('height', '250px');
    }

    function bindDatatableNoExport(tabname, pageSize) {
        var pageofsize = 50;
        if (pageSize != undefined && pageSize != '' && pageSize != null)
            pageofsize = pageSize;

        $('.' + tabname).each(function() {
            var _this = $(this).attr("id");
            if ($('#' + _this + '  th').length != 0)
                var table = $('#' + _this).DataTable({
                    iDisplayLength: pageofsize
                });
        });
    }

    //  CretaBar Chart from ID and Datas
    function createBarchart(offsetdata, values, barwidth, id) {
        $('#' + id).sparkline(values, {
            type: "bar",
            tooltipFormat: '{{offset:offset}}',
            height: '9.0em',
            barWidth: barwidth,
            tooltipValueLookups: {
                'offset': offsetdata
            },
        });
    }

    // // Get Size in Memory Msr.
    // function getSizefromValue(value) {
    //     if ((value) < 8)
    //         value = value + " Bit";
    //     else if (value < 1024)
    //         value = value + " Bytes";
    //     else if ((value / 1024) < 1024)
    //         value = (value / 1024).toFixed(1) + " KB";
    //     else if (((value / 1024) / 1024) < 1024)
    //         value = ((value / 1024) / 1024).toFixed(1) + " MB";
    //     else if ((((value / 1024) / 1024) / 1024) < 1024)
    //         value = (((value / 1024) / 1024) / 1024).toFixed(1) + " GB";
    //     else if (((((value / 1024) / 1024) / 1024) / 1024) < 1024)
    //         value = ((((value / 1024) / 1024) / 1024) / 1024).toFixed(1) + " TB";
    //     else if ((((((value / 1024) / 1024) / 1024) / 1024) / 1024) < 1024)
    //         value = (((((value / 1024) / 1024) / 1024) / 1024) / 1024).toFixed(1) + " PB";
    //     else
    //         value = "its Exabyte,Zettabyte,Yottabyte..."
    //     return value;
    // }

    //  topDownloadsUploads Reports Bind from XML
    function topDownloadsUploads(xml) {
        var pathStr = "";
        var urlStr = "";
        var infocheck="";
        if ($(parent.document).find("#reportConfiguration").find("#showPaths_1").is(":checked") || !isEmbed) {
            pathStr = "<th>Path</th>";
        }
        if ($(parent.document).find("#reportConfiguration").find("#showURLs_1").is(":checked") || !isEmbed) {
            urlStr = "<th style='width:10%;'>URL</th>";
        }
        if ($(parent.document).find("#reportConfiguration").find("#showFormInfo_1").is(":checked") || !isEmbed)
        {
            infocheck="<th>Form Info</th>";
        }
        var uploadtable = "<thead><tr>" + urlStr + "<th>Name</th><th>Size</th><th>Average Speed</th>"+infocheck+"</tr></thead>";
        var x = $(xml).find("results")[0];
        var uploaddataset = [];
        var maxFileSizeUpload=0;
        var minFileSizeUpload=0;
        var maxAvgSpeedUpload=0;
        var minAvgSpeedUpload=0;
        var TotalSizeUpload=0;
        var checkFirst=0;
        $(x).find("uploads > uploads_subitem").each(function() {
            var curItem = $(this);
            var url = curItem.find("url").text();
            var name = curItem.find("name").text();
            var size = curItem.find("size").text();
            var averageSpeed = curItem.find("averageSpeed").text();
            if(checkFirst==0)
            {
                maxFileSizeUpload=size;
                minFileSizeUpload=size;
                maxAvgSpeedUpload=averageSpeed;
                minAvgSpeedUpload=averageSpeed;
            }
            else
            {
                if(parseInt(maxFileSizeUpload)<parseInt(size))
                    maxFileSizeUpload=size;
                if(parseInt(minFileSizeUpload)>parseInt(size))
                    minFileSizeUpload=size;
                if(parseInt(maxAvgSpeedUpload)<parseInt(averageSpeed))
                    maxAvgSpeedUpload=averageSpeed;
                if(parseInt(minAvgSpeedUpload)>parseInt(averageSpeed))
                    minAvgSpeedUpload=averageSpeed;
            }
            TotalSizeUpload=parseInt(size)+parseInt(TotalSizeUpload);
            checkFirst=1;
            size = crushFTP.methods.formatBytes(size);
            var path = curItem.find("path").text();
            averageSpeed = crushFTP.methods.formatBytes(averageSpeed) + "/sec";
            var infocheckStr="";
            $(this).find("metaInfo").each(function() {
                if($(this).find("unique_upload_id")!=undefined && $(this).find("unique_upload_id").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>unique_upload_id :</span>"+$(this).find("unique_upload_id").text()+"<br>";
                if($(this).find("encryption")!=undefined && $(this).find("encryption").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>encryption :</span>"+$(this).find("encryption").text()+"<br>";
                if($(this).find("UploadFormName")!=undefined && $(this).find("UploadFormName").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>UploadFormName :</span>"+$(this).find("UploadFormName").text()+"<br>";
                if($(this).find("form_name")!=undefined && $(this).find("form_name").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>form_name :</span>"+$(this).find("form_name").text()+"<br>";
                if($(this).find("checksum")!=undefined && $(this).find("checksum").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>checksum :</span>"+$(this).find("checksum").text()+"<br>";
                if($(this).find("notes")!=undefined && $(this).find("notes").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>notes :</span>"+$(this).find("notes").text()+"<br>";
                if($(this).find("dept")!=undefined && $(this).find("dept").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>dept :</span>"+$(this).find("dept").text()+"<br>";
                if($(this).find("UploadFormId")!=undefined && $(this).find("UploadFormId").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>UploadFormId :</span>"+$(this).find("UploadFormId").text()+"<br>";
            });
            if (pathStr != "" && urlStr != "" && infocheck!=""){
                uploaddataset.push([url, path + name, size, averageSpeed,infocheckStr]);
            }
            else if (pathStr == "" && urlStr == "" && infocheck=="") {
                uploaddataset.push([name, size, averageSpeed]);
            }
            else if (pathStr != "" && urlStr == "" && infocheck=="") {
                uploaddataset.push([path + name, size, averageSpeed]);
            }
            else if (pathStr == "" && urlStr != "" && infocheck=="") {
                uploaddataset.push([url, name, size, averageSpeed]);
            }
            else if (pathStr == "" && urlStr == "" && infocheck!="") {
                uploaddataset.push([name, size, averageSpeed,infocheckStr]);
            }
            else if (pathStr != "" && urlStr != "" && infocheck=="") {
                uploaddataset.push([url,  path +name, size, averageSpeed]);
            }
            else if (pathStr == "" && urlStr != "" && infocheck!="") {
                uploaddataset.push([url, name, size, averageSpeed,infocheckStr]);
            }
            else if (pathStr != "" && urlStr == "" && infocheck!="") {
                uploaddataset.push([path +name, size, averageSpeed,infocheckStr]);
            }
        });

        $("#uploads_tbl").empty();
        $("#uploads_tbl").html(uploadtable);
        bindDataTableLazyLoadingGrid(uploaddataset, "uploads_tbl");
        var downloadtable = "<thead><tr>" + urlStr + "<th>Name</th><th>Size</th><th>Count</th><th>Average Speed</th>"+infocheck+"</tr></thead>";
        var downloaddataset = [];
        var maxFileSizeDownload=0;
        var minFileSizeDownload=0;
        var maxAvgSpeedDownload=0;
        var minAvgSpeedDownload=0;
        var TotalSizeDownload=0;
        var maxCountFileDownload=0;
        var maxCountFileNameDownload="";
        var checkFirst=0;
        $(x).find("downloads > downloads_subitem").each(function() {
            var curItem = $(this);
            var url = curItem.find("url").text();
            var name = curItem.find("name").text();
            var size = curItem.find("size").text();
            var averageSpeed = curItem.find("averageSpeed").text();
            var count = curItem.find("count").text();
            if(checkFirst==0)
            {
                maxFileSizeDownload=size;
                minFileSizeDownload=size;
                maxAvgSpeedDownload=averageSpeed;
                minAvgSpeedDownload=averageSpeed;
                maxCountFileDownload=count;
                maxCountFileNameDownload=name;
            }
            else
            {
                if(parseInt(maxFileSizeDownload)<parseInt(size))
                    maxFileSizeDownload=size;
                if(parseInt(minFileSizeDownload)>parseInt(size))
                    minFileSizeDownload=size;
                if(parseInt(maxAvgSpeedDownload)<parseInt(averageSpeed))
                    maxAvgSpeedDownload=averageSpeed;
                if(parseInt(minAvgSpeedDownload)>parseInt(averageSpeed))
                    minAvgSpeedDownload=averageSpeed;
                if(parseInt(maxCountFileDownload)<parseInt(count))
                {
                    maxCountFileDownload=count;
                    maxCountFileNameDownload=name;
                }
            }
            TotalSizeDownload=parseInt(size)+parseInt(TotalSizeDownload);
            checkFirst=1;
            size = crushFTP.methods.formatBytes(size);
            var path = curItem.find("path").text();
            averageSpeed = crushFTP.methods.formatBytes(averageSpeed) + "/sec";
            var infocheckStr="";
            $(this).find("metaInfo").each(function() {
                if($(this).find("unique_upload_id")!=undefined && $(this).find("unique_upload_id").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>unique_upload_id :</span>"+$(this).find("unique_upload_id").text()+"<br>";
                if($(this).find("encryption")!=undefined && $(this).find("encryption").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>encryption :</span>"+$(this).find("encryption").text()+"<br>";
                if($(this).find("UploadFormName")!=undefined && $(this).find("UploadFormName").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>UploadFormName :</span>"+$(this).find("UploadFormName").text()+"<br>";
                if($(this).find("form_name")!=undefined && $(this).find("form_name").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>form_name :</span>"+$(this).find("form_name").text()+"<br>";
                if($(this).find("checksum")!=undefined && $(this).find("checksum").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>checksum :</span>"+$(this).find("checksum").text()+"<br>";
                if($(this).find("notes")!=undefined && $(this).find("notes").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>notes :</span>"+$(this).find("notes").text()+"<br>";
                if($(this).find("dept")!=undefined && $(this).find("dept").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>dept :</span>"+$(this).find("dept").text()+"<br>";
                if($(this).find("UploadFormId")!=undefined && $(this).find("UploadFormId").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>UploadFormId :</span>"+$(this).find("UploadFormId").text()+"<br>";
            });
            if (pathStr != "" && urlStr != "" && infocheck!=""){
                downloaddataset.push([url, path + name, size,count, averageSpeed,infocheckStr]);
            }
            else if (pathStr == "" && urlStr == "" && infocheck=="") {
                downloaddataset.push([name, size,count, averageSpeed]);
            }
            else if (pathStr != "" && urlStr == "" && infocheck=="") {
                downloaddataset.push([path + name, size,count, averageSpeed]);
            }
            else if (pathStr == "" && urlStr != "" && infocheck=="") {
                downloaddataset.push([url, name, size, count,averageSpeed]);
            }
            else if (pathStr == "" && urlStr == "" && infocheck!="") {
                downloaddataset.push([name, size,count, averageSpeed,infocheckStr]);
            }
            else if (pathStr != "" && urlStr != "" && infocheck=="") {
                downloaddataset.push([url,  path +name, size,count, averageSpeed]);
            }
            else if (pathStr == "" && urlStr != "" && infocheck!="") {
                downloaddataset.push([url, name, size,count, averageSpeed,infocheckStr]);
            }
            else if (pathStr != "" && urlStr == "" && infocheck!="") {
                downloaddataset.push([path +name, size,count, averageSpeed,infocheckStr]);
            }
        });

        $("#max-average-speed-upload").html(crushFTP.methods.formatBytes(maxAvgSpeedUpload) + "/sec");
        $("#min-average-speed-upload").html(crushFTP.methods.formatBytes(minAvgSpeedUpload) + "/sec");
        $("#largest-file-size-upload").html(crushFTP.methods.formatBytes(maxFileSizeUpload));
        $("#smallest-file-size-upload").html(crushFTP.methods.formatBytes(minFileSizeUpload));
        $("#total-file-size-upload").html(crushFTP.methods.formatBytes(TotalSizeUpload));
        $("#max-average-speed-download").html(crushFTP.methods.formatBytes(maxAvgSpeedDownload) + "/sec");
        $("#min-average-speed-download").html(crushFTP.methods.formatBytes(minAvgSpeedDownload) + "/sec");
        $("#largest-file-size-download").html(crushFTP.methods.formatBytes(maxFileSizeDownload));
        $("#smallest-file-size-download").html(crushFTP.methods.formatBytes(minFileSizeDownload));
        $("#total-file-size-download").html(crushFTP.methods.formatBytes(TotalSizeDownload));
        $("#max-count-file-name").html(maxCountFileNameDownload+" is Maximum time Download.");
        $("#max-count-of-file").html(maxCountFileDownload+" time(s)");
        $("#downloads_tbl").empty();
        $("#downloads_tbl").html(downloadtable);
        $("#uploadDownloadPie").show();
        $("#uploadDownloadPie_01").show();
        $('#uploadDownloadPie_01').sparkline([TotalSizeUpload, TotalSizeDownload], {
            sliceColors: ['#3384B8', '#EA5598'],
            type: 'pie',
            width: 135,
            height: 135,
            offset: -90,
            borderWidth: 2,
            borderColor: '#D1E0E0',
            tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}}</span>',
            tooltipValueLookups: {
                'offset': {
                    0: crushFTP.methods.formatBytes(TotalSizeUpload),
                    1: crushFTP.methods.formatBytes(TotalSizeDownload)
                }
            }
        });
        $("#UploadDataValue_ud").html("Upload");
        $("#DownloadDataValue_ud").html("Download");
        $("#uploadDownloadPie_title").html("Upload/Download");
        bindDataTableLazyLoadingGrid(downloaddataset, "downloads_tbl");
        if ((pathStr != "" && urlStr != "") ||  (urlStr != "" && infocheck!="") || (pathStr != ""  && infocheck!="")){
            setTimeout(function() {
                $(".dataTables_scrollHead").addClass("overflow-visible");
                $(".dataTables_scrollBody").addClass("overflow-visible");
                $(".dataTables_scroll").addClass("overflow-scroll");
            }, 1000);
        }
    }

    // SharesSummary Reports Bind from XML
    function sharesSummary(xml) {
        var pathStr = "";
        var urlStr = "";
        var infocheck="";
        if ($(parent.document).find("#reportConfigSharesSummary").find("#showPaths_1").is(":checked") || !isEmbed) {
            pathStr = "<th>Path</th>";
        }
        if ($(parent.document).find("#reportConfigSharesSummary").find("#showURLs_1").is(":checked") || !isEmbed) {
            urlStr = "<th>URL</th>";
        }
        if ($(parent.document).find("#reportConfigSharesSummary").find("#showFormInfo_1").is(":checked") || !isEmbed) {
            infocheck="<th>Form Info</th>";
        }
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "<th>Share Time</th>" +
            "<th>Size</th>" +
            "<th>Name</th>" + urlStr +infocheck+
            "</tr></thead><tbody>";
        var i = 1;
        var dataset = [];
        $(x).find("shares > shares_subitem").each(function() {
            var username = $(this).find("shares_subitem > username").text();
            var share_time = $(this).find("shares_subitem > share_time").text();
            var size = $(this).find("shares_subitem > size").text();
            size = crushFTP.methods.formatBytes(size);
            var name = $(this).find("shares_subitem > name").text();
            size = crushFTP.methods.formatBytes(size);
            var url = $(this).find("shares_subitem > url").text();
            var path = $(this).find("shares_subitem > path").text();
            var infocheckStr="";
            $(this).find("metaInfo").each(function() {
                if($(this).find("allowuploads")!=undefined && $(this).find("allowuploads").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>allowuploads :</span>"+$(this).find("allowuploads").text()+"<br>";
                if($(this).find("emailsubject")!=undefined && $(this).find("emailsubject").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>emailsubject :</span>"+$(this).find("emailsubject").text()+"<br>";
                if($(this).find("expire")!=undefined && $(this).find("expire").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>expire :</span>"+$(this).find("expire").text()+"<br>";
                if($(this).find("share_comments")!=undefined && $(this).find("share_comments").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>share_comments :</span>"+$(this).find("share_comments").text()+"<br>";
                if($(this).find("shareusername")!=undefined && $(this).find("shareusername").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>shareusername :</span>"+$(this).find("shareusername").text()+"<br>";
                if($(this).find("username")!=undefined && $(this).find("username").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>username :</span>"+$(this).find("username").text()+"<br>";
                if($(this).find("sendemail")!=undefined && $(this).find("sendemail").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>sendemail :</span>"+$(this).find("sendemail").text()+"<br>";
                if($(this).find("attach")!=undefined && $(this).find("attach").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>attach :</span>"+$(this).find("attach").text()+"<br>";
                if($(this).find("emailfrom")!=undefined && $(this).find("emailfrom").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>emailfrom :</span>"+$(this).find("emailfrom").text()+"<br>";
                if($(this).find("shareusernamepermissions")!=undefined && $(this).find("shareusernamepermissions").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>shareUsernamePermissions :</span>"+$(this).find("shareusernamepermissions").text()+"<br>";
                if($(this).find("password")!=undefined && $(this).find("password").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>password :</span>"+$(this).find("password").text()+"<br>";
                if($(this).find("emailto")!=undefined && $(this).find("emailto").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>emailto :</span>"+$(this).find("emailto").text()+"<br>";
                if($(this).find("web_link")!=undefined && $(this).find("web_link").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>web_link :</span>"+$(this).find("web_link").text()+"<br>";
                if($(this).find("web_link_end")!=undefined && $(this).find("web_link_end").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>web_link_end :</span>"+$(this).find("web_link_end").text()+"<br>";
                if($(this).find("publishtype")!=undefined && $(this).find("publishtype").text()!="")
                    infocheckStr+="<span style='font-weight: bold;'>publishtype :</span>"+$(this).find("publishtype").text()+"<br>";
            });

            if (pathStr != "" && urlStr != "" && infocheck!=""){
                dataset.push([username, share_time, size, path + name, url,infocheckStr]);
            }
            else if (pathStr == "" && urlStr == "" && infocheck=="") {
                dataset.push([username, share_time, size,name]);
            }
            else if (pathStr != "" && urlStr == "" && infocheck=="") {
                dataset.push([username, share_time, size, path + name]);
            }
            else if (pathStr == "" && urlStr != "" && infocheck=="") {
                dataset.push([username, share_time, size,name, url]);
            }
            else if (pathStr == "" && urlStr == "" && infocheck!="") {
                    dataset.push([username, share_time, size,name,infocheckStr]);
            }
            else if (pathStr != "" && urlStr != "" && infocheck=="") {
                    dataset.push([username, share_time, size, path + name, url]);
            }
            else if (pathStr == "" && urlStr != "" && infocheck!="") {
                    dataset.push([username, share_time, size,name, url,infocheckStr]);
            }
            else if (pathStr != "" && urlStr == "" && infocheck!="") {
                    dataset.push([username, share_time, size, path + name,infocheckStr]);
            }
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table");
        if ((pathStr != "" && urlStr != "") ||  (urlStr != "" && infocheck!="") || (pathStr != ""  && infocheck!="")){
            setTimeout(function() {
                $(".dataTables_scrollHead").addClass("overflow-visible");
                $(".dataTables_scrollBody").addClass("overflow-visible");
                $(".dataTables_scroll").addClass("overflow-scroll");
            }, 1000);
        }
    }

    // UploadDownloadSummary Reports Bind from XML
    function uploadDownloadSummary(xml) {
        var uploadChecked = false;
        var downloadChecked = false;
        var showfileChecked = false;
        var ipStr = "";
        var pathStr = "";
        var dateStr = "";
        var sizeStr = "";
        uploadChecked = $(parent.document).find("#reportConfigUploadDownloadSummary").find("#showUploads").is(":checked") || !isEmbed;
        downloadChecked = $(parent.document).find("#reportConfigUploadDownloadSummary").find("#showDownloads").is(":checked") || !isEmbed;
        showfileChecked = $(parent.document).find("#reportConfigUploadDownloadSummary").find("#showFiles_1").is(":checked") || !isEmbed;
        if (showfileChecked) {
            if ($(parent.document).find("#reportConfigUploadDownloadSummary").find("#showIPs_1").is(":checked") || !isEmbed)
                ipStr = "<th>IP</th>";
            if ($(parent.document).find("#reportConfigUploadDownloadSummary").find("#showDates").is(":checked") || !isEmbed)
                dateStr = "<th>Date</th>";
            if ($(parent.document).find("#reportConfigUploadDownloadSummary").find("#showSizes").is(":checked") || !isEmbed)
                sizeStr = "<th>Size</th>";
            if ($(parent.document).find("#reportConfigUploadDownloadSummary").find("#showPaths_2").is(":checked") || !isEmbed)
                pathStr = "<th>Path</th>";
        }
        var userwiseData=[];
        if (uploadChecked || downloadChecked) {
            var i;
            var x = xml.getElementsByTagName("results")[0];
            var usercount = $(x).find("results > userCount").text();
            var downloadcount = $(x).find("results > downloadCount").text();
            var uploadcount = $(x).find("results > uploadCount").text();
            var downloadbytes = $(x).find("results > downloadBytes").text();
            var uploadbytes = $(x).find("results > uploadBytes").text();
            var uploadbarchart = {};
            var downloadbarchart = {};
            downloadbytes = crushFTP.methods.formatBytes(downloadbytes) + " Total";
            uploadbytes = crushFTP.methods.formatBytes(uploadbytes) + " Total";
            var uploadTitle = "";
            if (uploadChecked)
                uploadTitle = "Upload: " + uploadcount + " uploads, " + uploadbytes + " | ";
            var downloadTitle = "";
            if (downloadChecked)
                downloadTitle = "Download : " + downloadcount + " downloads, " + downloadbytes;
            var uploaddownloadsummarytbl = "<thead><tr><th>User: " + usercount + " Users. | " + uploadTitle + downloadTitle + "</th></tr></tfoot><tbody>";
            var i = 0;
            var uploaddatasepair = {};
            var downloaddatasepair = {};
            $(x).find("summary > summary_subitem").each(function() {
                var username = $(this).find("summary_subitem > username").text();
                var useruploadcount = $(this).find("summary_subitem > uploadCount").text();
                var useruploadbytes = $(this).find("summary_subitem > uploadBytes").text();
                var useruploadbytes1=useruploadbytes;
                var userdownloadcount = $(this).find("summary_subitem > downloadCount").text();
                var userdownloadbytes = $(this).find("summary_subitem > downloadBytes").text();
                var userdownloadbytes1=userdownloadbytes;
                userdownloadbytes = crushFTP.methods.formatBytes(userdownloadbytes) + " Total";
                useruploadbytes = crushFTP.methods.formatBytes(useruploadbytes) + " Total";
                var useruploadxml = $(this).find("uploads > uploads_subitem");
                var useruploadtbl = "<table id='uploads_" + i + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                var j = 0;
                var uploaddatase = [];
                var minFileSizeUpload=0;
                var maxFileSizeUpload=0;
                var maxAvgSpeedUpload=0;
                var minAvgSpeedUpload=0;
                var checkFirst=0;
                if (uploadChecked) {
                    useruploadxml.each(function() {
                        if (j == 0)
                            useruploadtbl += "<thead><tr>" + dateStr + ipStr + pathStr + "<th>File</th>" + sizeStr + "<th>Speed</th></tr></thead><tbody>";
                        var dateofvalue = $(this).find('uploads_subitem > date:first').text();
                        var sizeoffile = $(this).find('uploads_subitem > size:first').text();
                        var ip = $(this).find('uploads_subitem > ip:first').text();
                        var path = crushFTP.methods.textEncode($(this).find('uploads_subitem > path:first').text());
                        var name = crushFTP.methods.textEncode($(this).find('uploads_subitem > name:first').text());
                        var speed = $(this).find('uploads_subitem > speed:first').text();
                        if(checkFirst==0)
                        {
                            maxFileSizeUpload=sizeoffile;
                            minFileSizeUpload=sizeoffile;
                            maxAvgSpeedUpload=speed;
                            minAvgSpeedUpload=speed;
                        }
                        else
                        {
                            if(parseInt(maxFileSizeUpload)<parseInt(sizeoffile))
                                maxFileSizeUpload=sizeoffile;
                            if(parseInt(minFileSizeUpload)>parseInt(sizeoffile))
                                minFileSizeUpload=sizeoffile;
                            if(parseInt(maxAvgSpeedUpload)<parseInt(speed))
                                maxAvgSpeedUpload=speed;
                            if(parseInt(minAvgSpeedUpload)>parseInt(speed))
                                minAvgSpeedUpload=speed;
                        }
                        checkFirst=1;
                        sizeoffile = crushFTP.methods.formatBytes(sizeoffile);
                        if (uploadbarchart["" + dateofvalue.split(" ")[0]])
                            uploadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(uploadbarchart["" + dateofvalue.split(" ")[0]]) + parseInt(sizeoffile);
                        else
                            uploadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(sizeoffile);

                        speed = crushFTP.methods.formatBytes(speed) + "/sec";
                        if (!showfileChecked)
                            uploaddatase.push([name, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([ip, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, ip, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, ip, path, name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, ip, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([ip, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([ip, path, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, path, name, , speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([path, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([ip, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        j = 1;
                    });
                }

                uploaddatasepair["uploads_" + i] = uploaddatase;
                var userdownloadxml = $(this).find("downloads > downloads_subitem");
                var userdownloadtbl = "<table id='download_" + i + "' class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                var maxFileSizeDownload=0;
                var minFileSizeDownload=0;
                var maxAvgSpeedDownload=0;
                var minAvgSpeedDownload=0;
                var checkFirst=0;
                var k = 0;
                var downloaddatase = [];
                if (downloadChecked) {
                    userdownloadxml.each(function() {
                        if (k == 0)
                            userdownloadtbl += "<thead><tr>" + dateStr + ipStr + pathStr + "<th>File</th>" + sizeStr + "<th>Speed</th></tr></thead><tbody>";
                        var dateofvalue = $(this).find('downloads_subitem > date:first').text();
                        var sizeoffile = $(this).find('downloads_subitem > size:first').text();
                        var ip = $(this).find('downloads_subitem > ip:first').text();
                        var path = crushFTP.methods.textEncode($(this).find('downloads_subitem > path:first').text());
                        var name = crushFTP.methods.textEncode($(this).find('downloads_subitem > name:first').text());
                        var speed = $(this).find('downloads_subitem > speed:first').text();
                        if(checkFirst==0)
                        {
                            maxFileSizeDownload=sizeoffile;
                            minFileSizeDownload=sizeoffile;
                            maxAvgSpeedDownload=speed;
                            minAvgSpeedDownload=speed;
                        }
                        else
                        {
                            if(parseInt(maxFileSizeDownload)<parseInt(sizeoffile))
                                maxFileSizeDownload=sizeoffile;
                            if(parseInt(minFileSizeDownload)>parseInt(sizeoffile))
                                minFileSizeDownload=sizeoffile;
                             if(parseInt(maxAvgSpeedDownload)<parseInt(speed))
                                maxAvgSpeedDownload=speed;
                            if(parseInt(minAvgSpeedDownload)>parseInt(speed))
                                minAvgSpeedDownload=speed;
                        }
                        checkFirst=1;
                        sizeoffile = crushFTP.methods.formatBytes(sizeoffile);
                        if (downloadbarchart["" + dateofvalue.split(" ")[0]])
                            downloadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(downloadbarchart["" + dateofvalue.split(" ")[0]]) + parseInt(sizeoffile);
                        else
                            downloadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(sizeoffile);
                        speed = crushFTP.methods.formatBytes(speed) + "/sec";
                        //downloaddatase.push([dateofvalue,ip,path,name,sizeoffile,speed]);
                        if (!showfileChecked)
                            downloaddatase.push([name, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([ip, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, ip, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, ip, path, name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, ip, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([ip, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([ip, path, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, path, name, , speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([path, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([ip, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);

                        k = 1;
                    });
                }
                // For Extra Details Like Max, Min size speed etc
                userwiseData.push([username,useruploadcount,useruploadbytes1,userdownloadcount,userdownloadbytes1,maxFileSizeUpload,minFileSizeUpload,maxAvgSpeedUpload,minAvgSpeedUpload,maxFileSizeDownload,minFileSizeDownload,maxAvgSpeedDownload,minAvgSpeedDownload]);

                downloaddatasepair["download_" + i] = downloaddatase;
                var uploadSubTitle = "";
                if (uploadChecked)
                    uploadSubTitle = "Uploads : " + useruploadcount + " uploads, " + useruploadbytes;
                var downloadSubTitle = "";
                if (downloadChecked)
                    downloadSubTitle = "Downloads : " + userdownloadcount + " downloads, " + userdownloadbytes;
                uploaddownloadsummarytbl += "<tr><td><div class='panel panel-default'><a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#" + i + "_table' aria-expanded='false' aria-controls='collapseTwo'><div class='panel-heading' role='tab' id='headingTwo'><h4 class='panel-title'>" + username + "</h4></div></a><div id='" + i + "_table' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='headingTwo'><div class='panel-body'><b>" + uploadSubTitle + "</b></br>" + useruploadtbl + "</table></br><b>" + downloadSubTitle + "</b></br>" + userdownloadtbl + "</table> </div></div></td></tr>";
                i++;
            });
            $("#upload-download-summary-table").empty();
            $("#upload-download-summary-table").html(uploaddownloadsummarytbl + "<tbody>");
            bindDataTableGrid("upload-download-summary-table");
            setTimeout(function() {
                if (uploadChecked) {
                    for (var item in uploaddatasepair) {
                        if (uploaddatasepair[item].length > 0)
                            bindDataTableLazyLoadingGrid(uploaddatasepair[item], item, 50);
                    }
                }
                if (downloadChecked) {
                    for (var item in downloaddatasepair) {
                        if (downloaddatasepair[item].length > 0)
                            bindDataTableLazyLoadingGrid(downloaddatasepair[item], item, 50);
                    }
                }
            }, 100);

            var values = [];
            var jsonarray = [];
            var thetitles = new Array();
            var download = 0;
            var upload = 0;
            var i = 0;
            for (var item in uploadbarchart) {
                values.push(uploadbarchart[item]);
                thetitles.push(item + " - " + crushFTP.methods.formatBytes(uploadbarchart[item]));
                upload += parseInt(uploadbarchart[item]);
                $("#BarChart_Data_01").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + item + '</text></svg>');
                i++;
            }
            var values_d = [];
            var jsonarray_d = [];
            var thetitles_d = new Array();
            var j = 0;
            //for(var i=0;i<30;i++){
            for (var item in downloadbarchart) {
                values_d.push(downloadbarchart[item]);
                thetitles_d.push(item + " - " + crushFTP.methods.formatBytes(downloadbarchart[item]));
                download += parseInt(downloadbarchart[item]);
                $("#BarChart_Data_02").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + item + '</text></svg>');
                j++;
            }
            //}

            if (values.length != 0) {
                $("#barMain_01").show();
                createBarchart(thetitles, values, "30", "BarChart_01");
                $("#BarChar_title_01").html("Upload Chart");
            }
            if (values_d.length != 0) {
                $("#barMain_02").show();
                createBarchart(thetitles_d, values_d, "30", "BarChart_02");
                $("#BarChar_title_02").html("Download Chart");
            }
            var uploaditle = "Upload : " + crushFTP.methods.formatBytes(upload);
            var downloadtitle = "Download : " + crushFTP.methods.formatBytes(download);

            if (uploadChecked && downloadChecked) {
                $("#pieMain_01").show();
                $('#pieChart_01').sparkline([upload, download], {
                    sliceColors: ['#6774BD', '#F3D478'],
                    type: 'pie',
                    width: 135,
                    height: 135,
                    offset: -90,
                    borderWidth: 2,
                    borderColor: '#D1E0E0',
                    tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}}</span>',
                    tooltipValueLookups: {
                        'offset': {
                            0: uploaditle,
                            1: downloadtitle
                        }
                    }
                });
            }
            $("#pieCharttitle_01").show();
            $("#UploadDataValue_01").html("Upload");
            $("#DownloadDataValue_01").html("Download");
             $("#UploadDataValue_01").siblings(".blockpio").css("background-color","#6774BD");
            $("#DownloadDataValue_01").siblings(".blockpio").css("background-color","#F3D478");
            $("#pieCharttitle_01_title").html("Upload/Download Total File Size");

            $(".upload-pie").show();
            $(".download-pie").show();
            // Set Extra Data like Speed, user , size etc...
            var userUploadCountvalues = [];
            var userUploadCountTitles = new Array();
            var userDownloadCountvalues = [];
            var userDownloadCountTitles = new Array();
            var userUploadSizevalues = [];
            var userUploadSizeTitles = new Array();
            var userDownloadSizevalues = [];
            var userDownloadSizeTitles = new Array();
            for (var i=0;i<userwiseData.length;i++) {
                var data=userwiseData[i];
                userUploadCountvalues.push(parseInt(data[1]));
                userUploadCountTitles.push(data[0] + " - " + data[1]+" uploads");
                userDownloadCountvalues.push(parseInt(data[3]));
                userDownloadCountTitles.push(data[0] + " - " + data[3]+" downloads.");
                userUploadSizevalues.push(parseInt(data[2]));
                userUploadSizeTitles.push(data[0] + " - " + crushFTP.methods.formatBytes(data[2])+" total size");
                userDownloadSizevalues.push(parseInt(data[4]));
                userDownloadSizeTitles.push(data[0] + " - " + crushFTP.methods.formatBytes(data[4])+" total size");
                $("#ud-summary-body .user-name-cls").html(data[0]);
                $("#ud-summary-body #useruploadcount-uds").html(data[1]+" uploads");
                $("#ud-summary-body #useruploadbytes1-ups").html(crushFTP.methods.formatBytes(data[2])+" total");
                $("#ud-summary-body #userdownloadcount-ups").html(data[3]+" downloads");
                $("#ud-summary-body #userdownloadbytes1-ups").html(crushFTP.methods.formatBytes(data[4])+" total");
                $("#ud-summary-body #largest-file-size-upload-uds").html(crushFTP.methods.formatBytes(data[5])+" is Largest File Size");
                $("#ud-summary-body #smallest-file-size-upload-uds").html(crushFTP.methods.formatBytes(data[6])+" is Smallest File Size");
                $("#ud-summary-body #max-average-speed-upload-uds").html(crushFTP.methods.formatBytes(data[7])+"/sec is Max Avg. Speed");
                $("#ud-summary-body #min-average-speed-upload-uds").html(crushFTP.methods.formatBytes(data[8])+"/sec is Min Avg. Speed");
                $("#ud-summary-body #largest-file-size-download-uds").html(crushFTP.methods.formatBytes(data[9])+" is Largest File Size");
                $("#ud-summary-body #smallest-file-size-download-uds").html(crushFTP.methods.formatBytes(data[10])+" is Smallest File Size");
                $("#ud-summary-body #max-average-speed-download-uds").html(crushFTP.methods.formatBytes(data[11])+"/sec is Max Avg. Speed");
                $("#ud-summary-body #min-average-speed-download-uds").html(crushFTP.methods.formatBytes(data[12])+"/sec is Min Avg. Speed");
                $(".upload-downloads-summary-extra table tbody:last") .after("<tbody>"+$("#ud-summary-body").html()+"</tbody>");
                $("#UserbarCountupload_val").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                $("#UserbarCountDownload_val").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                 $("#UserbarSizeupload_val").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                $("#UserbarSizeDownload_val").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
            }
            if (userUploadCountvalues.length != 0) {
                $("#UserbarCountupload").show();
                createBarchart(userUploadCountTitles, userUploadCountvalues, "30", "UserbarCountupload_ID");
                $("#UserbarCountupload_title").html("User Upload");            }
            if (userDownloadCountvalues.length != 0) {
                $("#UserbarCountDownload").show();
                createBarchart(userDownloadCountTitles, userDownloadCountvalues, "30", "UserbarCountDownload_ID");
                $("#UserbarCountDownload_title").html("User Download");            }
            if (userUploadSizevalues.length != 0) {
                $("#UserbarSizeupload").show();
                createBarchart(userUploadSizeTitles, userUploadSizevalues, "30", "UserbarSizeupload_ID");
                $("#UserbarSizeupload_title").html("User Upload");            }
            if (userDownloadSizevalues.length != 0) {
                $("#UserbarSizeDownload").show();
                createBarchart(userDownloadSizeTitles, userDownloadSizevalues, "30", "UserbarSizeDownload_ID");
                $("#UserbarSizeDownload_title").html("User Download");
            }
        } else {
            $("#upload-download-summary-table").empty();
            var notfoundtbl = "<thead><tr>" +
                "<th style='text-align:center;'>No Data found!</th>" +
                "</tr></thead><tbody>";
            $("#upload-download-summary-table").html(notfoundtbl + "<tbody>");
            $("#reports_summary_div").show();
            $("#report-parameters-panel").hide();
        }
    }

    // auditSummary Reports Bind from XML
    function auditSummary(xml) {
        var uploadIsCheck = false;
        var downloadIsCheck = false;
        var deleteIsCheck = false;
        var renameIsCheck = false;
        uploadIsCheck = $(parent.document).find("#reportConfigAuditSummary").find("#showUploads").is(":checked") || !isEmbed;
        downloadIsCheck = $(parent.document).find("#reportConfigAuditSummary").find("#showDownloads").is(":checked") || !isEmbed;
        deleteIsCheck = $(parent.document).find("#reportConfigAuditSummary").find("#showDeletes").is(":checked") || !isEmbed;
        renameIsCheck = $(parent.document).find("#reportConfigAuditSummary").find("#showRenames").is(":checked") || !isEmbed;
        var showfileIsChecked = false;
        showfileIsChecked = $(parent.document).find("#reportConfigAuditSummary").find("#showFiles_1").is(":checked") || !isEmbed;
        var ipStr = "";
        var dateStr = "";
        var sizeStr = "";
        var pathStr = "";
        if ($(parent.document).find("#reportConfigAuditSummary").find("#showIPs_1").is(":checked") || !isEmbed)
            ipStr = "<th>IP</th>";
        if ($(parent.document).find("#reportConfigAuditSummary").find("#showDates").is(":checked") || !isEmbed)
            dateStr = "<th>Date</th>";
        if ($(parent.document).find("#reportConfigAuditSummary").find("#showSizes").is(":checked") || !isEmbed)
            sizeStr = "<th>Size</th>";
        if ($(parent.document).find("#reportConfigAuditSummary").find("#showPaths_2").is(":checked") || !isEmbed)
            pathStr = "<th>Path</th>";
        var userUploadCountvalues = [];
        var userUploadCountTitles = new Array();
        var userDownloadCountvalues = [];
        var userDownloadCountTitles = new Array();
        var userUploadSizevalues = [];
        var userUploadSizeTitles = new Array();
        var userDownloadSizevalues = [];
        var userDownloadSizeTitles = new Array();
        var userDeleteCountvalues = [];
        var userDeleteCountTitles = new Array();
        var userDeleteSizevalues = [];
        var userDeleteSizeTitles = new Array();
        var userRenameCountvalues = [];
        var userRenameCountTitles = new Array();
        var userRenameSizevalues = [];
        var userRenameSizeTitles = new Array();
        var userwiseData=[];
        if (uploadIsCheck || downloadIsCheck || deleteIsCheck || renameIsCheck) {
            var x = xml.getElementsByTagName("results")[0];
            var usercount = $(x).find("results > userCount").text();
            var downloadcount = $(x).find("results > downloadCount").text();
            var uploadcount = $(x).find("results > uploadCount").text();
            var downloadbytes = $(x).find("results > downloadBytes").text();
            var uploadbytes = $(x).find("results > uploadBytes").text();
            var renamescount = $(x).find("results > renameCount").text();
            var deletebytes = $(x).find("results > deleteBytes").text();
            var deletecount = $(x).find("results > deleteCount").text();
            var uploadbarchart = {};
            var downloadbarchart = {};
            var deletebarchart = {};
            downloadbytes = crushFTP.methods.formatBytes(downloadbytes) + " Total";
            uploadbytes = crushFTP.methods.formatBytes(uploadbytes) + " Total";
            deletebytes = crushFTP.methods.formatBytes(deletebytes) + " Total";
            var uploadTitlestr = "";
            if (uploadIsCheck)
                uploadTitlestr = " | Upload: " + uploadcount + " uploads, " + uploadbytes;
            var downloadtitlestr = "";
            if (downloadIsCheck)
                downloadtitlestr = " | Download : " + downloadcount + " downloads, " + downloadbytes;
            var deleteTitlestr = "";
            if (deleteIsCheck)
                deleteTitlestr = " | Deletes : " + deletecount + " deletes, " + deletebytes;
            var renameTitlestr = "";
            if (renameIsCheck)
                renameTitlestr = " | Renames : " + renamescount + " renames.";

            var uploaddownloadsummarytbl = "<thead><tr><th>User: " + usercount + " Users. " + uploadTitlestr + downloadtitlestr + deleteTitlestr + renameTitlestr + "</th></tr></tfoot><tbody>";
            var i = 0;
            var uploaddatasepair = {};
            var downloaddatasepair = {};
            var deletedatasepair = {};
            var renamedatasepair = {};
            $(x).find("summary > summary_subitem").each(function() {
                var minFileSizeUpload=0;
                var maxFileSizeUpload=0;
                var maxAvgSpeedUpload=0;
                var minAvgSpeedUpload=0;
                var totalFileContUpload=0;
                var minFileSizeDownload=0;
                var maxFileSizeDownload=0;
                var maxAvgSpeedDownload=0;
                var minAvgSpeedDownload=0;
                var totalFileContDownload=0;
                var minFileSizeDelete=0;
                var maxFileSizeDelete=0;
                var maxAvgSpeedDelete=0;
                var minAvgSpeedDelete=0;
                var totalFileContDelete=0;
                var minFileSizeRename=0;
                var maxFileSizeRename=0;
                var maxAvgSpeedRename=0;
                var minAvgSpeedRename=0;
                var totalFileContRename=0;
                var checkFirst=0;
                var username = $(this).find("summary_subitem > username").text();
                var useruploadcount = $(this).find("summary_subitem > uploadCount").text();
                var useruploadbytes = $(this).find("summary_subitem > uploadBytes").text();
                var useruploadbytes1=useruploadbytes;
                var userdownloadcount = $(this).find("summary_subitem > downloadCount").text();
                var userdownloadbytes = $(this).find("summary_subitem > downloadBytes").text();
                var userdownloadbytes1 = userdownloadbytes;
                var userdeletecount = $(this).find("summary_subitem > deleteCount").text();
                var userdeletebytes = $(this).find("summary_subitem > deleteBytes").text();
                var userdeletebytes1 = userdeletebytes;
                var userrenamecount = $(this).find("summary_subitem > renameCount").text();
                userdownloadbytes = crushFTP.methods.formatBytes(userdownloadbytes) + " Total";
                useruploadbytes = crushFTP.methods.formatBytes(useruploadbytes) + " Total";
                userdeletebytes = crushFTP.methods.formatBytes(userdeletebytes) + " Total";
                var useruploadxml = $(this).find("uploads > uploads_subitem");
                var useruploadtbl = "<table id='uploads_" + i + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                var j = 0;
                var uploaddatase = [];
                useruploadxml.each(function() {
                    if (uploadIsCheck) {
                        if (j == 0)
                            useruploadtbl += "<thead><tr>" + dateStr + ipStr + pathStr + "<th>File</th>" + sizeStr + "<th>Speed</th></tr></thead><tbody>";
                        var dateofvalue = $(this).find('uploads_subitem > date:first').text();
                        var sizeoffile = $(this).find('uploads_subitem > size:first').text();
                        var speed = $(this).find('uploads_subitem > speed:first').text();

                        if(checkFirst==0)
                        {
                            maxFileSizeUpload=sizeoffile;
                            minFileSizeUpload=sizeoffile;
                            maxAvgSpeedUpload=speed;
                            minAvgSpeedUpload=speed;
                        }
                        else
                        {
                            if(parseInt(maxFileSizeUpload)<parseInt(sizeoffile))
                                maxFileSizeUpload=sizeoffile;
                            if(parseInt(minFileSizeUpload)>parseInt(sizeoffile))
                                minFileSizeUpload=sizeoffile;
                            if(parseInt(maxAvgSpeedUpload)<parseInt(speed))
                                maxAvgSpeedUpload=speed;
                            if(parseInt(minAvgSpeedUpload)>parseInt(speed))
                                minAvgSpeedUpload=speed;
                        }
                        checkFirst=1;
                        sizeoffile = crushFTP.methods.formatBytes(sizeoffile);
                        if (uploadbarchart["" + dateofvalue.split(" ")[0]])
                            uploadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(uploadbarchart["" + dateofvalue.split(" ")[0]]) + parseInt(sizeoffile);
                        else
                            uploadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(sizeoffile);
                        var ip = $(this).find('uploads_subitem > ip:first').text();
                        var path = $(this).find('uploads_subitem > path:first').text();
                        var name = $(this).find('uploads_subitem > name:first').text();
                        speed = crushFTP.methods.formatBytes(speed) + "/sec";
                        //uploaddatase.push([dateofvalue,ip,path,name,sizeoffile,speed]);
                        if (!showfileIsChecked)
                            uploaddatase.push([name, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([ip, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, ip, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, ip, path, name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            uploaddatase.push([path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([dateofvalue, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, ip, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([ip, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([ip, path, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, path, name, , speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            uploaddatase.push([name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            uploaddatase.push([path, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([ip, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            uploaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                    }
                    j = 1;
                });
                uploaddatasepair["uploads_" + i] = uploaddatase;
                var userdownloadxml = $(this).find("downloads > downloads_subitem");
                var userdownloadtbl = "<table id='download_" + i + "' class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                var k = 0;
                var downloaddatase = [];
                checkFirst=0;
                userdownloadxml.each(function() {
                    if (downloadIsCheck) {
                        if (k == 0)
                            userdownloadtbl += "<thead><tr>" + dateStr + ipStr + pathStr + "<th>File</th>" + sizeStr + "<th>Speed</th></tr></thead><tbody>";
                        var dateofvalue = $(this).find('downloads_subitem > date:first').text();
                        var sizeoffile = $(this).find('downloads_subitem > size:first').text();
                        var speed = $(this).find('downloads_subitem > speed:first').text();
                        if(checkFirst==0)
                        {
                            maxFileSizeDownload=sizeoffile;
                            minFileSizeDownload=sizeoffile;
                            maxAvgSpeedDownload=speed;
                            minAvgSpeedDownload=speed;
                        }
                        else
                        {
                            if(parseInt(maxFileSizeDownload)<parseInt(sizeoffile))
                                maxFileSizeDownload=sizeoffile;
                            if(parseInt(minFileSizeDownload)>parseInt(sizeoffile))
                                minFileSizeDownload=sizeoffile;
                            if(parseInt(maxAvgSpeedDownload)<parseInt(speed))
                                maxAvgSpeedDownload=speed;
                            if(parseInt(minAvgSpeedDownload)>parseInt(speed))
                                minAvgSpeedDownload=speed;
                        }
                        checkFirst=1;
                        sizeoffile = crushFTP.methods.formatBytes(sizeoffile);
                        if (downloadbarchart["" + dateofvalue.split(" ")[0]])
                            downloadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(downloadbarchart["" + dateofvalue.split(" ")[0]]) + parseInt(sizeoffile);
                        else
                            downloadbarchart["" + dateofvalue.split(" ")[0]] = parseInt(sizeoffile);
                        var ip = $(this).find('downloads_subitem > ip:first').text();
                        var path = $(this).find('downloads_subitem > path:first').text();
                        var name = $(this).find('downloads_subitem > name:first').text();
                        speed = crushFTP.methods.formatBytes(speed) + "/sec";
                        //downloaddatase.push([dateofvalue,ip,path,name,sizeoffile,speed]);
                        if (!showfileIsChecked)
                            downloaddatase.push([name, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([ip, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, ip, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, ip, path, name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            downloaddatase.push([path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([dateofvalue, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, ip, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([ip, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([ip, path, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, path, name, , speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            downloaddatase.push([name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            downloaddatase.push([path, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([ip, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            downloaddatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                    }
                    k = 1;
                });
                downloaddatasepair["download_" + i] = downloaddatase;
                var userdeleteloadxml = $(this).find("deletes > deletes_subitem");
                var userdeleteloadtbl = "<table id='deletes_" + i + "' class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                var k = 0;
                var deletedatase = [];
                checkFirst=0;
                userdeleteloadxml.each(function() {
                    if (deleteIsCheck) {
                        if (k == 0)
                            userdeleteloadtbl += "<thead><tr>" + dateStr + ipStr + pathStr + "<th>File</th>" + sizeStr + "<th>Speed</th></tr></thead><tbody>";
                        var dateofvalue = $(this).find('deletes_subitem > date:first').text();
                        var sizeoffile = $(this).find('deletes_subitem > size:first').text();
                        var speed = $(this).find('deletes_subitem > speed:first').text();

                        if(checkFirst==0)
                        {
                            maxFileSizeDelete=sizeoffile;
                            minFileSizeDelete=sizeoffile;
                            maxAvgSpeedDelete=speed;
                            minAvgSpeedDelete=speed;
                        }
                        else
                        {
                            if(parseInt(maxFileSizeDelete)<parseInt(sizeoffile))
                                maxFileSizeDelete=sizeoffile;
                            if(parseInt(minFileSizeDelete)>parseInt(sizeoffile))
                                minFileSizeDelete=sizeoffile;
                            if(parseInt(maxAvgSpeedDelete)<parseInt(speed))
                                maxAvgSpeedDelete=speed;
                            if(parseInt(minAvgSpeedDelete)>parseInt(speed))
                                minAvgSpeedDelete=speed;
                        }
                        checkFirst=1;

                        sizeoffile = crushFTP.methods.formatBytes(sizeoffile);
                        if (deletebarchart["" + dateofvalue.split(" ")[0]])
                            deletebarchart["" + dateofvalue.split(" ")[0]] = parseInt(deletebarchart["" + dateofvalue.split(" ")[0]]) + parseInt(sizeoffile);
                        else
                            deletebarchart["" + dateofvalue.split(" ")[0]] = parseInt(sizeoffile);

                        var ip = $(this).find('deletes_subitem > ip:first').text();
                        var path = $(this).find('deletes_subitem > path:first').text();
                        var name = $(this).find('deletes_subitem > name:first').text();

                        speed = crushFTP.methods.formatBytes(speed) + "/sec";
                        //deletedatase.push([dateofvalue,ip,path,name,sizeoffile,speed]);
                        if (!showfileIsChecked)
                            deletedatase.push([name, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            deletedatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            deletedatase.push([ip, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            deletedatase.push([dateofvalue, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            deletedatase.push([dateofvalue, ip, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            deletedatase.push([dateofvalue, ip, path, name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            deletedatase.push([path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            deletedatase.push([dateofvalue, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            deletedatase.push([dateofvalue, ip, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            deletedatase.push([ip, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            deletedatase.push([ip, path, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            deletedatase.push([dateofvalue, path, name, , speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            deletedatase.push([name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            deletedatase.push([name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            deletedatase.push([path, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            deletedatase.push([ip, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            deletedatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        k = 1;
                    }
                });
                deletedatasepair["deletes_" + i] = deletedatase;
                var userrenameloadxml = $(this).find("renames > renames_subitem");
                var userrenameloadtbl = "<table id='rename_" + i + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                var k = 0;
                var renamedatase = [];
                userrenameloadxml.each(function() {
                    if (renameIsCheck) {
                        if (k == 0)
                            userrenameloadtbl += "<thead><tr>" + dateStr + ipStr + pathStr + "<th>File</th>" + sizeStr + "<th>Speed</th></tr></thead><tbody>";
                        var dateofvalue = $(this).find('renames_subitem > date:first').text();
                        var ip = $(this).find('renames_subitem > ip:first').text();
                        var path = $(this).find('renames_subitem > path:first').text();
                        var name = $(this).find('renames_subitem > name:first').text();
                        var sizeoffile = $(this).find('renames_subitem > size:first').text();
                        var speed = $(this).find('renames_subitem > speed:first').text();

                        if(checkFirst==0)
                        {
                            maxFileSizeRename=sizeoffile;
                            minFileSizeRename=sizeoffile;
                            maxAvgSpeedRename=speed;
                            minAvgSpeedRename=speed;
                        }
                        else
                        {
                            if(parseInt(maxFileSizeRename)<parseInt(sizeoffile))
                                maxFileSizeRename=sizeoffile;
                            if(parseInt(minFileSizeRename)>parseInt(sizeoffile))
                                minFileSizeRename=sizeoffile;
                            if(parseInt(maxAvgSpeedRename)<parseInt(speed))
                                maxAvgSpeedRename=speed;
                            if(parseInt(minAvgSpeedRename)>parseInt(speed))
                                minAvgSpeedRename=speed;
                        }
                        checkFirst=1;

                        sizeoffile = crushFTP.methods.formatBytes(sizeoffile);

                        speed = crushFTP.methods.formatBytes(speed) + "/sec";
                        //renamedatase.push([date,ip,path,name,size,speed]);
                        if (!showfileIsChecked)
                            renamedatase.push([name, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            renamedatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile != "")
                            renamedatase.push([ip, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            renamedatase.push([dateofvalue, path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            renamedatase.push([dateofvalue, ip, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            renamedatase.push([dateofvalue, ip, path, name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile != "")
                            renamedatase.push([path, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            renamedatase.push([dateofvalue, name, sizeoffile, speed]);
                        else if (dateStr != "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            renamedatase.push([dateofvalue, ip, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile != "")
                            renamedatase.push([ip, name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr != "" && sizeoffile == "")
                            renamedatase.push([ip, path, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            renamedatase.push([dateofvalue, path, name, , speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            renamedatase.push([name, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr == "" && sizeoffile != "")
                            renamedatase.push([name, sizeoffile, speed]);
                        else if (dateStr == "" && ipStr == "" && pathStr != "" && sizeoffile == "")
                            renamedatase.push([path, name, speed]);
                        else if (dateStr == "" && ipStr != "" && pathStr == "" && sizeoffile == "")
                            renamedatase.push([ip, name, speed]);
                        else if (dateStr != "" && ipStr == "" && pathStr == "" && sizeoffile == "")
                            renamedatase.push([dateofvalue, ip, path, name, sizeoffile, speed]);
                        k = 1;
                    }
                });

                userwiseData.push([username,useruploadcount,useruploadbytes1,userdownloadcount,userdownloadbytes1,maxFileSizeUpload,minFileSizeUpload,maxAvgSpeedUpload,minAvgSpeedUpload,maxFileSizeDownload,minFileSizeDownload,maxAvgSpeedDownload,minAvgSpeedDownload,userdeletecount,userdeletebytes1,userrenamecount]);

                renamedatasepair["rename_" + i] = renamedatase;

                var uploadSubTitle = "";
                if (uploadIsCheck)
                    uploadSubTitle = "Uploads : " + useruploadcount + " uploads, " + useruploadbytes;

                var downloadSubTitle = "";
                if (downloadIsCheck)
                    downloadSubTitle = "Downloads : " + userdownloadcount + " downloads, " + userdownloadbytes;

                var deleteSubTitle = "";
                if (deleteIsCheck)
                    deleteSubTitle = "Deletes : " + userdeletebytes;

                var renameSubTitle = "";
                if (renameIsCheck)
                    renameSubTitle = "Renames : " + userrenamecount + " renames.";

                var uploadIsCheckStr = "";
                if (uploadIsCheck)
                    uploadIsCheckStr = "</br>" + useruploadtbl + "</table><hr/>";
                var downloadIsCheckStr = "";
                if (downloadIsCheck)
                    downloadIsCheckStr = "</br>" + userdownloadtbl + "</table><hr/>";
                var deleteIsCheckStr = "";
                if (deleteIsCheck)
                    deleteIsCheckStr = "</br>" + userdeleteloadtbl + "</table><hr/>";
                var renameIsCheckStr = "";
                if (renameIsCheck)
                    renameIsCheckStr = "</br>" + userrenameloadtbl + "</table>";

                uploaddownloadsummarytbl += "<tr><td><div class='panel panel-default'><a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#" + i + "_table' aria-expanded='false' aria-controls='collapseTwo'><div class='panel-heading' role='tab' id='headingTwo'><h4 class='panel-title'>" + username + "</h4></div></a><div id='" + i + "_table' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='headingTwo'><div class='panel-body'><b>" + uploadSubTitle + "</b>" + uploadIsCheckStr + "</br><b>" + downloadSubTitle + "</b>" + downloadIsCheckStr + "</br><b>" + deleteSubTitle + "</b>" + deleteIsCheckStr + "</br><b>" + renameSubTitle + "</b>" + renameIsCheckStr + "</div></div></td></tr>";
                i++;
            });

            $("#upload-download-summary-table").empty();
            $("#upload-download-summary-table").html(uploaddownloadsummarytbl + "<tbody>");


            for (var i=0;i<userwiseData.length;i++) {

                var data=userwiseData[i];

                userUploadCountvalues.push(parseInt(data[1]));
                userUploadCountTitles.push(data[0] + " - " + data[1]+" uploads");

                userDownloadCountvalues.push(parseInt(data[3]));
                userDownloadCountTitles.push(data[0] + " - " + data[3]+" downloads.");

                userUploadSizevalues.push(parseInt(data[2]));
                userUploadSizeTitles.push(data[0] + " - " + crushFTP.methods.formatBytes(data[2])+" total size");

                userDownloadSizevalues.push(parseInt(data[4]));
                userDownloadSizeTitles.push(data[0] + " - " + crushFTP.methods.formatBytes(data[4])+" total size");

                userDeleteSizevalues.push(parseInt(data[14]));
                userDeleteSizeTitles.push(data[0] + " - " + crushFTP.methods.formatBytes(data[14])+" total size");

                userDeleteCountvalues.push(parseInt(data[13]));
                userDeleteCountTitles.push(data[0] + " - " + data[13]+" downloads.");

                userRenameCountvalues.push(parseInt(data[15]));
                userRenameCountTitles.push(data[0] + " - " + data[15]+" downloads.");

                $("#audit-summary-body .user-name-cls").html(data[0]);
                $("#audit-summary-body #useruploadcount-audit").html(data[1]+" uploads");
                $("#audit-summary-body #useruploadbytes1-audit").html(crushFTP.methods.formatBytes(data[2])+" total");
                $("#audit-summary-body #userdownloadcount-audit").html(data[3]+" downloads");
                $("#audit-summary-body #userdownloadbytes1-audit").html(crushFTP.methods.formatBytes(data[4])+" total");

                $("#audit-summary-body #largest-file-size-upload-audit").html(crushFTP.methods.formatBytes(data[5])+" is Largest File Size");
                $("#audit-summary-body #smallest-file-size-upload-audit").html(crushFTP.methods.formatBytes(data[6])+" is Smallest File Size");
                $("#useruploadcount-audit").html(data[1]+" upload");
                $("#userdownloadcount-audit").html(data[3]+" download");
                $("#userDeletecount-audit").html(data[13]+" delete");
                $("#userRenamecount-audit").html(data[15]+" rename");
                $("#useruploadbytes1-audit").html(crushFTP.methods.formatBytes(data[2])+" total");
                $("#userdownloadbytes1-audit").html(crushFTP.methods.formatBytes(data[4])+" total");
                $("#userDeletebytes1-audit").html(crushFTP.methods.formatBytes(data[14])+" total");
                $("#userRenamebytes1-audit").html(crushFTP.methods.formatBytes(10000000)+" total");
                $("#audit-summary-body #max-average-speed-upload-audit").html(crushFTP.methods.formatBytes(data[7])+"/sec is Max Avg. Speed");
                $("#audit-summary-body #min-average-speed-upload-audit").html(crushFTP.methods.formatBytes(data[8])+"/sec is Min Avg. Speed");
                $("#audit-summary-body #largest-file-size-download-audit").html(crushFTP.methods.formatBytes(data[9])+" is Largest File Size");
                $("#audit-summary-body #smallest-file-size-download-audit").html(crushFTP.methods.formatBytes(data[10])+" is Smallest File Size");
                $("#audit-summary-body #max-average-speed-download-audit").html(crushFTP.methods.formatBytes(data[11])+"/sec is Max Avg. Speed");
                $("#audit-summary-body #min-average-speed-download-audit").html(crushFTP.methods.formatBytes(data[12])+"/sec is Min Avg. Speed");
                $(".audit-summary-extra table tbody:last") .after("<tbody>"+$("#audit-summary-body").html()+"</tbody>");

                $("#UserbarCountupload_val_auditsummary").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                $("#UserbarCountDownload_val_auditsummary").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                 $("#UserbarSizeupload_val_auditsummary").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                $("#UserbarSizeDownload_val_auditsummary").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                $("#UserbarCountDelete_val_auditsummary").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                $("#UserbarCountRename_val_auditsummary").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
                 $("#UserbarSizeDelete_val_auditsummary").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + data[0] + '</text></svg>');
            }
            if (userUploadCountvalues.length != 0) {
                $("#UserbarCountupload_auditsummary").show();
                createBarchart(userUploadCountTitles, userUploadCountvalues, "30", "UserbarCountupload_ID_auditsummary");
                $("#UserbarCountupload_title_auditsummary").html("User Upload");
            }
            if (userDownloadCountvalues.length != 0) {
                $("#UserbarCountDownload_auditsummary").show();
                createBarchart(userDownloadCountTitles, userDownloadCountvalues, "30", "UserbarCountDownload_ID_auditsummary");
                $("#UserbarCountDownload_title_auditsummary").html("User Download");
            }
            if (userRenameCountvalues.length != 0) {
                $("#UserbarCountRename_auditsummary").show();
                createBarchart(userRenameCountTitles, userRenameCountvalues, "30", "UserbarCountRename_ID_auditsummary");
                $("#UserbarCountRename_title_auditsummary").html("User Rename Files");
            }
            if (userDeleteCountvalues.length != 0) {
                $("#UserbarCountDelete_auditsummary").show();
            createBarchart(userDeleteCountTitles, userDeleteCountvalues, "30", "UserbarCountDelete_ID_auditsummary");
                $("#UserbarCountDelete_title_auditsummary").html("User Delete Files");
            }
            if (userUploadSizevalues.length != 0) {
                $("#UserbarSizeupload_auditsummary").show();
                createBarchart(userUploadSizeTitles, userUploadSizevalues, "30", "UserbarSizeupload_ID_auditsummary");
                $("#UserbarSizeupload_title_auditsummary").html("User Upload File Size");
            }
            if (userDownloadSizevalues.length != 0) {
                $("#UserbarSizeDownload_auditsummary").show();
                createBarchart(userDownloadSizeTitles, userDownloadSizevalues, "30", "UserbarSizeDownload_ID_auditsummary");
                $("#UserbarSizeDownload_title_auditsummary").html("User Download File Size");
            }
            if (userDeleteSizevalues.length != 0) {
                $("#UserbarSizeDelete_auditsummary").show();
                createBarchart(userDeleteSizeTitles, userDeleteSizevalues, "30", "UserbarSizeDelete_ID_auditsummary");
                $("#UserbarSizeDelete_title_auditsummary").html("User Total Size Delete");
            }
            //bindDatatableNoExport("download-table");
            bindDataTableGrid("upload-download-summary-table");
            setTimeout(function() {
                if (uploadIsCheck) {
                    for (var item in uploaddatasepair) {
                        if (uploaddatasepair[item].length > 0)
                            bindDataTableLazyLoadingGrid(uploaddatasepair[item], item, 50);
                    }
                }
                if (downloadIsCheck) {
                    for (var item in downloaddatasepair) {
                        if (downloaddatasepair[item].length > 0)
                            bindDataTableLazyLoadingGrid(downloaddatasepair[item], item, 50);
                    }
                }
                if (deleteIsCheck) {
                    for (var item in deletedatasepair) {
                        if (deletedatasepair[item].length > 0)
                            bindDataTableLazyLoadingGrid(deletedatasepair[item], item, 50);
                    }
                }
                if (renameIsCheck) {
                    for (var item in renamedatasepair) {
                        if (renamedatasepair[item].length > 0)
                            bindDataTableLazyLoadingGrid(renamedatasepair[item], item, 50);
                    }
                }
            }, 100);
            var values = [];
            var thetitles = new Array();
            var download = 0;
            var upload = 0;
            var delete_ = 0;
            var i = 0;
            for (var item in uploadbarchart) {
                values.push(uploadbarchart[item]);
                thetitles.push(item + " - " + crushFTP.methods.formatBytes(uploadbarchart[item]));
                upload += parseInt(uploadbarchart[item]);
                $("#BarChart_Data_01").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + item + '</text></svg>');
                i++;
            }
            var values_d = [];
            var thetitles_d = new Array();
            var j = 0;

            for (var item in downloadbarchart) {
                values_d.push(downloadbarchart[item]);
                thetitles_d.push(item + " - " + crushFTP.methods.formatBytes(downloadbarchart[item]));
                download += parseInt(downloadbarchart[item]);
                    $("#BarChart_Data_02").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + item + '</text></svg>');
                j++;
            }
            var values_dlt = [];
            var thetitles_dlt = new Array();
            var k = 0;
            for (var item in deletebarchart) {
                values_dlt.push(deletebarchart[item]);
                thetitles_dlt.push(item + " - " + crushFTP.methods.formatBytes(deletebarchart[item]));
                delete_ += parseInt(deletebarchart[item]);
                $("#BarChart_Data_03").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + item + '</text></svg>');
                k++;
            }
            if (values.length != 0) {
                $("#barMain_01").show();
                createBarchart(thetitles, values, "30", "BarChart_01");
                $("#BarChar_title_01").html("Upload Chart");
            }
            if (values_d.length != 0) {
                $("#barMain_02").show();
                createBarchart(thetitles_d, values_d, "30", "BarChart_02");
                $("#BarChar_title_02").html("Download Chart");
            }
            if (values_dlt.length != 0) {
                $("#barMain_03").show();
                createBarchart(thetitles_dlt, values_dlt, "30", "BarChart_03");
                $("#BarChar_title_03").html("Delete Chart");
            }
            var uploaditle = "Upload : " + crushFTP.methods.formatBytes(upload);
            var downloadtitle = "Download : " + crushFTP.methods.formatBytes(download);
            var deletetitle = "Delete : " + crushFTP.methods.formatBytes(delete_);
            if (uploadIsCheck && downloadIsCheck && deleteIsCheck) {
                $("#pieMain_01").show();
                $('#pieChart_01').sparkline([upload, download, delete_], {
                    sliceColors: ['#6774BD', '#F3D478','#41BD9D'],
                    type: 'pie',
                    width: 135,
                    height: 135,
                    offset: -90,
                    borderWidth: 2,
                    borderColor: '#D1E0E0',
                    tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}}</span>',
                    tooltipValueLookups: {
                        'offset': {
                            0: uploaditle,
                            1: downloadtitle,
                            2: deletetitle
                        }
                    }
                });
            }
            $("#pieCharttitle_01").show();
            $("#UploadDataValue_01").html("Upload");

            $("#UploadDataValue_01").siblings(".blockpio").css("background-color","#6774BD");
            $("#DownloadDataValue_01").siblings(".blockpio").css("background-color","#F3D478");
            $("#DeleteDataValue_01").siblings(".blockpio").css("background-color","#41BD9D");
            $("#pieCharttitle_01_title").html("Upload/Download/Delete size");

            $("#DownloadDataValue_01").html("Download");
            $("#DeleteDataValue_01").html("Delete");
            $(".upload-pie").show();
            $(".download-pie").show();
            $(".delete-pie").show();
        }
    }

    // UploadDownloadRatios Reports Bind from XML
    function uploadDownloadRatios(xml) {
        var bytesCheck = "";
        var countCheck = "";

        if ($(parent.document).find("#reportConfigUploadDownloadRatios").find("#showBytes").is(":checked") || !isEmbed)
            bytesCheck = "<th>Upload Bytes</th><th>Download Bytes</th>";

        if ($(parent.document).find("#reportConfigUploadDownloadRatios").find("#showCounts_1").is(":checked") || !isEmbed)
            countCheck = "<th>Upload Count</th><th>Download Count</th>";

        var userUploadCountvalues = [];
        var userUploadCountTitles = new Array();
        var userDownloadCountvalues = [];
        var userDownloadCountTitles = new Array();

        var userUploadSizevalues = [];
        var userUploadSizeTitles = new Array();
        var userDownloadSizevalues = [];
        var userDownloadSizeTitles = new Array();

        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploaddownloadsummarytbl = "<thead><tr><th>Username</th>" + countCheck + bytesCheck + "</tr></thead><tbody>";
        var uplddownldratios = {};
        var dataset = [];
        var userwiseData=[];

        $(x).find("ratios > ratios_subitem").each(function() {
            var useruploadcount = $(this).find("ratios_subitem > uploadCount").text();
            var userdownloadcount = $(this).find("ratios_subitem > downloadCount").text();
            var userdownloadbytes = $(this).find("ratios_subitem > downloadBytes").text();
            var useruploadbytes = $(this).find("ratios_subitem > uploadBytes").text();
            var username = $(this).find("ratios_subitem > username").text();

            uplddownldratios[username] = {
                "useruploadcount": useruploadcount,
                "uploadcountper": uploadcountper,
                "userdownloadcount": userdownloadcount,
                "useruploadbytes": useruploadbytes,
                "uploadbytesper": uploadbytesper,
                "userdownloadbytes": userdownloadbytes,
                "downloadbytesper": downloadbytesper
            };
            var totalCount = parseInt(useruploadcount) + parseInt(userdownloadcount);
            var totalBytes = parseInt(useruploadbytes) + parseInt(userdownloadbytes);
            var uploadcountper = ((useruploadcount * 100) / totalCount).toFixed(1);
            var downloadcountper = ((userdownloadcount * 100) / totalCount).toFixed(1);
            var uploadbytesper = ((useruploadbytes * 100) / totalBytes).toFixed(1);
            var downloadbytesper = ((userdownloadbytes * 100) / totalBytes).toFixed(1);
            userdownloadbytes = crushFTP.methods.formatBytes(userdownloadbytes);
            useruploadbytes = crushFTP.methods.formatBytes(useruploadbytes);

            if (bytesCheck != "" && countCheck != "") {
                dataset.push([username,
                    useruploadcount + "<br/> " + uploadcountper + "% Upload",
                    userdownloadcount + "</br>" + downloadcountper + "% download",
                    useruploadbytes + "</br>" + uploadbytesper + "% Upload",
                    userdownloadbytes + "</br>" + downloadbytesper + "% download"
                ]);
            } else if (bytesCheck != "" && countCheck == "") {
                dataset.push([username,
                    useruploadbytes + "</br>" + uploadbytesper + "% Upload",
                    userdownloadbytes + "</br>" + downloadbytesper + "% download"
                ]);
            } else if (bytesCheck == "" && countCheck != "") {
                dataset.push([username,
                    useruploadcount + "<br/> " + uploadcountper + "% Upload",
                    userdownloadcount + "</br>" + downloadcountper + "% download"
                ]);
            } else if (bytesCheck == "" && countCheck == "")
                dataset.push([username]);
            i++;

            $("#UserbarCountupload_val_UpDwRt").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username+ '</text></svg>');

            $("#UserbarCountDownload_val_UpDwRt").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');

             $("#UserbarSizeupload_val_UpDwRt").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');

            $("#UserbarSizeDownload_val_UpDwRt").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploaddownloadsummarytbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table", 100);
        var uploadcountratios = 0;
        var downloadcountratios = 0;
        var uploadbyteratios = 0;
        var downloadbyteratios = 0;
        var j = 0;
        for (var item in uplddownldratios) {
            uploadcountratios += parseInt(uplddownldratios[item].useruploadcount);
            downloadcountratios += parseInt(uplddownldratios[item].userdownloadcount);
            uploadbyteratios += parseInt(uplddownldratios[item].useruploadbytes);
            downloadbyteratios += parseInt(uplddownldratios[item].userdownloadbytes);
            var username=item;
            userUploadCountvalues.push(parseInt(uplddownldratios[item].useruploadcount));
            userUploadCountTitles.push(username + " - " + uplddownldratios[item].useruploadcount+" uploads");

            userDownloadCountvalues.push(parseInt(uplddownldratios[item].userdownloadcount));
            userDownloadCountTitles.push(username + " - " + uplddownldratios[item].userdownloadcount+" downloads.");

            userUploadSizevalues.push(parseInt(uplddownldratios[item].useruploadbytes));
            userUploadSizeTitles.push(username + " - " + crushFTP.methods.formatBytes(uplddownldratios[item].useruploadbytes)+" total size");

            userDownloadSizevalues.push(parseInt(uplddownldratios[item].userdownloadbytes));
            userDownloadSizeTitles.push(username + " - " + crushFTP.methods.formatBytes(uplddownldratios[item].userdownloadbytes)+" total size");
        }

        if (userUploadCountvalues.length != 0) {
            $("#UserbarCountupload_UpDwRt").show();
            createBarchart(userUploadCountTitles, userUploadCountvalues, "30", "UserbarCountupload_ID_UpDwRt");
            $("#UserbarCountupload_title_UpDwRt").html("User Upload Files");
        }
        if (userDownloadCountvalues.length != 0) {
            $("#UserbarCountDownload_UpDwRt").show();
            createBarchart(userDownloadCountTitles, userDownloadCountvalues, "30", "UserbarCountDownload_ID_UpDwRt");
            $("#UserbarCountDownload_title_UpDwRt").html("User Download Files");
        }
        if (userUploadSizevalues.length != 0) {
            $("#UserbarSizeupload_UpDwRt").show();
            createBarchart(userUploadSizeTitles, userUploadSizevalues, "30", "UserbarSizeupload_ID_UpDwRt");
            $("#UserbarSizeupload_title_UpDwRt").html("User Upload File Size");
        }
        if (userDownloadSizevalues.length != 0) {
            $("#UserbarSizeDownload_UpDwRt").show();
            createBarchart(userDownloadSizeTitles, userDownloadSizevalues, "30", "UserbarSizeDownload_ID_UpDwRt");
            $("#UserbarSizeDownload_title_UpDwRt").html("User Download File Size");
        }



        var totalUDCount = parseInt(uploadcountratios) + parseInt(downloadcountratios);
        var uploadcountratiosper = ((uploadcountratios * 100) / totalUDCount).toFixed(0);
        var downloadcountratiosper = ((downloadcountratios * 100) / totalUDCount).toFixed(0);
        var totalUDBytes = parseInt(uploadbyteratios) + parseInt(downloadbyteratios);
        var uploadbytesratiosper = ((uploadbyteratios * 100) / totalUDBytes).toFixed(0);
        var downloadbytesratiosper = ((downloadbyteratios * 100) / totalUDBytes).toFixed(0);
        if (countCheck != "") {
            $("#pieMain_01").show();
            $('#pieChart_01').sparkline([uploadcountratios, downloadcountratios], {
                sliceColors: ['#6774BD', '#F3D478'],
                type: 'pie',
                width: 135,
                height: 135,
                offset: -90,
                borderWidth: 2,
                borderColor: '#D1E0E0',
                tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}}</span>',
                tooltipValueLookups: {
                    'offset': {
                        0: "Upload Count " + uploadcountratios + " Total, " + uploadcountratiosper + "% upload",
                        1: "Download Count " + downloadcountratios + " Total, " + downloadcountratiosper + "% Download",
                    }
                }
            });
            $("#pieCharttitle_01").show();
            $("#UploadDataValue_01").html("Upload");
            $("#DownloadDataValue_01").html("Download");

            $("#UploadDataValue_01").siblings(".blockpio").css("background-color","#6774BD");
            $("#DownloadDataValue_01").siblings(".blockpio").css("background-color","#F3D478");
            $("#pieCharttitle_01_title").html("Upload/Download File Count");
        }
        if (bytesCheck != "") {
            $("#pieMain_02").show();
            $('#pieChart_02').sparkline([uploadbyteratios, downloadbyteratios], {
                sliceColors: ['#6774BD', '#F3D478'],
                type: 'pie',
                width: 135,
                height: 135,
                offset: -90,
                borderWidth: 2,
                borderColor: '#D1E0E0',
                tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}}</span>',
                tooltipValueLookups: {
                    'offset': {
                        0: "Upload " + crushFTP.methods.formatBytes(uploadbyteratios) + " Total, " + uploadbytesratiosper + "% upload",
                        1: "Download " + crushFTP.methods.formatBytes(downloadbyteratios) + " Total, " + downloadbytesratiosper + "% download",
                    }
                }
            });
            $("#pieCharttitle_02").show();
            $("#UploadDataValue_02").html("Upload");
            $("#DownloadDataValue_02").html("Download");
            $("#UploadDataValue_02").siblings(".blockpio").css("background-color","#6774BD");
            $("#DownloadDataValue_02").siblings(".blockpio").css("background-color","#F3D478");

            $("#pieCharttitle_02_title").html("Upload/Download File size");
        }
        $(".upload-pie").show();
        $(".download-pie").show();
        if (bytesCheck == "" && countCheck == "") {
            $(".main-chart").hide();
        }
    }

    // FailedLogins Reports Bind from XML
    function failedLogins(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var dataset = [];
        var faildUserLogin = {};
        var failedloginstbl = "<thead><tr><th>Username</th><th>Date/Time</th><th>IP</th></tr></thead><tbody>";
        $(x).find("ips > ips_subitem").each(function() {
            var start_time = $(this).find("ips_subitem > start_time").text();
            var ip = $(this).find("ips_subitem > ip").text();
            var username = $(this).find("ips_subitem > username").text();
            username=username.trim();
            dataset.push([username, start_time, ip]);
            username=username.toLowerCase().trim();
            if(faildUserLogin[username]!=undefined)
            {
                faildUserLogin[username] = {
                    "faildCount": faildUserLogin[username].faildCount=faildUserLogin[username].faildCount+1
                };
            }
            else
            {
                faildUserLogin[username] = {
                    "faildCount": 1
                };
            }
            i++;
        });

        var userFaildCountvalues = [];
        var userFaildCountTitles = new Array();

        for (var item in faildUserLogin){
             var username=item;
            userFaildCountvalues.push(parseInt(faildUserLogin[item].faildCount));
            userFaildCountTitles.push(username + " - " + faildUserLogin[item].faildCount+" Time Faild");

            $("#UserbarCount_val_FaildLogin").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
        }
        if (userFaildCountvalues.length != 0) {
            $("#UserbarCount_FaildLogin").show();
            createBarchart(userFaildCountTitles, userFaildCountvalues, "30", "UserbarCount_ID_FaildLogin");
            $("#UserbarCount_title_FaildLogin").html("User Faild Login");
        }
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(failedloginstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table", 100);
    }

    // CurrentLogins Reports Bind from XML
    function currentLogins(xml) {
        var fileTransferred=false;
        fileTransferred = $(parent.document).find("#reportConfigCurrentLogins").find("#showFiles_2").is(":checked") || !isEmbed;
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var failedloginstbl = "<thead><tr>" +
            "<th>Date</th>" +
            "<th>User</th>" +
            "<th>IP</th>" +
            "<th>Status</th>" +
            "<th>Uploads</th>" +
            "<th>Downloads</th>" +
            "</tr></thead><tbody>";
        var dataset = [];
        $(x).find("recent_users > recent_users_subitem").each(function() {
            var user_name = $(this).find("recent_users_subitem > user_name").text();
            var login_date_formatted = $(this).find("recent_users_subitem > login_date_formatted").text();
            var user_ip = $(this).find("recent_users_subitem > user_ip").text();
            var status = $(this).find("recent_users_subitem > status").text();

            var session_upload_count = $(this).find("recent_users_subitem > session_upload_count").text();
            var infocheckStr="";
            if(fileTransferred)
            {
                if($(this).find("recent_users_subitem > session_upload_count >the_file_name") !=undefined && $(this).find("recent_users_subitem > session_upload_count >the_file_name").text() !="")
                {

                    infocheckStr="<table width='100%' style='width:100%;'><tr><th>Date</th><th>FileName</th><th>Speed</th></tr>";
                    $(this).find("recent_users_subitem > session_upload_count").each(function() {
                        infocheckStr+="<tr>";
                        var date=$(this).find("user_time").text();
                        var name=$(this).find("the_file_name").text();
                        var averageSpeed=$(this).find("the_file_speed").text();
                        averageSpeed = crushFTP.methods.formatBytes(averageSpeed) + "/sec";
                        infocheckStr+="<td>"+date+"</td><td>"+name+"</td><td>"+averageSpeed+"</td>";
                        infocheckStr+="</tr>";
                    });
                    infocheckStr+="</table>";
                }
            }
            if(infocheckStr!="")
                session_upload_count+="<br>"+infocheckStr;

            var session_download_count = $(this).find("recent_users_subitem > session_download_count").text();
            infocheckStr="";
            if(fileTransferred)
            {
                 if($(this).find("recent_users_subitem > session_download_count >the_file_name") !=undefined && $(this).find("recent_users_subitem > session_download_count >the_file_name").text() !="")
                {

                    infocheckStr="<table width='100%' style='width:100%;'><tr><th>Date</th><th>FileName</th><th>Speed</th></tr>";
                    $(this).find("recent_users_subitem > session_download_count").each(function() {
                        infocheckStr+="<tr>";
                        var date=$(this).find("user_time").text();
                        var name=$(this).find("the_file_name").text();
                        var averageSpeed=$(this).find("the_file_speed").text();
                        averageSpeed = crushFTP.methods.formatBytes(averageSpeed) + "/sec";
                        infocheckStr+="<td>"+date+"</td><td>"+name+"</td><td>"+averageSpeed+"</td>";
                        infocheckStr+="</tr>";
                    });
                    infocheckStr+="</table>";
                }
            }
            if(infocheckStr!="")
                session_download_count+="<br>"+infocheckStr;


            dataset.push([login_date_formatted, user_name, user_ip, status, session_upload_count, session_download_count]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(failedloginstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table", 100);
    }

    // UploadFormsSearch Reports Bind from XML
    function uploadFormsSearch(xml) {
        var pathStr = "";
        var urlStr = "";
        if ($(parent.document).find("#reportConfigUploadFormsSearch").find("#showPaths_3").is(":checked") || !isEmbed) {
            pathStr = "<th>Path</th>";
        }
        if ($(parent.document).find("#reportConfigUploadFormsSearch").find("#showURLs_2").is(":checked") || !isEmbed) {
            urlStr = "<th>URL</th>";
        }
        if ($(parent.document).find("#reportConfigUploadFormsSearch").find("#showFormInfo_2").is(":checked") || !isEmbed) {}

        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Num</th>" +
            "<th>Size</th>" +
            "<th>Name</th>" + urlStr +
            "</tr></thead><tbody>";
        var dataset = [];
        var i = 1;
        $(x).find("uploads > uploads_subitem").each(function() {
            var num = i;
            var size = $(this).find("uploads_subitem > size").text();
            var name = $(this).find("uploads_subitem > name").text();
            var path = $(this).find("uploads_subitem > path").text();
            var url = $(this).find("uploads_subitem > url").text();
            size = crushFTP.methods.formatBytes(size) + " Total";
            if (pathStr != "" && urlStr != "")
                dataset.push([num, size, path + name, url]);
            else if (pathStr != "" && urlStr == "") {
                dataset.push([num, size, path + name]);
            } else if (pathStr == "" && urlStr == "") {
                dataset.push([num, size, name]);
            } else if (pathStr == "" && urlStr != "") {
                dataset.push([num, size, name, url]);
            }
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table");
    }

    // UserfolderPermissions Reports Bind from XML
    function userfolderPermissions(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var dataset = [];
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "<th>Folder Size</th>" +
            "<th>Folder Size Formatted</th>" +
            "<th>File Count</th>" +
            "<th>Quota</th>" +
            "<th>Quota Formatted</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        $(x).find("users > users_subitem").each(function() {
            var username = $(this).find("users_subitem > username").text();
            var fileSize = $(this).find("users_subitem > fileSize").text();
            var fileSizeFormatted = $(this).find("users_subitem > fileSizeFormatted").text();
            var fileCount = $(this).find("users_subitem > fileCount").text();
            var quota = $(this).find("users_subitem >  quota").text();
            var quotaFormatted = $(this).find("users_subitem >  quotaFormatted").text();
            dataset.push([username, fileSize, fileSizeFormatted, fileCount,quota,quotaFormatted]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table");
         setTimeout(function() {
            $(".dataTables_scrollHead").addClass("overflow-visible");
            $(".dataTables_scrollBody").addClass("overflow-visible");
            $(".dataTables_scroll").addClass("overflow-scroll");
        }, 1000);
    }

      // UserfolderPermissions Reports Bind from XML
    function userfolderSizes(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var dataset = [];
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "<th>Enabled</th>" +
            "<th>Groups</th>" +
            "<th>Notes</th>" +
            "<th>Folder</th>" +
            "<th>Location</th>" +
            "<th>Permissions</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        $(x).find("users > users_subitem").each(function() {
            var username = $(this).find("users_subitem > username").text();
            var enabled = $(this).find("users_subitem > enabled").text();
            var groups = $(this).find("users_subitem > groups").text();
            var notes = $(this).find("users_subitem > notes").text();
            var folder = $(this).find("users_subitem > listing > listing_subitem > name").text();
            var locations = $(this).find("users_subitem > listing > listing_subitem > url").text();
            var site_privs = $(this).find("users_subitem > site_privs").text();
            var allowed_protocols = $(this).find("users_subitem > allowed_protocols").text();
            var privs = $(this).find("users_subitem > listing > listing_subitem > privs").text();
            dataset.push([username, enabled, groups, notes, folder, locations, site_privs + " " + allowed_protocols + " " + privs]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table");
         setTimeout(function() {
            $(".dataTables_scrollHead").addClass("overflow-visible");
            $(".dataTables_scrollBody").addClass("overflow-visible");
            $(".dataTables_scroll").addClass("overflow-scroll");
        }, 1000);
    }


    function userUsage(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th style='word-break: break-all;width:10%;'>Username</th>" +
            "<th style='word-break: break-all;width:7%;'>Enabled</th>" +
            "<th style='word-break: break-all;width:7%;padding-right:95px;'>Last Login</th>" +
            "<th style='word-break: break-all;width:7%;padding-right:70px;'>Created On</th>" +
            "<th style='word-break: break-all;width:7%;'>Groups</th>" +
            "<th style='word-break: break-all;width:7%;'>Linked<br/> VFS</th>" +
            "<th style='word-break: break-all;width:7%;'>Max<br/> Logins</th>" +
            "<th style='word-break: break-all;width:7%;'>Account Expiration    </th>" +
            "<th style='word-break: break-all;width:5%;'>Password <br/>Expiration<br/> Enabled</th>" +
            "<th style='word-break: break-all;width:4%;'>Password <br/>Expiration<br/> Days</th>" +
            "<th style='word-break: break-all;width:7%;'>Password Expiration<br/> Date</th>" +
            "<th style='word-break: break-all;width:6%;'>Folder</th>" +
            "<th style='word-break: break-all;width:10%;'>Location</th>" +
            "<th style='word-break: break-all;width:9%;'>Permissions</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var dataset = [];
        var userLoginvalues = [];
        var userLoginTitles = new Array();
        $(x).find("users > users_subitem").each(function() {
            var username = $(this).find("users_subitem > username").text();
            var enabled = $(this).find("users_subitem > enabled").text();
            var last_login = $(this).find("users_subitem > last_login").text();
            var created_time = $(this).find("users_subitem > created_time").text() || "";
            var groups = $(this).find("users_subitem > groups").text();
            var linked_vfs = $(this).find("users_subitem > linked_vfs").text();
            var max_logins = $(this).find("users_subitem > max_logins").text();
            var expire_password_days = $(this).find("users_subitem > expire_password_days").text();
            var account_expire = $(this).find("users_subitem > account_expire").text();
            var expire_password_enabled = $(this).find("users_subitem > expire_password").text();
            var expire_password_when_Date = $(this).find("users_subitem > expire_password_when").text();
            var folder = $(this).find("users_subitem > listing > listing_subitem > name").text();
            var locations = $(this).find("users_subitem > listing > listing_subitem > url").text();
            var privs = $(this).find("users_subitem > listing > listing_subitem > privs").text();
            dataset.push([username, enabled, last_login, created_time, groups, linked_vfs, max_logins, account_expire, expire_password_enabled, expire_password_days, expire_password_when_Date, folder, locations, privs]);
            userLoginvalues.push(parseInt(max_logins));
            userLoginTitles.push(username + " - " + max_logins+" time Login.");
             $("#UserbarCount_val_user-usg").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
            i++;
        });
        if (userLoginvalues.length != 0) {
            $("#UserbarCount_user-usg").show();
            createBarchart(userLoginTitles, userLoginvalues, "30", "UserbarCount_ID_user-usg");
            $("#UserbarCount_title_user-usg").html("User wise Login Chart");
        }
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table", 50, 90);
        setTimeout(function() {
            $(".dataTables_scrollHead").addClass("overflow-visible");
            $(".dataTables_scrollBody").addClass("overflow-visible");
            $(".dataTables_scroll").addClass("overflow-scroll");

        }, 1000);
    }

    function accountActivitySummary(xml){
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "<th>IP</th>" +
            "<th>Duration</th>" +
            "<th>Uploaded</th>" +
            "<th>Downloaded</th>" +
            "<th>Deleted</th>" +
            "<th>Renamed</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var dataset = [];
        $(x).find("summary > summary_subitem").each(function() {
            var username = $(this).find("summary_subitem > username").text();
            var ip = $(this).find("summary_subitem > ip").text();
            var duration = $(this).find("summary_subitem > duration").text();
            var uploaded = crushFTP.methods.formatBytes($(this).find("summary_subitem > uploadBytes").text())  + " (" + $(this).find("summary_subitem > uploadCount").text() + " Items)";
            var downloaded = crushFTP.methods.formatBytes($(this).find("summary_subitem > downloadBytes").text()) + " (" + $(this).find("summary_subitem > downloadCount").text() + " Items)";
            var deleted = $(this).find("summary_subitem > deleteCount").text();
            var renamed = $(this).find("summary_subitem > renameCount").text();
            dataset.push([username, ip, duration, uploaded, downloaded, deleted, renamed]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table", 100);
    }

    // ExportUserPass Reports Bind from XML
    function exportUserPass(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "<th>Password</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var dataset = [];
        $(x).find("users > users_subitem").each(function() {
            var username = $(this).find("users_subitem > username").text();
            var password = $(this).find("users_subitem > password").text();
            dataset.push([username, password]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table", 100);
    }

    // JobSchedules Reports Bind from XML
    function jobSchedules(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Job</th>" +
            "<th>Type</th>" +
            "<th>Next Run</th>" +
            "<th>Enabled</th>" +
            "<th>Notes</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var dataset = [];
        $(x).find("jobs > jobs_subitem").each(function() {
            var schedulename = $(this).find("jobs_subitem > scheduleName").text();
            var scheduletype = $(this).find("jobs_subitem > scheduleType").text();
            var nextrun = $(this).find("jobs_subitem > nextRun").text();
            var jobenabled = $(this).find("jobs_subitem > jobEnabled").text();
            var schedulenote = $(this).find("jobs_subitem > scheduleNote").text();
            dataset.push([schedulename, scheduletype, nextrun, jobenabled, schedulenote]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table");
    }

    // ExpiringAccounts Reports Bind from XML
    function expiringAccounts(xml) {
        var accountCheck = "";
        var passwordCheck = "";
        if ($(parent.document).find("#reportConfigExpiringAccounts").find("#expire_account").is(":checked") || !isEmbed) {
            accountCheck = "<th>Account Expiration</th>";
        }
        if ($(parent.document).find("#reportConfigExpiringAccounts").find("#expire_password").is(":checked") || !isEmbed) {
            passwordCheck = "<th>Password Expiration</th>";
        }
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" + accountCheck + passwordCheck +
            "</tr></thead><tbody>";
        var i = 1;
        var dataset = [];
        $(x).find("users > users_subitem").each(function() {
            var password_expire = $(this).find("users_subitem > password_expire").text();
            var account_expire = $(this).find("users_subitem > account_expire").text();
            var username = $(this).find("users_subitem > username").text();
            if (accountCheck != "" && passwordCheck != "")
                dataset.push([username, account_expire, password_expire]);
            else if (accountCheck != "" && passwordCheck == "")
                dataset.push([username, account_expire]);
            else if (accountCheck == "" && passwordCheck != "")
                dataset.push([username, password_expire]);
            else if (accountCheck == "" && passwordCheck == "")
                dataset.push([username]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table");
    }

    // UserIPs Reports Bind from XML
    function userIPs(xml) {
        var countCheck = "";
        var ipCheck = "";
        var dnsCheck = "";
        if ($(parent.document).find("#reportConfigUserIPs").find("#showCounts_2").is(":checked") || !isEmbed)
            countCheck = "<th>IP Count</th>";
        if ($(parent.document).find("#reportConfigUserIPs").find("#showIPs_2").is(":checked") || !isEmbed)
            ipCheck = "<th>IPs</th>";
        if ($(parent.document).find("#reportConfigUserIPs").find("#reverseDNS_2").is(":checked") || !isEmbed)
            dnsCheck = "";
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" + countCheck + ipCheck +
            "</tr></thead><tbody>";
        var i = 1;
        var dataset = [];
        var userConnectedvalues = [];
        var userConnectedTitles = new Array();
        $(x).find("ips > ips_subitem").each(function() {
            var username = $(this).find("ips_subitem > username").text();
            var count = $(this).find("ips_subitem > count").text();
            var connectiontbl = "<div>";
            var i = 0
            $(this).find("item").each(function() {
                var ips_name = $(this).attr("name");
                var ips_Value = $(this).text();
                connectiontbl += "<div>";
                connectiontbl += ips_name + " - " + ips_Value + " connections";
                connectiontbl += "</div>";
                i++;
            });
            userConnectedvalues.push(parseInt(count));
            userConnectedTitles.push(username + " - " + count+" IP Count.");
            $("#UserbarCount_val_user-ip-count").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
            if (countCheck != "" && ipCheck != "")
                dataset.push([username, count, connectiontbl + "</div>"]);
            else if (countCheck != "" && ipCheck == "")
                dataset.push([username, count]);
            else if (countCheck == "" && ipCheck != "")
                dataset.push([username, connectiontbl + "</div>"]);
            else if (countCheck == "" && ipCheck == "")
                dataset.push([username]);
            i++;
        });
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl);
        bindDataTableLazyLoadingGrid(dataset, "upload-download-summary-table");
        if (userConnectedvalues.length != 0) {
            $("#UserbarCount_user-ip-count").show();
        createBarchart(userConnectedTitles, userConnectedvalues, "30", "UserbarCount_ID_user-ip-count");
            $("#UserbarCount_title_user-ip-count").html("User IP Connected Count");
        }
    }

    // WhoDownloadedFile Reports Bind from XML
    function whoDownloadedFile(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var whoFile = {};
        $(x).find("users > users_subitem").each(function() {
            var userFileCount=1;
            var username = $(this).find("users_subitem > username").text();
            var connectiontbl = "<table id='uploads_" + i + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
            connectiontbl += "<thead><tr><th>Files</th></tr></thead><tbody>";
            var j = 0;
            $(this).find("filesDetail > filesDetail_subitem").each(function() {
                var path = $(this).find("filesDetail_subitem > path").text();
                var connectiontbl_ = "<tr><td>";
                var connectiondatetbl = connectiontbl_ + "<table id='uploadsDate_" + i + "_" + j + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                connectiondatetbl += "<thead><tr><th  style='word-break: break-all;width:100%;'>" + path + "</th></tr></thead><tbody>";
                $(this).find("dates > dates_subitem").each(function() {
                    connectiondatetbl += "<tr><td>" + $(this).text() + "</td></tr>";
                    whoFile[username] = {
                        "totalfileCount": userFileCount
                    };
                    userFileCount++;
                });
                connectiontbl += connectiondatetbl + "</tbody></table></td></tr>";
                j++;
            });
            uploadformstbl += "<tr>" +
                "<td>" +
                "<div class='panel panel-default'><a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#" + i + "_table' aria-expanded='false' aria-controls='collapseTwo'>" +
                "<div class='panel-heading' role='tab' id='headingTwo' style='border: 1px solid #F5F3F3;'>" +
                "<h4 class='panel-title'>" + username + " " +
                "</h4> " +
                "</div></a>" +
                "<div id='" + i + "_table' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingTwo'> " +
                "<div class='panel-body'>" + connectiontbl + "</tbody></table></div></div></div>" +
                "</td></tr>";
            i++;
        });
        var userFilevalues = [];
        var userFileTitles = new Array();
        for (var item in whoFile){
             var username=item;
            userFilevalues.push(parseInt(whoFile[item].totalfileCount));
            userFileTitles.push(username + " - " + whoFile[item].totalfileCount+" Files Download");

            $("#UserbarCount_val_whoDwnFile").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
        }
        if (userFilevalues.length != 0) {
            $("#UserbarCount_whoDwnFile").show();
            createBarchart(userFileTitles, userFilevalues, "30", "UserbarCount_ID_whoDwnFile");
            $("#UserbarCount_title_whoDwnFile").html("Who Download Files");
        }
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl + "<tbody>");
        bindDatatableNoExport("download-table");
        bindDataTableGrid("upload-download-summary-table");
    }

    // WhoRenamedFile Reports Bind from XML
    function whoRenamedFile(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var whoFile = {};
        $(x).find("users > users_subitem").each(function() {
            var userFileCount=1;
            var username = $(this).find("users_subitem > username").text();
            var connectiontbl = "<table id='uploads_" + i + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
            connectiontbl += "<thead><tr><th>Files</th></tr></thead><tbody>";
            var j = 0;
            $(this).find("filesDetail > filesDetail_subitem").each(function() {
                var path = $(this).find("filesDetail_subitem > path").text();
                var connectiontbl_ = "<tr><td>";
                var connectiondatetbl = connectiontbl_ + "<table id='uploadsDate_" + i + "_" + j + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                connectiondatetbl += "<thead><tr><th  style='word-break: break-all;width:100%;'>" + path + "</th></tr></thead><tbody>";
                $(this).find("dates > dates_subitem").each(function() {
                    connectiondatetbl += "<tr><td>" + $(this).text() + "</td></tr>";
                    whoFile[username] = {
                        "totalfileCount": userFileCount
                    };
                    userFileCount++;
                });
                connectiontbl += connectiondatetbl + "</tbody></table></td></tr>";
                j++;
            });
            uploadformstbl += "<tr>" +
                "<td>" +
                "<div class='panel panel-default'><a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#" + i + "_table' aria-expanded='false' aria-controls='collapseTwo'>" +
                "<div class='panel-heading' role='tab' id='headingTwo' style='border: 1px solid #F5F3F3;'>" +
                "<h4 class='panel-title'>" + username + " " +
                "</h4> " +
                "</div></a>" +
                "<div id='" + i + "_table' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingTwo'> " +
                "<div class='panel-body'>" + connectiontbl + "</tbody></table></div></div></div>" +
                "</td></tr>";
            i++;
        });
        var userFilevalues = [];
        var userFileTitles = new Array();
        for (var item in whoFile){
             var username=item;
            userFilevalues.push(parseInt(whoFile[item].totalfileCount));
            userFileTitles.push(username + " - " + whoFile[item].totalfileCount+" Files Renamed.");
            $("#UserbarCount_val_whoRenFile").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
        }
        if (userFilevalues.length != 0) {
            $("#UserbarCount_whoRenFile").show();
            createBarchart(userFileTitles, userFilevalues, "30", "UserbarCount_ID_whoRenFile");
            $("#UserbarCount_title_whoRenFile").html("Who Renamed Files");
        }
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl + "<tbody>");
        bindDatatableNoExport("download-table");
        bindDataTableGrid("upload-download-summary-table");
    }

    // WhoDeletedFile Reports Bind from XML
    function whoDeletedFile(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var whoFile = {};
        $(x).find("users > users_subitem").each(function() {
            var userFileCount=1;
            var username = $(this).find("users_subitem > username").text();
            var connectiontbl = "<table id='uploads_" + i + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
            connectiontbl += "<thead><tr><th>Files</th></tr></thead><tbody>";
            var j = 0;
            $(this).find("filesDetail > filesDetail_subitem").each(function() {
                var path = $(this).find("filesDetail_subitem > path").text();
                var connectiontbl_ = "<tr><td>";
                var connectiondatetbl = connectiontbl_ + "<table id='uploadsDate_" + i + "_" + j + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                connectiondatetbl += "<thead><tr><th  style='word-break: break-all;width:100%;'>" + path + "</th></tr></thead><tbody>";
                $(this).find("dates > dates_subitem").each(function() {
                    connectiondatetbl += "<tr><td>" + $(this).text() + "</td></tr>";
                    whoFile[username] = {
                        "totalfileCount": userFileCount
                    };
                    userFileCount++;
                });
                connectiontbl += connectiondatetbl + "</tbody></table></td></tr>";
                j++;
            });
            uploadformstbl += "<tr>" +
                "<td>" +
                "<div class='panel panel-default'><a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#" + i + "_table' aria-expanded='false' aria-controls='collapseTwo'>" +
                "<div class='panel-heading' role='tab' id='headingTwo'>" +
                "<h4 class='panel-title'>" + username + "</h4> " +
                "</div></a>" +
                "<div id='" + i + "_table' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingTwo'> " +
                "<div class='panel-body'>" + connectiontbl + "</tbody></table></div></div></div>" +
                "</td></tr>";
            i++;
        });

        var userFilevalues = [];
        var userFileTitles = new Array();
        for (var item in whoFile){
             var username=item;
            userFilevalues.push(parseInt(whoFile[item].totalfileCount));
            userFileTitles.push(username + " - " + whoFile[item].totalfileCount+" Files Deleted.");
            $("#UserbarCount_val_whoDelFile").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
        }
        if (userFilevalues.length != 0) {
            $("#UserbarCount_whoDelFile").show();
            createBarchart(userFileTitles, userFilevalues, "30", "UserbarCount_ID_whoDelFile");
            $("#UserbarCount_title_whoDelFile").html("Who Deleted Files");
        }
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl + "<tbody>");
        bindDatatableNoExport("download-table");
        bindDataTableGrid("upload-download-summary-table");
    }

    // WhoUploadedFile Reports Bind from XML
    function whoUploadedFile(xml) {
        var x = xml.getElementsByTagName("results")[0];
        var i = 0;
        var uploadformstbl = "<thead><tr>" +
            "<th>Username</th>" +
            "</tr></thead><tbody>";
        var i = 1;
        var whoFile = {};
        $(x).find("users > users_subitem").each(function() {
            var userFileCount=1;
            var username = $(this).find("users_subitem > username").text();
            var connectiontbl = "<table id='uploads_" + i + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
            connectiontbl += "<thead><tr><th>Files</th></tr></thead><tbody>";
            var j = 0;
            $(this).find("filesDetail > filesDetail_subitem").each(function() {
                var path = $(this).find("filesDetail_subitem > path").text();
                var connectiontbl_ = "<tr><td>";
                var connectiondatetbl = connectiontbl_ + "<table id='uploadsDate_" + i + "_" + j + "'  class='table table-striped table-bordered download-table' cellspacing='0' width='100%'>";
                connectiondatetbl += "<thead><tr><th  style='word-break: break-all;width:100%;'>" + path + "</th></tr></thead><tbody>";
                $(this).find("dates > dates_subitem").each(function() {
                    connectiondatetbl += "<tr><td>" + $(this).text() + "</td></tr>";
                     whoFile[username] = {
                        "totalfileCount": userFileCount
                    };
                    userFileCount++;
                });
                connectiontbl += connectiondatetbl + "</tbody></table></td></tr>";
                j++;
            });
            uploadformstbl += "<tr>" +
                "<td>" +
                "<div class='panel panel-default'><a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#" + i + "_table' aria-expanded='false' aria-controls='collapseTwo'>" +
                "<div class='panel-heading' role='tab' id='headingTwo'>" +
                "<h4 class='panel-title'>" + username + "</h4>" +
                "</div></a>" +
                "<div id='" + i + "_table' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingTwo'> " +
                "<div class='panel-body'>" + connectiontbl + "</tbody></table></div></div></div>" +
                "</td></tr>";
            i++;
        });
        var userFilevalues = [];
        var userFileTitles = new Array();
        for (var item in whoFile){
             var username=item;
            userFilevalues.push(parseInt(whoFile[item].totalfileCount));
            userFileTitles.push(username + " - " + whoFile[item].totalfileCount+" Files Uploaded.");

            $("#UserbarCount_val_whoUplFile").append('<svg width="31" height="65" style=""><text x="145" y="142" transform="rotate(-90, 28, 150)" style="text-anchor:middle; font-size:11px">' + username + '</text></svg>');
        }
        if (userFilevalues.length != 0) {
            $("#UserbarCount_whoUplFile").show();
            createBarchart(userFileTitles, userFilevalues, "30", "UserbarCount_ID_whoUplFile");
            $("#UserbarCount_title_whoUplFile").html("Who Uploaded Files");
        }
        $("#upload-download-summary-table").empty();
        $("#upload-download-summary-table").html(uploadformstbl + "<tbody>");
        bindDatatableNoExport("download-table");
        bindDataTableGrid("upload-download-summary-table");
    }
});