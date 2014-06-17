var Barlog = {};

var delimiter = ",";

// command line argument
(function(){
  var opt = {};

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
                ["input",   "input.csv"]
              , ["output",  "output.csv"]
              , ["convert", "convert.json"]
            ];

  for(var i = 0; i < options.length; i++){
    opt[options[i][0]] = optGet(objArgs, options[i][0], options[i][1]);
  }

//  WScript.Echo( "opt = " + JSON.stringify(opt) );

  Barlog.option = opt;
})();

WScript.Echo("inputfile\t= \""    + Barlog.option.input   + "\"");
WScript.Echo("outputfile\t= \""   + Barlog.option.output  + "\"");
WScript.Echo("convertfile\t= \""  + Barlog.option.convert + "\"");

// file => input
var inputdata = (function(){
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var input_stream = objFS.OpenTextFile(Barlog.option.input, 1, false, -2);
  var input = input_stream.ReadAll();
  input_stream.Close();

//  WScript.Echo( input );

  return input;
})();


// input => object array
var objArray = (function(input_txt){
  var input_txt_array = input_txt.split("\r\n");
  var input = [];

  if(input_txt_array.length >= 1){
    header = input_txt_array[0].split(delimiter);
    
//    WScript.Echo( JSON.stringify(header) );
    
    for(var i = 1; i < input_txt_array.length; i++){
      if(input_txt_array[i] !== ""){
        var obj = {};
        
        for(var j = 0; j < header.length; j++){
          obj[header[j]] = (input_txt_array[i].split(delimiter))[j];
        }
        
        input.push(obj);
      }
    }
  }

//  WScript.Echo( JSON.stringify(input) );

  return input;
})(inputdata);

// object array => output
var outputdata = (function(obj){
  var output = []
  var head = [];
  for(var i in obj[0]){
    head.push( i );
  }
  output.push ( head.join(delimiter) );
  
  for(var j = 0; j < obj.length; j++){
    var data = [];
    for(var k = 0; k < head.length; k++){
      data.push(obj[j][head[k]]);
    }
    output.push ( data.join(delimiter) );
  }

//  WScript.Echo( output.join("\r\n") );

  return output.join("\r\n");
})(objArray);

// output => file
(function(output){
  var objFS = new ActiveXObject("Scripting.FileSystemObject");
  var output_stream = objFS.CreateTextFile(Barlog.option.output);
  output_stream.Write( output + "\r\n" );
  output_stream.Close();
})(outputdata);

