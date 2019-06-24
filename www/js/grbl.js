var interval_status=-1;
var probe_progress_status = 0;
var grbl_error_msg = "";
var gotWCO = false;
var WCOx = 0;
var WCOy = 0;
var WCOz = 0;

function init_grbl_panel(){
    grbl_set_probe_detected(false);
    if (target_firmware == "grbl-embedded" ){
        on_autocheck_status(true);
    }
}

function grbl_clear_status(){
    grbl_set_probe_detected(false);
    grbl_error_msg = "";
    document.getElementById('grbl_status_text').innerHTML= grbl_error_msg;
    document.getElementById('grbl_status').innerHTML= "";
}

function grbl_set_probe_detected(state){
    if (state){
        document.getElementById('touch_status_icon').innerHTML = get_icon_svg("ok-circle", "1.3em", "1.2em", "green");
    } else {
        document.getElementById('touch_status_icon').innerHTML = get_icon_svg("record", "1.3em", "1.2em", "grey");
    }
}

function onprobemaxtravelChange () {
    var travel =  parseFloat(document.getElementById('probemaxtravel').value);
    if (travel > 9999  || travel <= 0  ||isNaN(travel) || (travel === null)) {
        alertdlg (translate_text_item("Out of range"), translate_text_item( "Value of maximum probe travel must be between 1 mm and 9999 mm !"));
        return false;
        }
    return true;
}

function onprobefeedrateChange () {
    var feedratevalue =  parseInt(document.getElementById('probefeedrate').value);
    if (feedratevalue <=0 || feedratevalue > 9999 || isNaN(feedratevalue) || (feedratevalue === null)) {
        alertdlg (translate_text_item("Out of range"), translate_text_item( "Value of probe feedrate must be between 1 mm/min and 9999 mm/min !"));
        return false
        }
    return true
}

function onprobetouchplatethicknessChange () {
    var thickness =  parseFloat(document.getElementById('probetouchplatethickness').value);
    if (thickness <= 0 || thickness > 999 || isNaN(thickness) || (thickness === null)) {
        alertdlg (translate_text_item("Out of range"), translate_text_item( "Value of probe touch plate thickness must be between 0 mm and 9999 mm !"));
        return false;
        }
    return true;
}

function on_autocheck_status(use_value){
    if (probe_progress_status !=0) {
                document.getElementById('autocheck_status').checked = true;
                return;
            }
    if (typeof (use_value) !== 'undefined' )  document.getElementById('autocheck_status').checked =use_value;
    if (document.getElementById('autocheck_status').checked) {
       var interval = parseInt(document.getElementById('statusInterval_check').value);
       if (!isNaN(interval) && interval > 0 && interval < 100) {
           if (interval_status != -1 )clearInterval(interval_status);
           interval_status = setInterval(function(){ get_status() }, interval * 1000);
            }
        else {
            document.getElementById('autocheck_status').checked = false;
            document.getElementById('statusInterval_check').value = 0;
            if (interval_status != -1 )clearInterval(interval_status);
            interval_status = -1;
        }
    }
  else {
        if (interval_status != -1 )clearInterval(interval_status);
        interval_status = -1;
    }
    
 if (document.getElementById('autocheck_status').checked == false){
     grbl_clear_status();
 }
}

function onstatusIntervalChange(){
var interval = parseInt(document.getElementById('statusInterval_check').value);
 if (!isNaN(interval) && interval > 0 && interval < 100 ) {
       on_autocheck_status();   
    }
else {
    document.getElementById('autocheck_status').checked = false;
    document.getElementById('statusInterval_check').value = 0;
    if (interval != 0)alertdlg (translate_text_item("Out of range"), translate_text_item( "Value of auto-check must be between 0s and 99s !!"));
    on_autocheck_status();
    }
}

//TODO handle authentication issues
//errorfn cannot be NULL
function get_status(){
    var command = "?";
    if ((target_firmware == "grbl") || (target_firmware == "grbl-embedded"))  command = "?";
    //ID 114 is same as M114 as '?' cannot be an ID
    SendPrinterCommand(command, false, null,null, 114, 1);
}

