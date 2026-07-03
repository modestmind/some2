# 데이터베이스 스키마 가이드

## 1. 테이블 정의

### `users` (회원 테이블)

```
CREATE TABLE `users` (
    `user_id`            VARCHAR(10)   NOT NULL COMMENT '회원 고유 아이디',
    `sns_provider_code`  VARCHAR(10)   NULL     COMMENT 'SNS 업체 구분 코드 (예:kakao)',
    `sns_user_key`       VARCHAR(100)  NULL     COMMENT 'SNS 회원 고유 키 (ID 트래킹용)',
    `nickname`           VARCHAR(50)   NULL     COMMENT '서비스 내 노출될 닉네임',
    `name`               VARCHAR(50)   NULL     COMMENT '회원 실명',
    `phone_number`       VARCHAR(20)   NULL     COMMENT '휴대폰 번호 (-제외 숫자만)',
    `status`             CHAR(1)       NOT NULL COMMENT '회원 상태 (코드북=Y:정상,N=탈퇴)',
    
    -- 마케팅 및 유입 경로 트래킹
    `join_channel`       VARCHAR(50)   NULL     COMMENT '가입 경로',
    `join_referer`       TEXT          NULL     COMMENT '가입 당시 HTTP Referer 주소',
    `join_device`        CHAR(1)       NULL     COMMENT '가입 기기 구분 (코드북=P:pc,M:모바일)',
    `join_ip`            VARCHAR(45)   NULL     COMMENT '가입 당시 IP 주소',
    
    -- 자산 및 포인트 관리
    `total_accum_cash`   INT           NOT NULL DEFAULT 0 COMMENT '총 누적 캐시',
    `cash_balance`       INT           NOT NULL DEFAULT 0 COMMENT '현재 캐시 잔액',
    `total_accum_point`  INT           NOT NULL DEFAULT 0 COMMENT '총 누적 포인트',
    `point_balance`      INT           NOT NULL DEFAULT 0 COMMENT '현재 포인트 잔액',
    
    -- 추천 및 앱 연동 정보
    `referrer_id`        VARCHAR(10)   NULL     COMMENT '추천인 ID',
    `is_app_installed`   CHAR(1)       NOT NULL DEFAULT 'N' COMMENT '앱 설치 여부 (Y,N)',
    `app_fcm_key`        TEXT          NULL     COMMENT '앱 푸시 발송용 FCM 토큰 키',
    
    -- 일자 데이터
    `created_at`         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '가입일',
    `last_login_at`      DATETIME      NULL     COMMENT '최종 로그인 날짜 및 시간',
    
    -- 인덱스 및 제약조건 설정
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='연애판별소 회원 기본 테이블';

create index idx_users_sns_user_key on users(sns_user_key);
create index idx_users_phone_number on users(phone_number);
create index idx_users_status on users(status);
create index idx_users_join_ip on users(join_ip);
create index idx_users_created_at on users(created_at);
```


### `saju_profiles` (사주정보 테이블)

```
CREATE TABLE `saju_profiles` (
    `saju_profile_id`    BIGINT        NOT NULL AUTO_INCREMENT COMMENT '사주정보id (PK)',
    `user_id`            VARCHAR(10)   NOT NULL COMMENT '회원 아이디 (소유자)',
    `is_self`            CHAR(1)       NOT NULL DEFAULT 'N' COMMENT '본인 여부 (Y,N)',
    `name`               VARCHAR(50)   NOT NULL COMMENT '이름 (또는 별칭/이니셜)',
    `gender`             CHAR(1)       NOT NULL COMMENT '성별 (F: 여성, M: 남성)',
    
    -- 생년월일시 및 역법 정보
    `birth_date`         DATE          NOT NULL COMMENT '생년월일 (YYYY-MM-DD)',
    `calendar_type`      CHAR(1)       NOT NULL COMMENT '역법 구분 (코드북=1: 양력, 2: 음력 평달, 3: 음력 윤달)',
    `birth_time`         TIME          NULL     COMMENT '태어난 시간 (HH:MM:SS, 모를 경우 NULL 허용)',
    
    -- 관계 및 고민사항 (연애판별소 핵심 도메인 영역)
    `relationship_type`  VARCHAR(100)   NULL     COMMENT '본인과의 관계',
    `relation_duration`  VARCHAR(100)   NULL     COMMENT '관계 기간',
    `relationship_status` TEXT          NULL     COMMENT '고민 사항 및 현재 관계 상태',
    
    -- 메타 데이터
    `created_at`         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    `updated_at`         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    
    -- 인덱스 및 제약조건 설정
    PRIMARY KEY (`saju_profile_id`),
    CONSTRAINT `fk_saju_profiles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원별 본인 및 타인 사주 정보 관리 테이블';

