@echo off
setlocal enabledelayedexpansion

title TemizMescid Deploy

set REPO_BRANCH=main
set VERSION_FILE=version.txt

echo =====================================
echo TEMIZMESCID DEPLOY
echo =====================================

REM =====================================
REM GIT STATUS
REM =====================================

git status

REM =====================================
REM VERSION SYSTEM
REM =====================================

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

echo.
echo Yeni Version:
echo v%newVersion%

REM =====================================
REM PULL FIRST
REM =====================================

echo.
echo Remote kontrol ediliyor...

git pull origin %REPO_BRANCH% --rebase

if %errorlevel% neq 0 (
    echo.
    echo REBASE HATASI
    pause
    exit
)

REM =====================================
REM JS CHECK
REM =====================================

echo.
echo JS syntax kontrol...

node --check app.js

if %errorlevel% neq 0 (
    echo.
    echo JS syntax hatasi bulundu
    pause
    exit
)

REM =====================================
REM HTML CHECK
REM =====================================

echo.
echo HTML kontrol...

findstr /C:"data-key=\"wet_floor\"" index.html >nul

if %errorlevel% neq 0 (
    echo.
    echo Kritik HTML kontrol hatasi
    pause
    exit
)

REM =====================================
REM CHANGES CHECK
REM =====================================

git add .

git diff --cached --quiet

if %errorlevel%==0 (
    echo.
    echo Degisiklik bulunamadi
    pause
    exit
)

REM =====================================
REM VERSION WRITE
REM =====================================

echo %newVersion% > %VERSION_FILE%

git add .

REM =====================================
REM COMMIT
REM =====================================

git commit -m "Deploy v%newVersion%"

if %errorlevel% neq 0 (
    echo.
    echo Commit hatasi
    pause
    exit
)

REM =====================================
REM PUSH
REM =====================================

git push origin %REPO_BRANCH%

if %errorlevel% neq 0 (
    echo.
    echo Push hatasi
    pause
    exit
)

REM =====================================
REM SUCCESS
REM =====================================

cls

echo =====================================
echo DEPLOY BASARILI
echo =====================================
echo.
echo Version : v%newVersion%
echo Branch  : %REPO_BRANCH%
echo.
echo Cache temizlemeyi unutma:
echo Cloudflare > Purge Everything
echo =====================================

start https://temizmescid.com.tr?v=%newVersion%

pause