# PM2 GUI

## Demo
[![Watch the video](https://img.youtube.com/vi/mQ3gARFE5_0/hqdefault.jpg)](https://www.youtube.com/watch?v=mQ3gARFE5_0)

## How to usage
- Clone repo:
  ```
  git clone https://github.com/trgianghuynh1808/pm2-gui.git
  ```
- Install PM2 package as global:
  ```
  npm install pm2@latest -g
  ```
- Create `ecosystem.json` file in folder we need to run.
- CD `pm2-gui` repo
- Create `.env` file based on `.env.example`.
- Install packages
  ```
  npm install
  ```
- Run repo
  ```
  npm run dev
  ```
  
## Config PM2 log-rotate
Flush logs file with rotate by node-schedule
- Install module
```
pm2 install pm2-logrotate
```
- Set config
```
// set force rotate when over 8MB limit
pm2 set pm2-logrotate:max_size 8M

// limit log files
pm2 set pm2-logrotate:retain 20

// rotate job when every hour
pm2 set pm2-logrotate:rotateInterval '0 */1 * * *'
```

- More details about config: [pm2-logrotate](https://www.npmjs.com/package/pm2-logrotate)
  
## Features
* Manage Process info
* Start/Restart/Stop/Remove Process
* Sync process status with Long Polling
* Update PM2 Config
* Console real-time
