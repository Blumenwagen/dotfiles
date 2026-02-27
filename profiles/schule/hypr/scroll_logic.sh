#!/bin/bash
# Only allow one scroll event every 0.2 seconds
LOCKFILE="/tmp/hypr_scroll.lock"

if [ ! -f "$LOCKFILE" ]; then
    touch "$LOCKFILE"
    hyprctl dispatch layoutmsg "move $1"
    sleep 0.4
    rm "$LOCKFILE"
fi
