(function f_uint8(data){
  var num;
  
  num = data.shift();
  
  return num;
});

(function f_uint16(data){
  var num;
  
  num = data.shift();
  num += Math.pow(2, 8) * data.shift();
  
  return num;
});

(function f_uint32(data){
  var num;
  
  num = data.shift();
  num += Math.pow(2, 8) * data.shift();
  num += Math.pow(2, 16) * data.shift();
  num += Math.pow(2, 24) * data.shift();
  
  return num;
});

(function f_sint8(data){
  var num;
  
  num = f_uint8(data);
  
  if(num > (Math.pow(2, 7) - 1)){
    num = num - Math.pow(2, 8);
  }
  
  return num;
});

(function f_sint16(data){
  var num;
  
  num = f_uint16(data);
  
  if(num > (Math.pow(2, 15) - 1)){
    num = num - Math.pow(2, 16);
  }
  
  return num;
});

(function f_sint32(data){
  var num;
  
  num = f_uint32(data);
  
  if(num > (Math.pow(2, 31) - 1)){
    num = num - Math.pow(2, 32);
  }
  
  return num;
});

(function f_hex8(data){
  var num;
  
  num = f_uint8(data);
  
  return "0x" + ("00"+ num.toString(16)).slice(-2);
});

(function f_hex16(data){
  var num;
  
  num = f_uint16(data);
  
  return "0x" + ("0000"+ num.toString(16)).slice(-4);
});

(function f_hex32(data){
  var num;
  
  num = f_uint32(data);
  
  return "0x" + ("00000000"+ num.toString(16)).slice(-8);
});

(function f_bit8(data){
  var num;
  
  num = f_uint8(data);
  
  return "b" + num.toString(2);
});

(function f_bit16(data){
  var num;
  
  num = f_uint16(data);
  
  return "b" + num.toString(2);
});

(function f_bit32(data){
  var num;
  
  num = f_uint32(data);
  
  return "b" + num.toString(2);
});

(function f_oct8(data){
  var num;
  
  num = f_uint8(data);
  
  return "0" + num.toString(8);
});

(function f_oct16(data){
  var num;
  
  num = f_uint16(data);
  
  return "0" + num.toString(8);
});

(function f_oct32(data){
  var num;
  
  num = f_uint32(data);
  
  return "0" + num.toString(8);
});

(function f_dummy8(data){
  f_uint8(data);
  
  return null;
});

(function f_dummy16(data){
  f_uint16(data);
  
  return null;
});

(function f_dummy32(data){
  f_uint32(data);
  
  return null;
});

var FORMAT_TYPE = [
   { "type" : "UINT8"   , "size" : 1, "func" : f_uint8   }
  ,{ "type" : "UINT16"  , "size" : 2, "func" : f_uint16  }
  ,{ "type" : "UINT32"  , "size" : 4, "func" : f_uint32  }
  ,{ "type" : "SINT8"   , "size" : 1, "func" : f_sint8   }
  ,{ "type" : "SINT16"  , "size" : 2, "func" : f_sint16  }
  ,{ "type" : "SINT32"  , "size" : 4, "func" : f_sint32  }
  ,{ "type" : "HEX8"    , "size" : 1, "func" : f_hex8    }
  ,{ "type" : "HEX16"   , "size" : 2, "func" : f_hex16   }
  ,{ "type" : "HEX32"   , "size" : 4, "func" : f_hex32   }
  ,{ "type" : "BIT8"    , "size" : 1, "func" : f_bit8    }
  ,{ "type" : "BIT16"   , "size" : 2, "func" : f_bit16   }
  ,{ "type" : "BIT32"   , "size" : 4, "func" : f_bit32   }
  ,{ "type" : "OCT8"    , "size" : 1, "func" : f_oct8    }
  ,{ "type" : "OCT16"   , "size" : 2, "func" : f_oct16   }
  ,{ "type" : "OCT32"   , "size" : 4, "func" : f_oct32   }
  ,{ "type" : "DUMMY8"  , "size" : 1, "func" : f_dummy8  }
  ,{ "type" : "DUMMY16" , "size" : 2, "func" : f_dummy16 }
  ,{ "type" : "DUMMY32" , "size" : 4, "func" : f_dummy32 }
];

var wTrTool = {};

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
                ["input",   "input.dat"]
              , ["output",  "output.csv"]
              , ["format",  "format.json"]
              , ["pattern", "sample"]
              , ["endian",  true]
            ];

  for(var i = 0; i < options.length; i++){
    opt[options[i][0]] = optGet(objArgs, options[i][0], options[i][1]);
  }

//  WScript.Echo( "opt = " + JSON.stringify(opt) );

  wTrTool.option = opt;
})();

// pattern select
(function(){

  var objFS = new ActiveXObject("Scripting.FileSystemObject");

  var format_stream = objFS.OpenTextFile(wTrTool.option.format, 1, false, -2);
  var format_txt = format_stream.ReadAll();
  var formats = JSON.parse(format_txt);
  var pattern = null;

  for(var i = 0; i < formats.length; i++){
    if(formats[i].patternname === wTrTool.option.pattern){
      pattern = formats[i];
      break;
    }
  }

  if(pattern === null){
    WScript.Echo( "Error: pattern not found" );
    WScript.Quit(-1);
  }

  wTrTool.pattern = pattern;

})();

