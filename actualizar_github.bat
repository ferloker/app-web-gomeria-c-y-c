@echo off
echo.
echo ==============================================
echo   Sincronizando cambios de Gomeria C y C...
echo ==============================================
echo.

echo [1/3] Preparando archivos...
git add .
echo.

echo [2/3] Creando registro de actualizacion...
git commit -m "Actualizacion del panel y codigo base"
echo.

echo [3/3] Subiendo a la nube (GitHub)...
git push origin master
echo.

echo ==============================================
echo   ¡CARGA COMPLETADA CON EXITO!
echo ==============================================
echo.
pause
