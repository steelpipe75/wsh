var Option = new Object;

/* command line argument */
(function(){

  var objArgs = WScript.Arguments;

  optGet = (function(objArgs, key , default_value){
    if(objArgs.Named.Exists(key)){
      return objArgs.Named.Item(key);
    }else{
      return default_value;
    }
  });

  var opt = [
                /* key,     default_value */
                ["input",   "input.dat"]
              , ["output",  "output.csv"]
              , ["format",  "format.json"]
              , ["pattern", "sample"]
              , ["endian",  true]
            ];

  for(var i = 0; i < opt.length; i++){
    Option[opt[i][0]] = optGet(objArgs, opt[i][0], opt[i][1]);
  }

  WScript.Echo( "Option = " + JSON.stringify(Option) );

})();
