var letsEncrypt = {
    initGUI: function(){
        $("#SessionSeconds").sessionChecker({
            callBack:function(){
                crushFTP.userLogin.userLoginStatusCheckThread();
                crushFTP.UI.hideLoadingIndicator({});
            }
        });
        var _panel = $("#pnlPluginLetsEncrypt");
        $("a.serverFilePickButton").each(function(){
            $(this).unbind("click").click(function(){
                var curElem = $(this);
                curElem.crushFtpLocalFileBrowserPopup({
                    type : curElem.attr("PickType") || 'dir',
                    file_mode : curElem.attr("FileMode") || 'server',
                    existingVal : $("#" + curElem.attr("rel"), _panel).val(),
                    callback : function(selectedPath){
                        $("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change");
                    }
                });
                return false;
            });
        });
        $('#submit-btn').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            function continueCommand(){
                var data = {
                    command: "letsencrypt",
                    action: "fetch_certs"
                };
                _panel.find("input[type='text'],input[type='password'],textarea,select").each(function(){
                    if($(this).attr("id"))
                    {
                        var curVal = $(this).val();
                        if($(this).attr("id") == "keystore_path" || $(this).attr("id") == "challenge_path"){
                            data[$(this).attr("id")] = crushFTP.methods.htmlEncode(curVal);
                        }
                        else{
                            data[$(this).attr("id")] = curVal;
                        }
                    }
                });
                _panel.find("input[type='checkbox']").each(function(){
                    if($(this).attr("id"))
                    {
                        var curVal = $(this).is(":checked");
                        data[$(this).attr("id")] = curVal;
                    }
                });
                crushFTP.data.serverRequest(data, function(msg){
                    crushFTP.UI.growl("Let's Encrypt", decodeURIComponent($(msg).text()), false, false);
                });
            }
            if(_panel.find(".hasPendingCall").length>0)
            {
                window.pendingEncryptionCall = function(){
                    continueCommand();
                };
                _panel.find(".hasPendingCall").trigger("blur");
            }
            else
            {
                continueCommand();
            }
        });
    }
}