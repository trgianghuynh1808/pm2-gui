# PM2 GUI

## Demo
[![Watch the video](https://img.youtube.com/vi/9zUQqnCJV_A/hqdefault.jpg)](https://www.youtube.com/watch?v=9zUQqnCJV_A)

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
- Create `.env` file based on `.env.example`.
- CD `pm2-gui` repo
- Install packages
  ```
  npm install
  ```
- Run repo
  ```
  npm run dev
  ```
  
## Features
* Manage Process info
* Start/Restart/Stop/Remove Process
* Sync process status with Long Polling
* Update PM2 Config
* Console real-time
