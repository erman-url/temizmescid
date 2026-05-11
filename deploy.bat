@echo off
setlocal enabledelayedexpansion

title TemizMescid Deploy

set REPO_BRANCH=main
set VERSION_FILE=version.txt

echo =====================================
echo TEMIZMESCID DEPLOY
echo =====================================

git add .

git diff --cached --quiet

if %errorlevel%==0 (
    echo Degisiklik bulunamadi
    pause
    exit
)

if not exist %VERSION_FILE% (
    echo 1.0.0 > %VERSION_FILE%
)

set /p version=<%VERSION_FILE%

for /f "tokens=1-3 delims=." %%a in ("%version%") do (
    set major=%%a
    set minor=%%b
    set patch=%%c
)

set /a patch+=1

set newVersion=%major%.%minor%.%patch%

echo %newVersion% > %VERSION_FILE%

node --check app.js

if %errorlevel% neq 0 (
    echo JS syntax hatasi bulundu
    pause
    exit
)

git add .

git commit -m "Deploy v%newVersion%"

git pull origin %REPO_BRANCH% --rebase

if %errorlevel% neq 0 (
    echo Pull/Rebase hatasi
    pause
    exit
)

git push origin %REPO_BRANCH%

if %errorlevel% neq 0 (
    echo Push hatasi
    pause
    exit
)

echo.
echo =====================================
echo DEPLOY BASARILI
echo Version: v%newVersion%
echo =====================================

start https://temizmescid.com.tr

pause