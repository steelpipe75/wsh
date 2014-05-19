#!/usr/bin/ruby -Ku

require 'pp'
require 'json'
require 'yaml'

unless ARGV.size == 2 then
  puts "Usage: yaml2json in_file out_file"
  exit 1
end

data = YAML.load_file(ARGV[0])
File.open(ARGV[1],'w'){ |f|
  f.write JSON.pretty_generate(data).encode("Shift_JIS")
}
