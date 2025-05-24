#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC="$SCRIPT_DIR/../auth-localization.ts"
DST="$SCRIPT_DIR/jsons/en.json"

awk '
NR==1 { print "{"; next }
# Remove everything after /** on the line (JSDoc)
{ sub(/\/\*\*.*/, ""); }
# Skip empty lines
/^\s*$/ { next }
# Skip lines that are only the end of a block comment
/^[ \t]*\*\// { next }
# Skip export lines
/^[ \t]*export/ { next }
# Enclose key names in double quotes before the colon
/^([ \t]*)([a-zA-Z0-9_]+)[ \t]*:/ {
  key = gensub(/^([ \t]*)([a-zA-Z0-9_]+)[ \t]*:.*/, "\\2", "g", $0);
  sub(/^([ \t]*)([a-zA-Z0-9_]+)[ \t]*:/, "\"" key "\":");
}
# Remove trailing comma before closing brace
/^[ \t]*}[ \t]*$/ { sub(/,[ \t]*$/, ""); }
{ print }
' "$SRC" > "$DST"
