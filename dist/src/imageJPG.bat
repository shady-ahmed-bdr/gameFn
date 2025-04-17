@echo off
setlocal enabledelayedexpansion

:: Step 1: Ask for the source folder
set /p IMG_FOLDER=Enter the source folder path (with PNG files):

:: Validate folder exists
if not exist "%IMG_FOLDER%" (
    echo Folder does not exist.
    pause
    exit /b
)

:: Step 2: List PNG files in that folder
echo.
echo Available PNG files:
set i=0
for %%f in ("%IMG_FOLDER%\*.jpg") do (
    set /a i+=1
    set "file[!i!]=%%~nxf"
    echo !i!. %%~nxf
)

:: Ask user to select a file
echo.
set /p choice=Enter the number of the file to select:

:: Validate choice
if not defined file[%choice%] (
    echo Invalid selection.
    pause
    exit /b
)

set "IMG_FILE=!file[%choice%]!"

:: Step 3: Ask for destination folder
echo.
set /p DIST_FOLDER=Enter the destination src folder path:


:: Set environment variables for Node.js
set "IMG_FOLDER=%IMG_FOLDER%"
set "DIST_FOLDER=%DIST_FOLDER%"
set "IMG_FILE=%IMG_FILE%"

:: Step 4: Run Node.js
echo.
echo Running node main.js...
node --max-old-space-size=4096 app/image.js

pause
