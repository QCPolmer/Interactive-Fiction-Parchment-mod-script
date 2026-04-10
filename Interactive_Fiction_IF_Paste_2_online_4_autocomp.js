// PASTE INTO iplayif.com games (THE ctrl+k->browser terminal)
// I think based on 'parchment' engine? for playing interactive fiction
// (ctrl+shift then -> k-firefox, i-edge, not sure about chrome)
// (looks like using version from 2025.1.14) 
// ---- runs with 'stand alone' 1-page version of parchment. 
// ----		(maybe I should put it in archives?)

///////////////////////////////////////////////////////////////
//speech recognition handler (at bottom of page, it's self contained)
var speech_recog_onClick_div = document.createElement("div");
document.body.appendChild( speech_recog_onClick_div );
speech_recog_onClick_div.innerHTML = "SPEECHREC_toggle"
var speech_recognition_callback_on_txt_out= function(getTxtOut){ 
//found in  (took a shitload of seaching, and looking into jquery)
// "main thread>iplayif.com>src>upstream>asyncglk>glkote>web>inputs.ts"
// SHOULD have an event-with it (txt,evnt)... but only runs like this
 $(".Input.LineInput").data("window").textinput.submit_line(getTxtOut); 
	};
//below runs a few ms after top one!
var speech_recognition_callback_on_txt_out_delay= 
	function(getTxtOut){ tmpTEXT2SPEECH_LAST_TXT(); };
var SPEECH_REGONITION_USE_DELAY_CALLBACK___WAIT4 =100; //ms
var SPEECH_RECOGNITION_USE_DELAY_CALLBACK_ALSO = true; //if need a delay
///////////////////////////////////////////////////////////////

var tmpINPUT_CLASS_NAME = "Input LineInput";
var tmpAUTCOMP_COLOR = null; // "blue" "white" "red" "black"
var DISABLE_DIS_DIRECTIONS_PRESSED =0;

var tmpIN_GAME_TEXT_DIV = document.getElementById("windowport");

//divs added to top, may need to move 
var tmpDisp_help_div = document.createElement("div");
tmpDisp_help_div.innerHTML = "CLICK 4 CMMN WORDS<BR>txt2speech-tab<br>in blank field!<br><br>"
document.body.appendChild( tmpDisp_help_div );
tmpDisp_help_div.onclick = function(){prompt(tmpBaseCmds_init);}



var tmpDispDiv = document.createElement("div");
document.body.appendChild( tmpDispDiv );

if(tmpAUTCOMP_COLOR != null){
	tmpDisp_help_div.style="color: "+ tmpAUTCOMP_COLOR+";"
	tmpDispDiv.style="color: "+ tmpAUTCOMP_COLOR+";" }

var tmpBaseCmds_init = "jump lie listen sit sleep wait xyzzy buy purchase climb drink eat hit kill kiss knock lick on upon listen lock move pull push read search sit smell sniff taste throw tie touch turn turnoff off on switch unlock untie lock tie close open give drop ask inventory lookat open put quit take get pick tell undo use wear don put on remove examine at look restart inventory help save restore load";

tmpBaseCmds = tmpBaseCmds_init.split(" ");

var tmpDirs_obj = {"north":"n","east":"e","south":"s","west":"w","up":"u","down":"d", "northeast":"ne", "southeast":"se", "northwest":"nw", "southwest":"sw"};
var tmpDirs = Object.keys(tmpDirs_obj).concat(">");
var tmpDirs_n_letter = tmpDirs.concat("u","d","e","w","ne","nw","se","sw","n","s");

//for reading txt 4 txt to speech/pulling game txt...
// PRESS 'TAB' when input field is blank! (any other typing stops it!)
var tmpTAB_NO_INPUT_TXT_2_SPEECH_ON = true;
var tmpTXT2SPEECH = { rate:1.0, pitch:0.5};
var tmpTEXT2SPEECH_LAST_TXT_ONEND_CALLBACK = function(){
	speech_recog_init_or_continue(); };
