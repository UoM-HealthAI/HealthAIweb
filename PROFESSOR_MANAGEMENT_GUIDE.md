# ??? HealthAI Web - 교수님 관리 가이드

## ? 초기 설정

### 1. 도커 설치
- **Docker Desktop**: https://www.docker.com/products/docker-desktop
- Windows 11에서는 WSL 2 설정 필요할 수 있음

### 2. 프로젝트 다운로드
```bash
git clone [프로젝트URL]
cd HealthAIweb
```

## ? 배포 방법

### 방법 1: 자동 스크립트 사용 (권장)
```bash
# 배포 시작
deploy.bat

# 서비스 중지
stop.bat

# 상태 확인
status.bat
```

### 방법 2: 수동 명령어
```bash
# 이미지 빌드
docker-compose build

# 서비스 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 로그 확인
docker-compose logs -f
```

## ? 네트워크 설정

### 1. IP 주소 확인
```bash
ipconfig | findstr "IPv4"
```

### 2. 방화벽 설정
Windows 방화벽에서 다음 포트 허용:
- **3000**: 프론트엔드
- **8000**: 백엔드 API
- **7862**: 데모 서비스

### 3. 학생들에게 공유할 정보
```
웹사이트 주소: http://[당신의IP]:3000
API 서버: http://[당신의IP]:8000
데모 서비스: http://[당신의IP]:7862
```

## ? 문제 해결

### 서비스가 시작되지 않을 때
1. **도커 상태 확인**: Docker Desktop이 실행 중인지 확인
2. **포트 충돌 확인**: 다른 프로그램이 같은 포트를 사용하고 있는지 확인
3. **로그 확인**: `docker-compose logs [서비스명]`

### 학생들이 접속하지 못할 때
1. **네트워크 확인**: 같은 Wi-Fi에 연결되어 있는지 확인
2. **방화벽 확인**: Windows 방화벽 설정 확인
3. **서비스 상태 확인**: `docker-compose ps`

## ? 모니터링

### 서비스 상태 확인
```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 리소스 사용량 확인
docker stats

# 로그 실시간 확인
docker-compose logs -f
```

### 백업 및 복구
```bash
# 데이터 백업
docker-compose exec backend tar -czf /app/backup.tar.gz /app/uploads /app/outputs

# 백업 복구
docker-compose exec backend tar -xzf /app/backup.tar.gz -C /app/
```

## ? 업데이트

### 코드 업데이트
```bash
# 최신 코드 가져오기
git pull origin main

# 도커 이미지 재빌드
docker-compose build --no-cache

# 서비스 재시작
docker-compose up -d
```

### 의존성 업데이트
```bash
# 백엔드 의존성 업데이트
docker-compose exec backend pip install -r requirements.txt --upgrade

# 프론트엔드 의존성 업데이트
docker-compose exec frontend npm update
```

## ? 학생 지원

### 1. 사용 설명서 제공
- `LAB_USAGE_GUIDE.md` 파일을 학생들에게 공유
- 접속 주소와 기본 사용법 안내

### 2. 문제 해결 지원
- 네트워크 연결 문제
- 기능 사용법 문의
- 오류 메시지 해석

### 3. 정기 점검
- 주 1회 서비스 상태 확인
- 학생 피드백 수집
- 성능 모니터링

## ? 성공적인 운영을 위한 팁

1. **정기 백업**: 중요한 데이터는 주기적으로 백업
2. **모니터링**: 서비스 상태를 지속적으로 모니터링
3. **학생 교육**: 기본적인 사용법을 미리 교육
4. **문서화**: 문제 해결 과정을 문서화하여 재사용
5. **커뮤니케이션**: 학생들과 정기적으로 소통하여 개선점 파악



