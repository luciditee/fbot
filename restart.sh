#!/bin/sh
kill $(ps aux | pgrep -f "fbot")
nohup node fbot.js &

