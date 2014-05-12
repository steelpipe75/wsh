(function(){
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var HostName;

  HostName = fso.GetFileName( WScript.FullName.toLowerCase() );

//  WScript.Echo(WScript.FullName);
//  WScript.Echo(HostName);

  if(HostName === "wscript.exe"){

    var WshShell = new ActiveXObject("WScript.Shell");
    var strParam = "";
    for (var i = 0; i < WScript.Arguments.Count(); i++){
        strParam += " \"" + WScript.Arguments(i).replace("\"", "\"\"") + "\"";
    }
    WScript.Quit(WshShell.Run("cmd.exe /v:on /s /c \"cscript.exe //nologo \""
        + WScript.ScriptFullName + "\""
        + strParam + " & pause & exit /b !ERRORLEVEL!\"", 8, true));

if(0){
    WScript.Echo( "please this script run on cscript!!" );
    WScript.Echo( "Usage : cscript " + WScript.ScriptName );
    WScript.Quit(1);
}
  }

})();
