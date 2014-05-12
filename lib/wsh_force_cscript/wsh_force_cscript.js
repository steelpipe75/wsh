(function(){
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var strHostName;

  strHostName = objFS.GetFileName( WScript.FullName.toLowerCase() );

  if(strHostName === "wscript.exe"){
    var WshShell = new ActiveXObject("WScript.Shell");
    var strParam = "";
    for (var i = 0; i < WScript.Arguments.Count(); i++){
        strParam += " \"" + WScript.Arguments(i).replace("\"", "\"\"") + "\"";
    }
    WScript.Quit(WshShell.Run("cmd.exe /v:on /s /c \"cscript.exe //nologo \""
        + WScript.ScriptFullName + "\""
        + strParam + " & pause & exit /b !ERRORLEVEL!\"", 8, true));
  }

})();
