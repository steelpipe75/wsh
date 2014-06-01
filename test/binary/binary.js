(function(){
  var data = []

  for(var i = 0; i < 256; i++){
    data.push(i);
  }

  WSH_BINARY.WritefileFromArray("test.dat", data);

  var a = WSH_BINARY.Readfile2Array("test.dat");

  for(var j = 0; j < a.length; j++){
    WScript.Echo( a[j] );
  }

})();