function process_grbl_position(response){
    var tab1 = response.split("WCO:");
     if (tab1.length >1) {
        var tab2 = tab1[1].split("|");
        var tab1 = tab2[0].split(">");
        var tab3 = tab1[0].split(",");
        WCOx = parseFloat(tab3[0]);
        if (tab3.length > 1) {
            WCOy = parseFloat(tab3[1]);
        } else {
            WCOy = 0;
        }
        if (tab3.length > 2) {
            WCOz = parseFloat(tab3[2]);
        } else {
            WCOz =0;
        }
        gotWCO =true;
    }
    tab1 = response.split("WPos:");
    if (tab1.length >1) {
        var tab2 = tab1[1].split("|");
        var tab3 = tab2[0].split(",");
        document.getElementById('control_x_position').innerHTML = tab3[0];
        if(gotWCO)document.getElementById('control_xm_position').innerHTML = (WCOx + parseFloat(tab3[0])).toFixed(3);
        if (tab3.length > 1) {
            document.getElementById('control_y_position').innerHTML = tab3[1];
            if(gotWCO)document.getElementById('control_ym_position').innerHTML = (WCOy + parseFloat(tab3[1])).toFixed(3);
        }
        if (tab3.length > 2) {
            document.getElementById('control_z_position').innerHTML = tab3[2];
            if(gotWCO)document.getElementById('control_zm_position').innerHTML = (WCOz + parseFloat(tab3[2])).toFixed(3);
        }
        
    } else {
        tab1 = response.split("MPos:");
        if (tab1.length >1) {
            var tab2 = tab1[1].split("|");
            var tab3 = tab2[0].split(",");
            document.getElementById('control_xm_position').innerHTML = tab3[0];
            if(gotWCO)document.getElementById('control_x_position').innerHTML = (parseFloat(tab3[0]) - WCOx).toFixed(3);
            if (tab3.length > 1) {
                document.getElementById('control_ym_position').innerHTML = tab3[1];
                if(gotWCO)document.getElementById('control_y_position').innerHTML = (parseFloat(tab3[1]) - WCOy).toFixed(3);
            }
            if (tab3.length > 2) {
                document.getElementById('control_zm_position').innerHTML = tab3[2];
                if(gotWCO)document.getElementById('control_z_position').innerHTML = (parseFloat(tab3[2]) - WCOz).toFixed(3);
            }
        } 
    } 
}

function process_grbl_status(response){
    
    var tab1 = response.split("|");
    if (tab1.length >1) {
        var tab2 = tab1[0].replace("<","");
        document.getElementById("grbl_status").innerHTML = tab2; 
        if (tab2.toLowerCase().startsWith("run")){
            grbl_error_msg = "";
            document.getElementById('sd_resume_btn').style.display="none";
            document.getElementById('sd_pause_btn').style.display="table-row";
            document.getElementById('sd_reset_btn').style.display="table-row";
            
        } else if (tab2.toLowerCase().startsWith("hold")){
            grbl_error_msg = tab2;
            document.getElementById('sd_pause_btn').style.display="none";
            document.getElementById('sd_resume_btn').style.display="table-row";
            document.getElementById('sd_reset_btn').style.display="table-row";
            
        } else  if (tab2.toLowerCase().startsWith("alarm")) {
            if (probe_progress_status != 0){
                probe_failed_notification();
            }
            //grbl_error_msg = "";
            //check we are printing or not 
            if (response.indexOf("|SD:")!=-1) {
                //guess print is stopped because of alarm so no need to pause
                document.getElementById('sd_pause_btn').style.display="none";
                document.getElementById('sd_resume_btn').style.display="table-row";
                document.getElementById('sd_reset_btn').style.display="none";
                }
        } else { //TBC for others status
            document.getElementById('sd_pause_btn').style.display="none";
            document.getElementById('sd_resume_btn').style.display="none";
            document.getElementById('sd_reset_btn').style.display="none";
        }
        if (tab2.toLowerCase().startsWith("idle")){
            grbl_error_msg = "";
        }
        document.getElementById('grbl_status_text').innerHTML= translate_text_item(grbl_error_msg);
        if (tab2.toLowerCase().startsWith("alarm"))document.getElementById('clear_status_btn').style.display="table-row";
        else document.getElementById('clear_status_btn').style.display="none";
    }
}

