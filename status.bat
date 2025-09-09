@echo off
echo ========================================
echo HealthAI Web 서비스 상태 확인
echo ========================================
echo.

echo 1. 실행 중인 컨테이너:
docker-compose ps

echo.
echo 2. 네트워크 정보:
ipconfig | findstr "IPv4"

echo.
echo 3. 도커 네트워크:
docker network ls

echo.
echo 4. 서비스 로그 (최근 10줄):
docker-compose logs --tail=10

echo.
pause

