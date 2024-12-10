#!/usr/bin/env bash

kill $(ps aux | grep 'PM2' | awk '{print $2}') >/dev/null 2>&1

pm2 kill

pm2 -v
