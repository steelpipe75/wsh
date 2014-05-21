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
        var tbl = [];
        union_obj.label = pattern[i].label;
        for(var k = 0; k < pattern[i].union.length; k++){
          var union_prefix_top = "";
          var union_prefix_bottom = "";
          if(prefix === ""){
            union_prefix_top = "";
          }else{
            union_prefix_top = prefix + ".";
          }
          union_prefix_bottom = pattern[i].label + "." + pattern[i].union[k].label + ".";
          format_convert(tbl, pattern[i].union[k].format, union_prefix_top + union_prefix_bottom, suffix);
        }
        union_obj.union = tbl;
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

WScript.Echo( JSON.stringify(wTrTool.pattern) );
WScript.Echo( "========================================================================" );
WScript.Echo( JSON.stringify(wTrTool.binarys) );
WScript.Echo( "========================================================================" );
WScript.Echo( JSON.stringify(wTrTool.format) );
WScript.Echo( "========================================================================" );

// output
(function(){
  var top = [];
  (function make_header_str(header,format){
    for(var i = 0; i < format.length; i++){
      if("union" in format[i]){
        make_header_str(header, format[i].union);
      }else{
        if(format[i].type.search("DUMMY") === -1){
          header.push(format[i].label);
        }
      }
    }
  })(top, wTrTool.format);

  WScript.Echo( JSON.stringify(top) );
})();

