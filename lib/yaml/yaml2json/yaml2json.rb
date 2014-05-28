#!/usr/bin/ruby -Ku

require 'pp'
require 'json'
require 'yaml'

unless (ARGV.size == 2) || (ARGV.size == 3 && ARGV[2] == "tab") then
  puts "Usage: yaml2json in_file out_file [tab]"
  exit 1
end

txt = File.read(ARGV[0])
if ARGV[2] == "tab" then
  yaml = ""
  txt.each_line do |line|
    while /\t+/ =~ line
      n = $&.size * 2 - $`.size % 2
      line.sub!(/\t+/, " " * n)
    end
    yaml << line
  end
  txt = yaml
end
data = YAML.load(txt)
File.open(ARGV[1],'w'){ |f|
  f.write JSON.pretty_generate(data).encode("Shift_JIS")
}