function tmpTEXT2SPEECH_LAST_TXT( getCancel_ONLY_or_null){
	if(!tmpTAB_NO_INPUT_TXT_2_SPEECH_ON ){ return;}
	speechSynthesis.cancel();
	if(getCancel_ONLY_or_null == 1){ return;  }
	
	// getting last txt box prior to current '>'
	var tmpTxt = tmpIN_GAME_TEXT_DIV.innerText.split(">");
	var tmp_i = tmpTxt.length-2; if(tmp_i <0){ tmp_i ==0; } 
	tmpTxt = tmpTxt[tmp_i];
	// pulling text AFTER prev '>'
	if(tmp_i != 0){ tmpTxt = tmpTxt.split("\n");
		tmpTxt.shift(); tmpTxt.join("\n");  }
	var tmpMsg = new SpeechSynthesisUtterance();
	tmpMsg.onend = tmpTEXT2SPEECH_LAST_TXT_ONEND_CALLBACK;
	//utterThis.addEventListener("end", 
	//	tmpTEXT2SPEECH_LAST_TXT_ONEND_CALLBACK);
	tmpMsg.rate =tmpTXT2SPEECH.rate; tmpMsg.pitch =tmpTXT2SPEECH.pitch;
      	tmpMsg.text = tmpTxt;
	speechSynthesis.speak(tmpMsg) 
}

var txt_box_tab_blocked = null;
document.body.addEventListener('keyup', function(event) {
	  tmpTEXT2SPEECH_LAST_TXT(true);//cancel if playing  
	  speech_recog_init_or_continue(); //continues if on
	 var tmpInput_div = 
		document.getElementsByClassName(tmpINPUT_CLASS_NAME)[0];  
	  //killing 'tab' event
	  if(txt_box_tab_blocked != tmpInput_div && tmpInput_div != null ){
		txt_box_tab_blocked = tmpInput_div;
		console.log("blocked!");
		tmpInput_div.addEventListener('keydown', function(event){ 
			if(event.keyCode==9){ event.preventDefault();}}); }

	  tmpDispDiv.innerHTML = "";
	  var tmpTxt = tmpIN_GAME_TEXT_DIV.innerText.replace(/[.,;:!\n]/g, ' ').split(">").join(" > ").split('"').join("").split("'").join("").split("\n").join(" ").split(" ").concat(tmpBaseCmds);
	var tmpTxt_matches = [];
	var cur_input_value_INIT = document.getElementsByClassName(tmpINPUT_CLASS_NAME)[0].value.split(" ");
	var cur_input_value = 
		cur_input_value_INIT[cur_input_value_INIT.length-1];  

	var lastDirections = [];
	for(var i=tmpTxt.length-1; i>=0; i-=1){
	     if(tmpDirs.indexOf(tmpTxt[i].toLowerCase())!=-1  ){
		  if(tmpTxt[i-1] != ">"){
		    if(lastDirections[0] != ">" || tmpTxt[i]!=">"){
			if(tmpTxt[i] == ">"){ lastDirections.unshift(">");
			}else{ lastDirections[0]=lastDirections[0] +"," +
				tmpDirs_obj[tmpTxt[i]]; }
		    }} 
		if(lastDirections.length > 8){break;}} } 
	//converting directions to arranged directions.
	var tmp_map_base = ["w","nw","sw","n","s","ne","se","e","u","d"];
	var tmp_map_base_init = 
		["_","__","__","_","_","__","__","_","_","_"];
	for(var i=0; i< lastDirections.length; i+=1){
		var tmp_map = tmp_map_base_init.concat();
		var tmp_ldirs = lastDirections[i].split(",");
		for(var j=0; j< tmp_ldirs.length; j+=1){
			var tmp_j_index=tmp_map_base.indexOf(tmp_ldirs[j]);
			if(tmp_j_index !=-1){
			  tmp_map[tmp_j_index] = tmp_map_base[tmp_j_index];
			}
		}
		lastDirections[i] = tmp_map.join(".");
	}
	
      if(DISABLE_DIS_DIRECTIONS_PRESSED !=1){
	// getting directions presssed
	lastDirections.unshift("----MAP----");
	var tmpTxt2 = tmpIN_GAME_TEXT_DIV.innerText.replace(/[.,;:!\n]/g, ' ').split("\n").join(" ").split(" ").concat(tmpBaseCmds);
	for(var i=tmpTxt2.length-1; i>=0; i-=1){
	     if(tmpDirs_n_letter.indexOf(tmpTxt2[i].toLowerCase()
		.substring(1)) !=-1  && tmpTxt2[i][0]==">"){ 
			lastDirections.unshift(tmpTxt2[i].toUpperCase());
		if(lastDirections.length > 15){break;}} } 
      }
	
	tmpTxt = tmpTxt.concat(tmpDirs).concat(tmpBaseCmds);

	for(var i=tmpTxt.length-1; i>=0; i-=1){
		var tmpTxt_low = tmpTxt[i].toLowerCase()
		if(0 == tmpTxt_low.indexOf( cur_input_value.toLowerCase()) &&	tmpTxt_matches.indexOf( tmpTxt_low) == -1){
			tmpTxt_matches.push( tmpTxt_low); }
		if(tmpTxt_matches.length > 10){break;}
	}
	tmpDispDiv.innerHTML =   lastDirections.join("<br>") +
	"<br><br><br><br>" + tmpTxt_matches.join("<br>");
	////////// ctrl AUTO COMPLETE
   	if (event.keyCode == 17 || event.keyCode == 9) { //ctrl = auto complete
	   cur_input_value_INIT[cur_input_value_INIT.length-1] = tmpTxt_matches[0];
	   //text to speech IF tab while nothing input
	   if(tmpInput_div.value.trim("") =="" ){tmpTEXT2SPEECH_LAST_TXT();
	   }else{ tmpInput_div.value=
			cur_input_value_INIT.join(" ") + " "; }
	}
});


