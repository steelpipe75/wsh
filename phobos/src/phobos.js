var s = "";

(function(){
  if(WScript.arguments.length !== 1){
    WScript.echo("Command Line Argument Error");
    WScript.exit(1);
  }
})();

s = (function(filename){
  var str = "";
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var InputStream = fso.OpenTextFile(filename);
  if(InputStream.AtEndOfStream === false){
    str = InputStream.ReadAll();
    // WScript.echo(str);
  }
  InputStream.Close();
  return str;
})(WScript.arguments.Item(0));

// WScript.echo(s);

s = (function(InputStr,StartStr,EndStr){
  var mode = 0;
  var InputArray = InputStr.split("\r\n");
  var max = InputArray.length;
  var OutputArray = [];
  for(var i = 0; i < max; i++){
    switch(mode){
      case 0:
        if(InputArray[i].search(StartStr) !== -1){
          mode = 1;
        }
        break;
      case 1:
        if(InputArray[i].search(EndStr) !== -1){
          mode = 2;
        }else{
          if(InputArray[i].search("#") !== -1){
            OutputArray.push( InputArray[i] );
          }
        }
        break;
      case 2:
      default:
        break;
    }
  }
  return OutputArray.join("\r\n");
})(s,"StartComment","EndComment");

WScript.echo(s);
