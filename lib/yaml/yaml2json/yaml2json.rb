#!/usr/bin/ruby -Ku

require 'pp'
require 'json'
require 'yaml'

unless (ARGV.size == 2) || (ARGV.size == 3 && ARGV[2].index("tab:") == 0) then
  puts "Usage: yaml2json in_file out_file [tab:n]"
  exit 1
end

txt = File.read(ARGV[0])
if (ARGV.size == 3 && ARGV[2].index("tab:") == 0) then
  num = ARGV[2][4..ARGV[2].length].to_i
  yaml = ""
  txt.each_line do |line|
    while /\t+/ =~ line
      n = $&.size * num - $`.size % num
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
