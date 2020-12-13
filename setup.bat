@echo off
cls
pushd "%~dp0"
python ./config/setup.py

:choice
set /P c=Do you want to run your new discord bot now[Y/N]?
if /I "%c%" EQU "Y" goto :runningthebot
if /I "%c%" EQU "N" goto :notrunningbot
goto :choice

:runningthebot
cls
echo Great, well in that case, let me be the first to welcome you to baby-bot 2.0
node ./src/bot.js

:notrunningbot
echo Well your new discord bot is ready and waiting for whenever you're ready, or just use the run.bat file
pause
exit