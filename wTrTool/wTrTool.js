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
  var tname = objFS.GetTempName();

  var WshShell = new ActiveXObject("WScript.Shell");

  var command = "cmd.exe /v:on /s /c \"" + bin2txt_exe_path + " " +
                 Option.input + " "+ tname + " & exit /b !ERRORLEVEL!\"";

  WshShell.Run(command, 8, true);

  var stream = objFS.OpenTextFile(tname, 1, false, -2);
  var binary = stream.ReadAll();
  stream.Close();
  objFS.DeleteFile(tname);

  var binary_array = _.without(binary.split("\r\n").join(" ").split(" "), "");

  WScript.Echo( JSON.stringify(binary_array) );

})();

