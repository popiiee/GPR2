/*Report interface*/

crushReports.reports.ExportUserPass = function(data, tpl) {
    /*Get references from main file*/
    var config = crushReports.config;
    var isEmbed = crushReports.isEmbed;
    var utils = crushReports.utils;
    var XLSUtils = crushReports.XLSUtils;
    var getColorCode = crushReports.getColorCode;
    var getFileExtension = crushReports.getFileExtension;
    var getPerc = crushReports.getPerc;
    var loader = crushReports.loader;

    var icon = "fa-user-o";
    var title = "Export User Pass";
    var desc = "Export username and passwords.";
    config.reportIcon.addClass(icon);
    config.reportTitle.text(title);
    config.reportDesc.text(desc);

    var content = $(tpl).find("#html-content").html();
    config.reportContent.empty().append(content);
    var template = $(tpl).find("#template").html();

    var x = $(data).find("results:first");

    var users = $(x).find("users_subitem");

    function processData(_data) {
        var items = [];
        $(_data).each(function() {
            var username = $(this).find(" > username:first").text();
            var password = $(this).find(" > password:first").text();
            var email = $(this).find(" > email:first").text() || "-";
            items.push({
                username : crushFTPTools.xmlEncode(username),
                password : password,
                email : crushFTPTools.xmlEncode(email)
            });
        });
        return {
            items : items
        }
    };
    var usersData = processData(users);
    var panel = config.reportContent;
    var tables = panel.find(".tables").empty();
    var shareContent = $(template.replace(/\$type/g, "users"));
    tables.append(shareContent);
    var columns = [{
        "data": "username"
    }, {
        "data": "password"
    }, {
        "data": "email"
    }];

    var usersTable = $('#users_dataRecord').find(".dataTable");
    var maxwidth = '150px';
    var usersTableDT = usersTable.DataTable({
        "language": {
            "emptyTable": "No data available"
        },
        data: usersData.items,
        fnRowCallback: function(nRow, aData, iDisplayIndex) {
            var x = nRow;
            $(x).find('td').each(function() {
                $(this).addClass('reports-td');
                $(this).css("max-width", maxwidth);
                $(this).attr("title", $(this).html().replace(/\<div>/g, " ").replace(/\<\/div>/g, " ").replace(/\<br>/g, " ").replace(/\<br\/>/g, " "));
            });
            return nRow;
        },
        "columns": columns,
        "order": [
            [0, 'asc']
        ]
    });

    var hasData = usersData.items.length;
    if (hasData) {
        $('#exportAsXLS').unbind().click(function() {
            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }
            var wb = new Workbook();
            /* add worksheet to  */
            function addType(data, type) {
                var sheetName = "" + type;
                if (!wb.SheetNames.has(sheetName))
                    wb.SheetNames.push(sheetName);
                var tableRecords = [];
                var defaultRow = ["Username", "Password", "Email"];
                tableRecords.push(defaultRow);
                for (var i = 0; i < data.items.length; i++) {
                    var curFile = data.items[i];
                    var row = [];
                    row.push(crushFTPTools.decodeXML(curFile.username));
                    row.push(curFile.password);
                    row.push(curFile.email == "-" ? "" : crushFTPTools.decodeXML(curFile.email));
                    tableRecords.push(row);
                };
                var ws = XLSUtils.sheetFromArrayOfArrays(tableRecords)
                wb.Sheets[sheetName] = ws;
            }
            addType(usersData, "users");
            var wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'binary'
            });

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            saveAs(new Blob([s2ab(wbout)], {
                type: "application/octet-stream"
            }), "ExportUserPass.xlsx");
        });
    } else {
        $('.has-report-data').hide();
    }
}