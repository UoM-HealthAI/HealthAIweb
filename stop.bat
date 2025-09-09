@echo off
echo ========================================
echo HealthAI Web 서비스 중지
echo ========================================
echo.

echo 서비스 중지 중...
docker-compose down

echo.
echo 모든 컨테이너가 중지되었습니다.
echo.
pause

