@echo off
echo.
echo ==== CRIMSON VS - Deploy GitHub Pages ====
echo.

cd /d "%~dp0"

echo [1/4] Inicializando git...
if exist ".git\index.lock" del /f ".git\index.lock"
if not exist ".git" (
    git init
    git config user.email "deploy@crimsonvs.local"
    git config user.name "Crimson VS"
)

echo [2/4] Configurando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Necroslayer/Crimson-VS.git

echo [3/4] Adicionando apenas os arquivos atualizaveis...
git add -f index.html
git add -f app.js
git add -f imgs.js
git add -f sw.js
git add -f manifest.json
git add -f icon-192.png
git add -f icon-512.png
git add -f Theme.mp3
git add -f README.md
git add -f deploy.bat
git add -f .gitignore
git rm --cached netlify.toml >nul 2>&1
git commit -m "deploy: Crimson VS - PWA build" 2>nul || git commit --allow-empty -m "deploy: Crimson VS - rebuild"

echo [4/4] Push para GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ================================================
echo  Pronto! GitHub Pages atualiza em ~1-2 minutos.
echo  https://github.com/Necroslayer/Crimson-VS
echo ================================================
pause
