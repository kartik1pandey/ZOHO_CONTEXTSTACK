@echo off
REM ContextStack - Push to GitHub Script (Windows)

echo.
echo ========================================
echo   ContextStack - Push to GitHub
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo [*] Initializing git repository...
    git init
    echo [+] Git initialized
) else (
    echo [+] Git repository already initialized
)

REM Check if .gitignore exists
if not exist ".gitignore" (
    echo [!] Warning: .gitignore not found!
) else (
    echo [+] .gitignore found
)

REM Add all files
echo.
echo [*] Adding files to git...
git add .

REM Show status
echo.
echo [*] Git status:
git status --short

REM Commit
echo.
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Initial commit: ContextStack application

git commit -m "%commit_msg%"
echo [+] Files committed

REM Set main branch
echo.
echo [*] Setting main branch...
git branch -M main

REM Add remote
echo.
set /p repo_url="Enter your GitHub repository URL: "

if "%repo_url%"=="" (
    echo [!] Error: Repository URL is required
    pause
    exit /b 1
)

REM Check if remote already exists
git remote | findstr "origin" >nul
if %errorlevel%==0 (
    echo [*] Remote 'origin' already exists, updating...
    git remote set-url origin "%repo_url%"
) else (
    echo [*] Adding remote 'origin'...
    git remote add origin "%repo_url%"
)

echo [+] Remote added: %repo_url%

REM Push to GitHub
echo.
echo [*] Pushing to GitHub...
git push -u origin main

if %errorlevel%==0 (
    echo.
    echo ========================================
    echo [+] Successfully pushed to GitHub!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Go to your GitHub repository
    echo 2. Follow DEPLOYMENT.md for deployment
    echo 3. Deploy to Render, Railway, or Vercel
    echo.
    echo Your code is now on GitHub!
    echo.
) else (
    echo.
    echo [!] Error pushing to GitHub
    echo Please check your repository URL and try again
    pause
    exit /b 1
)

pause
