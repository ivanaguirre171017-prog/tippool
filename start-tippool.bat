@echo off
echo ==========================================
echo       INICIANDO SISTEMA TIPPOOL
echo ==========================================

echo [1/2] Iniciando Backend...
start "TipPool Backend" cmd /k "cd tippool-backend && npm run dev"

echo [2/2] Iniciando Frontend (Modo Tunel)...
echo NOTA: Expo Go puede tardar un poco en conectar via Tunel. 
echo Si tienes problemas, asegurate de que backend y celular esten en la misma red
echo y que el firewall no bloquee conexiones.
echo.
timeout /t 5
start "TipPool App" cmd /k "cd tippool-app && npx expo start --tunnel"

echo.
echo Todo listo!
echo 1. Backend corriendo en: http://localhost:5000
echo 2. Frontend configurado apuntando a: http://192.168.1.64:5000/api
echo 3. Escanea el codigo QR en la ventana de Expo para iniciar.
echo.
pause
