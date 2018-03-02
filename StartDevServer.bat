echo Start babel, mongo and live-server
start cmd /C live-server public
start cmd /C babel src/app.js --out-file=public/scripts/app.js --presets=env,react --watch
./startMongo.bat