create index idx_saju_profiles_user_id on saju_profiles(user_id);
```


### `user_login_logs` (로그인 내역 테이블)

```
CREATE TABLE `user_login_logs` (
    `login_log_id`   BIGINT        NOT NULL AUTO_INCREMENT COMMENT '로그인 내역 일련번호 (PK)',
    `user_id`        VARCHAR(10)   NOT NULL COMMENT '회원 아이디',
    `login_ip`       VARCHAR(45)   NOT NULL COMMENT '로그인 당시 IP 주소',
    `logged_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '로그인 일자 및 시간',
    
    PRIMARY KEY (`login_log_id`),
    -- 회원 아이디 삭제시 연쇄 삭제를 원하면 CASCADE 설정
    CONSTRAINT `fk_login_logs_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원 로그인 이력 내역 테이블';
```


### `user_withdrawals` (회원 탈퇴 내역 테이블)

```
CREATE TABLE `user_withdrawals` (
    `user_id`           VARCHAR(10)   NOT NULL COMMENT '회원 아이디',
    `withdraw_status`   CHAR(1)       NOT NULL DEFAULT 'A' COMMENT '탈퇴 상태 (A: 탈퇴신청, B: 정보삭제)',
    `withdrawal_reason` TEXT          NULL     COMMENT '탈퇴 사유 (유저 서술형 피드백)',
    `request_ip`        VARCHAR(45)   NOT NULL COMMENT '탈퇴 신청 당시 IP 주소',
    `withdrawn_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '탈퇴 처리/신청 일자',
    `deleted_at`        DATETIME      NULL     COMMENT '개인정보 실제 파기 완료 일자 (status가 B로 변경된 시점)',
    
    PRIMARY KEY (`user_id`),
    -- 회원 아이디 삭제시 연쇄 삭제를 원하면 CASCADE 설정
    CONSTRAINT `fk_user_withdrawals_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원 탈퇴 및 개인정보 파기 내역 테이블';
```


### `code_groups` (코드북 그룹 정의 테이블)

```
CREATE TABLE `code_groups` (
    `code_group_id`   SMALLINT      NOT NULL COMMENT '코드북 그룹ID (PK)',
    `group_name`      VARCHAR(100)  NOT NULL COMMENT '코드북 명',
    `description`     TEXT          NULL     COMMENT '코드북 그룹 설명 및 비고',
    `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    
    PRIMARY KEY (`code_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='공통 코드북 그룹 정의 마스터 테이블';
```


### `code_details` (코드북 그룹별 코드 테이블)

```
CREATE TABLE `code_details` (
    `code_group_id`   SMALLINT      NOT NULL COMMENT '코드북 그룹ID',
    `code_key`        VARCHAR(20)   NOT NULL COMMENT '코드 키',
    `code_name`       VARCHAR(80)   NOT NULL COMMENT '코드 명',
    `code_sub_type`   VARCHAR(40)   NULL     COMMENT '코드 키 소분류 (서브 카테고리용)',
    `sort_order`      INT           NULL     DEFAULT 1 COMMENT '화면 노출 정렬 순번',
    `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    
    -- 요청사항 반영: 복합 기본키(Composite Primary Key) 설정
    PRIMARY KEY (`code_group_id`, `code_key`),
    -- 마스터 그룹 삭제 시 하위 세부 코드도 자동 연쇄 삭제되도록 외래키 설정
    CONSTRAINT `fk_code_details_group_id` FOREIGN KEY (`code_group_id`) REFERENCES `code_groups` (`code_group_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='코드북 그룹별 세부 코드 관리 테이블';
```







