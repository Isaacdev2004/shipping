@echo off
cd /d "%~dp0"
echo Starting Shipping Backend Server...
echo.
echo Make sure no other server is running on port 8000!
echo.
call ..\venv\Scripts\activate.bat
python manage.py runserver
pause
