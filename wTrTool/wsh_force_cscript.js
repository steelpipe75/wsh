(function(){
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var HostName;

  HostName = fso.GetFileName( WScript.FullName.toLowerCase() );

//  WScript.Echo(WScript.FullName);
//  WScript.Echo(HostName);

  if(HostName === "wscript.exe"){
    WScript.Echo( "please this script run on cscript!!" );
    WScript.Echo( "Usage : cscript " + WScript.ScriptName );
    WScript.Quit(1);
  }

})();