// format preproc
(function(){
  var format = [];
  var prefix = "";
  var suffix = "";

  (function format_convert(format, pattern, prefix, suffix){
    for(var i = 0; i < pattern.length; i++){
      if("union" in pattern[i]){
        // WScript.Echo( "union" );
        var union_obj = {};
        union_obj.label = pattern[i].label;
        union_obj.union = [];
        for(var k = 0; k < pattern[i].union.length; k++){
          var tbl = [];
          var union_prefix_top = "";
          var union_prefix_bottom = "";
          if(prefix === ""){
            union_prefix_top = "";
          }else{
            union_prefix_top = prefix + ".";
          }
          union_prefix_bottom = pattern[i].label + "." + pattern[i].union[k].label + ".";
          format_convert(tbl, pattern[i].union[k].format, union_prefix_top + union_prefix_bottom, suffix);
          union_obj.union.push( tbl );
        }
        format.push(union_obj);
      }else if("array" in pattern[i]){
        // WScript.Echo( "array" );
        for(var j = 0; j < pattern[i].array.num; j++){
          var array_suffix = "[" + j + "]";
          var array_prefix = "";
          if(prefix === ""){
            array_prefix = pattern[i].label;
          }else{
            array_prefix = prefix + suffix + "." + pattern[i].label;
          }
          format_convert(format, pattern[i].array.format, array_prefix, array_suffix);
        }
      }else{
        // WScript.Echo( "member" );
        var obj = {};
        obj.type = pattern[i].type;
        if(suffix === ""){
          obj.label = prefix + pattern[i].label;
        }else{
          if(pattern[i].label === ""){
            obj.label = prefix + suffix;
          }else{
            obj.label = prefix + suffix + "." + pattern[i].label;
          }
        }
        format.push(obj);
      }
    }
  })(format, wTrTool.pattern.format, prefix, suffix);

  wTrTool.format = format;
})();

// input file read
(function(){

  var a = WSH_BINARY.Readfile2Array(wTrTool.option.input);

  wTrTool.binarys = a;

})();

debugPrint = (function(){
  WScript.Echo( JSON.stringify(wTrTool.pattern) );
  WScript.Echo( "========================================================================" );
  WScript.Echo( JSON.stringify(wTrTool.binarys) );
  WScript.Echo( "========================================================================" );
  WScript.Echo( JSON.stringify(wTrTool.format) );
  WScript.Echo( "========================================================================" );
});
// debugPrint();

// output
(function(){
  var top = [];
  var binarys = wTrTool.binarys;

  (function make_header_str(header,format){
    // WScript.Echo( JSON.stringify( format ) );
    
    if("type" in format){
      if(format.type.search("DUMMY") === -1){
        header.push(format.label);
      }
    }else{
      for(var i = 0; i < format.length; i++){
        if("union" in format[i]){
          // WScript.Echo( "union" );
          make_header_str(header, format[i].union);
        }else if("type" in format[i]){
          make_header_str(header, format[i]);
        }else{
          for(var j = 0; j < format[i].length; j++){
            make_header_str(header, format[i][j]);
          }
        }
      }
    }
  })(top, wTrTool.format);

  WScript.Echo( JSON.stringify(top) );
  WScript.Echo( "------------------------------------------------------------------------" );

  while(binarys.length > 0){
    var data = [];
    
    binarys = (function make_convert_str(str, tbl, format){
      if(tbl.length !== 0){
        if("union" in format){
          //@TODO
          var union_tbl = JSON.parse( JSON.stringify( tbl ) );
          var min_tbl = JSON.parse( JSON.stringify( tbl ) );
          for(var j = 0; j < format.union.length; j++){
            var temp_tbl = JSON.parse( JSON.stringify( union_tbl ) );
            temp_tbl = make_convert_str(str, temp_tbl, format.union[j]);
            if(min_tbl.length > temp_tbl.length){
              min_tbl = JSON.parse( JSON.stringify( temp_tbl ) );
            }
          }
          tbl = JSON.parse( JSON.stringify( min_tbl ) );
        }else if("label" in format){
          var flg = true;
          for(var k = 0; k < FORMAT_TYPE.length; k++){
            if(FORMAT_TYPE[k].type === format.type){
              var bytes = [];
              flg = false;
              for(var l = 0; l < FORMAT_TYPE[k].size; l++){
                if(tbl.length != 0){
                  bytes.push(tbl.shift());
                }
              }
              if(bytes.length === FORMAT_TYPE[k].size){
                var ret;
                ret = FORMAT_TYPE[k].func(bytes);
                if(ret !== null){
                  str.push(ret);
                }
              }
            }
          }
          if(flg){
            WScript.Echo("Error : invalid type");
            WScript.Quit(-1);
          }
        }else{
          for(var i = 0; i < format.length; i++){
            tbl = make_convert_str(str, tbl, format[i]);
          }
        }
      }
      
      return tbl;
    })(data, binarys, wTrTool.format);
    
    WScript.Echo( JSON.stringify(data) );
  }

})();

