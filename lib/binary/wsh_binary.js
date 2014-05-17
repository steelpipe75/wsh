var WSH_BINARY = {};

WSH_BINARY.Readfile2Array = (function(filename){

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

});

WSH_BINARY.WritefileFromArray = (function(filename,i_array){

  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var tname = objFS.GetTempName();

  var stream = objFS.CreateTextFile(tname);

  for(var i = 0; i < i_array.length; i++){
    stream.Write( ("00"+ i_array[i].toString(16)).slice(-2) );
  }

  stream.Close();

  var WshShell = new ActiveXObject("WScript.Shell");

  var command = "cmd.exe /v:on /s /c \"" + txt2bin_exe_path + " " +
                 tname + " "+ filename + " & exit /b !ERRORLEVEL!\"";

  WshShell.Run(command, 8, true);

  objFS.DeleteFile(tname);

});

