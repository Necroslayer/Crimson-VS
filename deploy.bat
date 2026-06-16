@echo off
echo.
echo ==== CRIMSON VS - Deploy GitHub Pages ====
echo.

echo [1/4] Inicializando...
if exist ".git\index.lock" del /f ".git\index.lock"
git init
git config user.email "deploy@crimsonvs.com"
git config user.name "Crimson VS"

echo [2/4] Adicionando arquivos...
git add .

echo [3/4] Commit...
git commit -m "feat: Crimson VS v0.5.32 - pre-compiled JS"

echo [4/4] Push...
git remote remove origin 2>nul
git remote add origin https://github.com/Necroslayer/Crimson-VS.git
git branch -M main
git push -u origin main --force

echo.
echo ==========================================
echo App: https://necroslayer.github.io/Crimson-VS
echo ==========================================
pause