function finalize_probing(){
    probe_progress_status = 0;
    document.getElementById("probingbtn").style.display="table-row";
    document.getElementById("probingtext").style.display="none";
    document.getElementById('sd_pause_btn').style.display="none";
    document.getElementById('sd_resume_btn').style.display="none";
    document.getElementById('sd_reset_btn').style.display="none";
}

function process_grbl_SD(response){
    var tab1 = response.split("|SD:");
    if (tab1.length >1) {
        var tab2 = tab1[1].split("|");
        var tab3 = tab2[0].split(",");
        //TODO
        var progress = tab3[0];
        var sdname = "???";
        if (tab3.length >1) {
            sdname = tab3[1].replace(">","");
        } else {
        progress = progress.replace(">","");
        }
        document.getElementById('grbl_SD_status').innerHTML = sdname + "&nbsp;<progress id='print_prg' value=" + progress + " max='100'></progress>"  + progress + "%";
    } else { //no SD printing
        //TODO     
        document.getElementById('grbl_SD_status').innerHTML = "";
    }
}
function process_grbl_probe_status(response){
    var tab1 = response.split("|Pn:");
    if (tab1.length >1) {
        var tab2 = tab1[1].split("|");
        if (tab2[0].indexOf("P") != -1) { //probe touch
            grbl_set_probe_detected(true);
        } else {//Probe did not touched
            grbl_set_probe_detected(false);
        }
    } else {//no info 
        grbl_set_probe_detected(false);
    }
}

function SendRealtimeCmd(cmd){
    SendPrinterCommand(cmd, false, null,null, cmd.charCodeAt(0), 1);
}

function grbl_process_status(response){
     process_grbl_position(response);
     process_grbl_status(response);
     process_grbl_SD(response);
     process_grbl_probe_status(response);
}

function grbl_reset_detected(msg){
    console.log("Reset detected");
}

function grbl_process_msg(response){
    if(grbl_error_msg.length == 0)grbl_error_msg = translate_text_item(response.trim());
}

function grbl_reset(){
    if(probe_progress_status!=0)probe_failed_notification();
    SendRealtimeCmd(String.fromCharCode(0x18));    
}

function grbl_GetProbeResult(response){
    console.log("yes");
    var tab1 = response.split(":");
    if (tab1.length >2) {
        var status = tab1[2].replace("]","");
        if  (parseInt(status.trim()) == 1){
            if (probe_progress_status !=0) {
                var cmd = "G53 G0 Z" ;
                var tab2 = tab1[1].split(",");
                var v = 0.0;
                v = parseFloat(tab2[2]);
                console.log("z:" + v.toString());
                cmd+=v;
                SendPrinterCommand(cmd, true, null,null, 53, 1);
                cmd = "G10 L20 P0 Z" + document.getElementById('probetouchplatethickness').value;;
                SendPrinterCommand(cmd, true, null,null, 10, 1);
                cmd = "G90";
                SendPrinterCommand(cmd, true, null,null, 90, 1);
                finalize_probing();
            }
        } else {
            probe_failed_notification();
        }
    }
}

function probe_failed_notification(){
    finalize_probing();
    alertdlg (translate_text_item("Error"), translate_text_item( "Probe failed !"));
    beep(70, 261);
}

function StartProbeProcess(){
    var cmd ="G38.2 G91 Z-";
    if ( !onprobemaxtravelChange() ||
         !onprobefeedrateChange() ||
         !onprobetouchplatethicknessChange()){
        return;
    }
    cmd+=parseFloat(document.getElementById('probemaxtravel').value) + " F" + parseInt(document.getElementById('probefeedrate').value);
    console.log(cmd);
    probe_progress_status = 1;
    on_autocheck_status(true);
    SendPrinterCommand(cmd, true, null,null, 38.2, 1);
    document.getElementById("probingbtn").style.display="none";
    document.getElementById("probingtext").style.display="table-row";
    grbl_error_msg="";
    document.getElementById('grbl_status_text').innerHTML= grbl_error_msg;
}
