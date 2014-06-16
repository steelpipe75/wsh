var Barlog = {};

// command line argument
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
              , ["convert", "convert.json"]
            ];

  for(var i = 0; i < options.length; i++){
    opt[options[i][0]] = optGet(objArgs, options[i][0], options[i][1]);
  }

//  WScript.Echo( "opt = " + JSON.stringify(opt) );

  Barlog.option = opt;
})();

WScript.Echo("inputfile\t= \""    + Barlog.option.input   + "\"");
WScript.Echo("outputfile\t= \""   + Barlog.option.output  + "\"");
WScript.Echo("convertfile\t= \""  + Barlog.option.convert + "\"");

