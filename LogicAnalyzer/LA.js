var LA = {};

(function(){
  LA.binRead = function( inputfile ){
    var objADODB_Stream = new ActiveXObject("ADODB.Stream");
    
    objADODB_Stream.type = 2;
    objADODB_Stream.charset = "iso-8859-1";
    objADODB_Stream.open();
    objADODB_Stream.loadFromFile( inputfile );
    var text = objADODB_Stream.readText();
    objADODB_Stream.close();
    
    var tbl = [
      0x20AC, 0x0081, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021,
      0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0x008D, 0x017D, 0x008F,
      0x0090, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
      0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0x009D, 0x017E, 0x0178,
    ];
    var tbl_len = tbl.length;
    
    var text_len = text.length;
    var str = "";
    
    var ret = [];
    
    for(var i = 0; i < text_len; i++){
      var c = text.charCodeAt(i);
      
      if((0x00 <= c) && (c <= 0xFF)){
        ret.push( c );
      }else{
        for(var j = 0; j < tbl_len; j++){
          if(tbl[j] === c){
            break;
          }
        }
        ret.push( j + 0x80 );
      }
    }
    
    return ret;
  };
  
  LA.Convert = function( binArray ){
    var binArray_len = binArray.length;
    var i = 0;
    var ret = [];
    
    if((i % 4) === 0){
      while(i < binArray_len){
        var obj = {};
        obj.ptn = binArray[i+0] + (binArray[i+1] * 0x100);
        obj.tim = binArray[i+2] + (binArray[i+3] * 0x100);
        i += 4;
        ret.push( obj );
      }
    }else{
      WScript.Echo( "err" );
    }
    return ret;
  };
})();

if(0){
  var a = LA.binRead( "test.bin" );
  
  var str ="";
  for(var i = 0; i < a.length; i++){
    str += ("00" + a[i].toString(16)).slice(-2);
    if(((i + 1) % 16) === 0){
      str += "\r\n";
    }else{
      str += " ";
    }
  }
  
  WScript.Echo( str );
}

var a = LA.binRead( "test.bin" );
var b = LA.Convert( a );

for(var i = 0; i < b.length; i++){
  var obj = b[i];
  WScript.Echo( ("0000" + obj.ptn.toString(16)).slice(-4) + "," + ("0000" + obj.tim.toString(16)).slice(-4) );
}
