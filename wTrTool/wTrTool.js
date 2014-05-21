var wTrTool = {};

/* command line argument */
(function(){
  var opt = {};

  var objArgs = WScript.Arguments;

  optGet = (function(objArgs, key , default_value){
    if(objArgs.Named.Exists(key) && (objArgs.Named.Item(key) !== undefined)){
      return objArgs.Named.Item(key);
    }else{
      return default_value;
    }
  });

  var options = [
                /* key,     default_value */
                ["input",   "input.dat"]
              , ["output",  "output.csv"]
              , ["format",  "format.json"]
              , ["pattern", "sample"]
              , ["endian",  true]
            ];

  for(var i = 0; i < options.length; i++){
    opt[options[i][0]] = optGet(objArgs, options[i][0], options[i][1]);
  }

//  WScript.Echo( "opt = " + JSON.stringify(opt) );

  wTrTool.option = opt;
})();

(function(){

  var objFS = new ActiveXObject("Scripting.FileSystemObject");

  var format_stream = objFS.OpenTextFile(wTrTool.option.format, 1, false, -2);
  var format_txt = format_stream.ReadAll();
  var formats = JSON.parse(format_txt);
  var format = null;

  for(var i = 0; i < formats.length; i++){
    if(formats[i].patternname === wTrTool.option.pattern){
      format = formats[i];
      break;
    }
  }

  if(format === null){
    WScript.Echo( "Error: pattern not found" );
    WScript.Quit(-1);
  }

  wTrTool.format = format;

})();

(function(){

  var a = WSH_BINARY.Readfile2Array(wTrTool.option.input);

  wTrTool.binarys = a;

})();

WScript.Echo( JSON.stringify(wTrTool.format) );
WScript.Echo( "========================================================================" );
WScript.Echo( JSON.stringify(wTrTool.binarys) );

