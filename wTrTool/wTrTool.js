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

a = (function(filename){

  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var tname = objFS.GetTempName();

  var WshShell = new ActiveXObject("WScript.Shell");

  var command = "cmd.exe /v:on /s /c \"" + bin2txt_exe_path + " " +
                 filename + " "+ tname + " & exit /b !ERRORLEVEL!\"";

  WshShell.Run(command, 8, true);

  var stream = objFS.OpenTextFile(tname, 1, false, -2);
  var binary_txt = stream.ReadAll();
  stream.Close();
  objFS.DeleteFile(tname);

  var binary_array = _.without(binary_txt.split("\r\n").join(" ").split(" "), "");

  var binary = [];
  var item;
  var max = binary_array.length;
  for(var i = 0; i < max; i++){
    item = "0x" + binary_array[i];
//    WScript.Echo( item + " = " + Number(item) );
    binary.push( Number(item) );
  }

//  WScript.Echo( JSON.stringify(binary_array) );
//  WScript.Echo( JSON.stringify(binary) );

  return binary;

})(Option.input);

WScript.Echo( JSON.stringify(a) );
