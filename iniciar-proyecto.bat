@echo off
title Iniciando Red-Social-Empresa...

:: Iniciar MongoDB
start cmd.exe /k "cd /d C:\Program Files\MongoDB\Server\8.0\bin && mongod.exe"

:: Esperar unos segundos para que MongoDB arranque
timeout /t 5 > nul

:: Iniciar backend
start cmd.exe /k "cd /d C:\proyectos\www\Red-Social-Empresa\backend && npm run dev"

:: Aquí puedes descomentar esto si luego agregas el frontend:
:: start cmd.exe /k "cd /d C:\proyectos\www\Red-Social-Empresa\frontend && npm run dev"

exit
