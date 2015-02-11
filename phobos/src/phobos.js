var s = "";

// コマンドライン引数を調べる。
// 期待した数のコマンドライン引数がなければ異常終了
(function(){
  if(WScript.arguments.length !== 1){
    WScript.echo("Command Line Argument Error");
    WScript.exit(1);
  }
})();

// 引数で指定されたファイルを読み取って、中身の文字列を戻り値で返す。
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

// 第一引数で指定された文字列から、
// 第二引数、第三引数で囲われた行を抽出して、戻り値で返す。
s = (function(InputStr,StartStr,EndStr){
  var mode = 0;
  var OutputArray = [];
  var InputArray = InputStr.split("\r\n");
  var max = InputArray.length;
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
          OutputArray.push( InputArray[i] );
        }
        break;
      case 2:
      default:
        break;
    }
  }
  return OutputArray.join("\r\n");
})(s,"StartComment","EndComment");

// WScript.echo(s);

// マクロ定義の記述された行から、マクロ定義のみを抽出
s = (function(InputStr){
  var re = /^\s*#\s*define\s+/; // マクロ定義の正規表現パターン
  var OutputArray = [];
  var InputArray = InputStr.split("\r\n");
  var max = InputArray.length;
  for(var i = 0; i < max; i++){
    if(InputArray[i].search(re) !== -1){
      OutputArray.push( InputArray[i].replace(re, "") );
    }
  }
  return OutputArray.join("\r\n");
})(s);

// WScript.echo(s);

s = (function(InputStr){
  var re = /\s/;
  var OutputArray = [];
  var InputArray = InputStr.split("\r\n");
  var max = InputArray.length;
  for(var i = 0; i < max; i++){
    var obj = {};
    var idx = InputArray[i].search(re);
    obj.Identifier = InputArray[i].substr(0,idx);
    obj.TokenString = InputArray[i].substr(idx+1);
    // WScript.echo( "Identifier = \"" + obj.Identifier + "\"" );
    // WScript.echo( "TokenString = \"" + obj.TokenString + "\"" );
    OutputArray.push( obj );
  }
  return OutputArray;
})(s);

s = (function(InputArray){
  var OutputArray = [];
  while(InputArray.length > 0){
    var obj = InputArray.shift();
    try{
      var ret = eval(obj.Identifier + "=" + obj.TokenString + ";");
      obj.Value = ret;
      OutputArray.push(obj);
    }catch(e){
      InputArray.push(obj);
    }
    WScript.echo( obj.Identifier + ",\t"+ ret );
  }
  if(1){
    var max = OutputArray.length;
    for(var i = 0; i < max; i++){
      WScript.echo( "Identifier = \"" + OutputArray[i].Identifier + "\"" );
      WScript.echo( "TokenString = \"" + OutputArray[i].TokenString + "\"" );
      WScript.echo( "Value = \"" + OutputArray[i].Value + "\"" );
    }
  }
  return InputArray;
})(s);

WScript.echo( TEST_A ); // グローバル汚染
