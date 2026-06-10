# ☕️ 카페 메뉴(커피콩) 관리 웹 애플리케이션

데브코스 백엔드 10기 12회차 1차 프로젝트 5팀(!FiveGuys)
- 개발 기간: (2026-06-04 ~ 2026-06-11 / 8일)

## 🍔 팀 소개

**!FiveGuys** : 팀원 구성이 남자 넷, 여자 하나로, 남자 다섯이 아니라는 의미. (`!`: 프로그래밍에서 `NOT`을 의미)

## 👋 프로젝트 소개

카페 메뉴를 관리하고 고객이 온라인으로 주문하고, 관리자가 주문·상품·계정을 통합 관리할 수 있는 풀스택 웹 서비스.
Spring Boot 기반의 REST API 서버와 HTML 프론트엔드로 구성.

## 🧑‍💻 팀원

| 팀원 | 담당 | 내용 |
|:---:|:---:|:---:|
| 🧑‍💻 최원우 (팀장) | 백엔드 | Users 설계 및 구현 / 프로젝트 발표 |
| 👩‍💻 황보람 | 백엔드 | OrderProduct 설계 및 구현 / SSE 알림 구현 |
| 🧑‍💻 오준서 | 백엔드 | Product 설계 및 구현 / 전역 설정 개발 / 와이어프레임 설계 |
| 🧑‍💻 최성혁 | 백엔드 | Orders 설계 및 구현 / 통계 대시보드 구현 / 발표자료 제작 |
| 🧑‍💻 김강민 | 프론트엔드 | 프론트엔드 설계 및 구현 / 백엔드 코드리뷰 및 품질관리 프로젝트 총괄 / 영상제작 |

---

## 🛠️ 기술 스택

### Frontend
- Framework: Next.js 16, React 19
- Language: TypeScript 5
- Styling: Tailwind CSS 4
- Package Manager: pnpm

### Backend
- Framework: Spring Boot 4.0.6 (Spring MVC)
- Language: Java 25
- ORM: Spring Data JPA
- API Docs: SpringDoc OpenAPI (Swagger UI)
- Build Tool: Gradle (Kotlin DSL)

### Database
- 운영: MySQL 8.4 (Docker)
- 개발/테스트: H2 (In-memory)

### Infra
- Docker Compose (MySQL 컨테이너 기반 로컬 환경)

### 실시간 통신
- SSE (Server-Sent Events) - 신규 주문 알림

---

## 🥸 핵심 비즈니스 로직 및 기능

### 주문 생성 및 배송일 자동 계산
- 주문 시각이 오후 2시 이전이면 당일 배송, 이후면 다음 날 배송으로 자동 배정
- 주문 생성 즉시 SSE를 통해 관리자 화면에 실시간 알림 발송

### 주문 상태 관리
- 상태 흐름: PENDING(주문확인중) → PROCESSING(처리중) → SHIPPED(발송완료) → DELIVERED(배송완료) / CANCELED(취소)
- 이미 취소된 주문은 어떤 상태로도 변경 불가
- 취소는 PENDING 상태일 때만 가능하며, 취소 시 해당 주문의 상품 재고 자동 복원

### 소프트 딜리트(Soft Delete)
- `BaseEntity`의 `deleteDate` 필드를 이용해 User, Order, OrderProduct 모두 소프트 딜리트 처리
- User 삭제 시 이메일을 `pastEmail`로 보존하고 `email`을 null 처리하여 재가입 가능성 유지

### 실시간 알림
- `SseEmitterRepository`가 연결된 모든 관리자 클라이언트에게 주문 접수 이벤트를 브로드캐스트

### 장바구니
- 프론트엔드 클라이언트 사이드에서만 관리

### 관리자 대시보드
- 일별 매출, 월별 매출, 판매량 TOP 3 원두 조회

---

## 🗂️ API 명세

API 상세 스펙은 서버 실행 후 Swagger UI에서 확인(Swagger UI: `http://localhost:8080/swagger-ui/index.html`)

### User (`/api/user`)

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/user` | 유저 목록 조회 |
| GET | `/api/user/{id}` | 유저 단건 조회 |
| POST | `/api/user` | 유저 생성 (email, address, addressDetail, postcode) |
| PUT | `/api/user/{id}` | 유저 수정 |
| DELETE | `/api/user/{id}` | 유저 삭제 (소프트 딜리트) |

### Product (`/api/product`)

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/product` | 상품 목록 조회 |
| GET | `/api/product/{id}` | 상품 단건 조회 |
| POST | `/api/product` | 상품 등록 (name, imageUrl, description, price, inventory) |
| PUT | `/api/product/{id}` | 상품 수정 |
| PUT | `/api/product/{id}/imageUrl` | 상품 이미지 URL 수정 |
| DELETE | `/api/product/{id}` | 상품 삭제 |

### Order (`/api/order`)

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/order` | 주문 목록 조회 |
| GET | `/api/order/{id}` | 주문 단건 조회 |
| GET | `/api/order/delivery?userId=&deliveryDate=` | 배송일 기준 주문 조회 |
| POST | `/api/order` | 주문 생성 (userId, address, addressDetail, postcode, totalPrice, orderProducts[]) |
| PUT | `/api/order/{id}` | 주문 상태 수정 (status) |
| DELETE | `/api/order/{id}` | 주문 삭제 (소프트 딜리트 + CANCELED 처리) |

### OrderProduct (`/api/order/{orderId}/product`)

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/order/{orderId}/product` | 주문 품목 목록 조회 |
| GET | `/api/order/{orderId}/product/{id}` | 주문 품목 단건 조회 |
| POST | `/api/order/{orderId}/product` | 주문 품목 생성 |
| PUT | `/api/order/{orderId}/product` | 주문 품목 수정 |
| DELETE | `/api/order/{orderId}/product` | 주문 품목 전체 삭제 |