/////////////////////////////////////////////////////////
///////SPEECH RECOGNITION, IF AVAILABLE, CAN OMIT
/////////////////////////////
//REDEFINE NEXT 6 LINES, THAT IS IT!!!
if(typeof speech_recog_onClick_div == "undefined"){
  var speech_recog_onClick_div = document.getElementById('test_div');
  var speech_recognition_callback_on_txt_out= function(getTxtOut){ };
  //below runs a few ms after top one!
  var speech_recognition_callback_on_txt_out_delay= function(getTxtOut){};
  var SPEECH_REGONITION_USE_DELAY_CALLBACK___WAIT4 = 30; //ms
  var SPEECH_RECOGNITION_USE_DELAY_CALLBACK_ALSO = true; //if need a delay
}
/////////////////////////////
//////// LEAVE BELOW UNTOUCHED!!!
////////////////////////
var LANGUAGE = "en-US";
var SPEECH_RECOGNITION_ON = false;
var speech_recog_obj_or_null =null;
var speech_recognition_callback_on_txt_out_event_saved=null;
function speech_recog_init_or_continue(){};

// Create a new SpeechRecognition object
var speechRecognition_objfunct = (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition);

if( typeof speechRecognition_objfunct != "undefined"){

try { // see if can get running...
function speech_recog_init_or_continue( getStopOptional){
	console.log("aaaa");
    if(SPEECH_RECOGNITION_ON){
	console.log("bbb");
	if(getStopOptional){ speech_recog_obj_or_null.stop();  return; }
	if(speech_recog_obj_or_null != null){
		speech_recog_obj_or_null.stop(); 
	}else{
	  speech_recog_obj_or_null = new speechRecognition_objfunct();
	  speech_recog_obj_or_null.onstart = function(){};
	  speech_recog_obj_or_null.onend = function(){};
	
	  speech_recog_obj_or_null.continuous = true;
          //speech_recog_obj_or_null.interimResults = true;
	  speech_recog_obj_or_null.lang = LANGUAGE;
	
	  // Event listeners for the recognition
	  speech_recog_obj_or_null.onresult = function(event){
	   speech_recog_obj_or_null.stop();//continued in speaking callback
	   speech_recognition_callback_on_txt_out(
		event.results[ event.results.length -1][0].transcript);
	    speech_recognition_callback_on_txt_out_event_saved = 
	       event.results[ event.results.length -1][0].transcript;
	   if(SPEECH_RECOGNITION_USE_DELAY_CALLBACK_ALSO){
	      setTimeout( function(){
		speech_recognition_callback_on_txt_out_delay(
		    speech_recognition_callback_on_txt_out_event_saved);},
	   	SPEECH_REGONITION_USE_DELAY_CALLBACK___WAIT4); }
	  };
	}
	speech_recog_obj_or_null.start();		
	

	
   }
}
	// Event listeners for the start and end of the recognition
	speech_recog_onClick_div.onclick =  function(){
		console.log(1231231223242342343)
		if(SPEECH_RECOGNITION_ON){SPEECH_RECOGNITION_ON=0;
		 prompt("speech recognition OFF(press again to turn on)");
		 speech_recog_obj_or_null.stop();
		}else{SPEECH_RECOGNITION_ON=1;
		 prompt("speech recognition ON(press again to turn off)");
			speech_recog_init_or_continue(); } };
	
}catch (e) {}
}else{ speech_recog_onClick_div.onclick =  function(){
	prompt("failed to settup speechRecognition... wrong browser?");}; }


