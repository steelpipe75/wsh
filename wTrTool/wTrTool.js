var Option = new Object;

/* command line argument */
(function(){

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
    Option[options[i][0]] = optGet(objArgs, options[i][0], options[i][1]);
  }

//  WScript.Echo( "Option = " + JSON.stringify(Option) );

})();

(function(){

  var objFS = new ActiveXObject("Scripting.FileSystemObject");

  var format_stream = objFS.OpenTextFile(Option.format, 1, false, -2);
  var format_txt = format_stream.ReadAll();

  format = JSON.parse(format_txt);

  WScript.Echo( JSON.stringify( format[0] ) );

  var a = WSH_BINARY.Readfile2Array(Option.input);

  WScript.Echo( JSON.stringify(a) );

})();