### Dashboard (`/api/dashboard`)

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/dashboard/dailySales` | 일별 매출 조회 |
| GET | `/api/dashboard/monthSales` | 월별 매출 조회 |
| GET | `/api/dashboard/topSellingItems` | 판매량 TOP 3 상품 조회 |

### Notification (`/api/notifications`)

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/api/notifications/subscribe` | SSE 구독 (Content-Type: text/event-stream) |

---

## 📦 ERD

### User

| 컬럼 | 설명 |
|------|------|
| id (PK) | 기본키 |
| email | 이메일 (unique, nullable) |
| pastEmail | 소프트 딜리트 시 보존되는 과거 이메일 |
| address | 주소 |
| addressDetail | 상세 주소 |
| postcode | 우편번호 |
| createDate | 생성일 |
| modifyDate | 수정일 |
| deleteDate | 삭제일 (소프트 딜리트) |

### Product

| 컬럼 | 설명 |
|------|------|
| id (PK) | 기본키 |
| name | 상품명 |
| price | 가격 |
| inventory | 재고 수량 |
| description | 상품 설명 |
| imageUrl | 이미지 URL |
| createDate | 생성일 |
| modifyDate | 수정일 |
| deleteDate | 삭제일 (소프트 딜리트) |

### Order

| 컬럼 | 설명 |
|------|------|
| id (PK) | 기본키 |
| user_id (FK) | users 참조 |
| address | 배송 주소 |
| addressDetail | 배송 상세 주소 |
| postcode | 우편번호 |
| status | 주문 상태 (PENDING \| PROCESSING \| SHIPPED \| DELIVERED \| CANCELED) |
| totalPrice | 총 주문 금액 |
| deliveryDate | 배송 예정일 |
| createDate | 생성일 |
| modifyDate | 수정일 |
| deleteDate | 삭제일 (소프트 딜리트) |

### Order_Product

| 컬럼 | 설명 |
|------|------|
| id (PK) | 기본키 |
| order_id (FK) | orders 참조 |
| product_id (FK) | product 참조 |
| productQuantity | 주문 수량 |
| productName | 주문 시점 상품명 (스냅샷) |
| productPrice | 주문 시점 상품 가격 (스냅샷) |
| createDate | 생성일 |
| deleteDate | 삭제일 (소프트 딜리트) |

### ERD 관계

- users : orders == 1 : N
- orders : order_product == 1 : N
- product : order_product == 1 : N

---

## 🙋‍♂️ 요구사항 명세

### 사용자 기능

- 상품 목록 및 상세 조회
- 장바구니에 상품 담기 (클라이언트 사이드)
- 주문 생성 (배송지 입력, 배송일 자동 결정)
- 주문 내역 조회

### 관리자 기능

- 대시보드: 일별/월별 매출 차트, 판매량 TOP 3 원두 조회
- 주문 관리: 주문 목록 조회, 상태 변경, 주문 취소
- 상품 관리: 상품 등록/수정/삭제, 이미지 URL 관리, 재고 관리
- 계정 관리: 유저 목록 조회, 유저 정보 수정/삭제
- 신규 주문 실시간 알림 (SSE)

### 공통 기술 요구사항

- 삭제는 모두 소프트 딜리트로 처리
- 주문 취소 시 재고 자동 복원
- RESTful API 설계 및 Swagger 문서 자동 생성
- 오후 2시 기준 배송일 자동 분기 처리

---

## 🧱 프로젝트 구조

### 전체 구조

```
NBE10-12-1-Team5/
├── back/                  # Spring Boot 백엔드
├── front/                 # Next.js 프론트엔드
└── docker-compose.yml     # MySQL 컨테이너 설정
```

#### Backend

```
back/src/main/java/com/back/
├── BackApplication.java
├── domain/
│   ├── dashboard/         controller, dto, service
│   ├── notification/      controller, dto, repository
│   ├── order/             controller, dto, entity, repository, service
│   ├── orderproduct/      controller, dto, entity, repository, service
│   ├── product/           controller, dto, entity, repository, service
│   └── user/              controller, dto, entity, repository, service
└── global/
    ├── entity/            BaseEntity (소프트 딜리트 공통)
    ├── init/              BaseInitData (초기 데이터)
    ├── rsData/            RsData (공통 응답 포맷)
    └── webMvc/            WebMvcConfig (CORS 등)
```

#### Frontend

```
front/src/
├── app/
│   ├── page.tsx           상품 목록 (메인)
│   ├── cart/              장바구니
│   ├── order/             주문 확인, 완료, 상세
│   ├── products/[id]/     상품 상세
│   └── admin/
│       ├── dashboard/     매출 대시보드
│       ├── orders/        주문 관리
│       ├── products/      상품 관리 (목록, 신규 등록)
│       └── accounts/      계정 관리
├── lib/
│   ├── cart.ts            장바구니 로직 (클라이언트)
│   └── backend/client.ts  API 클라이언트
└── type/                  TypeScript 타입 정의
```
