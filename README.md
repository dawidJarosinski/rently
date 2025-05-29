# Rently - Airbnb Clone

**Rently** to aplikacja webowa typu Airbnb, która umożliwia użytkownikom wynajmowanie oraz wystawianie nieruchomości. Projekt stanowi kopię funkcjonalną Airbnb, zbudowaną w oparciu o architekturę REST i nowoczesny stos technologiczny.

---

## 📌 Opis projektu

Rently to aplikacja, która pozwala użytkownikom:

- Rejestrować i logować się do systemu.
- Wyszukiwać dostępne nieruchomości na podstawie lokalizacji, liczby gości itp.
- Rezerwować nieruchomości w wybranym terminie.
- Dodawać własne oferty najmu (dla gospodarzy).
- Oceniać oraz komentować pobyty.
- Zarządzać profilem użytkownika.

Projekt oparty jest o architekturę backendową zbudowaną w języku Java z wykorzystaniem Spring Boot. W przyszłości planowane jest dodanie frontendu opartego o React.

---

## 🧱 Architektura projektu

Poniżej znajduje się schemat architektury projektu (struktura pakietów):

rently<br>
└── rentlybackend<br>
├── config # Konfiguracje aplikacji (CORS, WebSecurity itp.)<br>
├── dto # Obiekty przesyłane między frontendem a backendem<br>
│ ├── request # Dane wejściowe od użytkownika<br>
│ └── response # Dane wyjściowe zwracane przez backend<br>
├── enums # Typy wyliczeniowe (np. Role, Statusy)<br>
├── exception # Obsługa wyjątków globalnych i lokalnych<br>
├── exchange # Obsługa komunikacji zewnętrznej (np. API)<br>
├── mapper # Mapowanie między encjami a DTO<br>
├── model # Encje JPA odpowiadające strukturom w bazie danych<br>
├── repository # Interfejsy do komunikacji z bazą danych (Spring Data JPA)<br>
├── rest # Kontrolery RESTowe odpowiadające za obsługę żądań HTTP<br>
├── security # Mechanizmy bezpieczeństwa (JWT, autoryzacja, role)<br>
├── service # Logika biznesowa aplikacji<br>
└── RentlyBackendApplication.java # Klasa uruchamiająca aplikację Spring Boot<br>
![rently](https://github.com/user-attachments/assets/1291f99f-7d0c-4e2d-8693-20ea5f94c19d)

## 🚀 Uruchomienie projektu lokalnie

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/twoj-login/rently.git
cd rently
```

### 2. Backend (Spring Boot)

#### Budowanie obrazu Dockera z Jib

```bash
cd rently-backend
./mvn compile jib:dockerBuild
```

#### Dodanie pliku credentials.json do kontenera

```bash
docker cp ./credentials.json rently-app:/credentials.json
```
#### Dodanie pliku credentials.json do kontenera

```bash
docker cp ./credentials.json <container_id>:/app/credentials.json
```

#### Uruchomienie docker compose

```bash
docker compose up
```
Aplikacja frontendowa będzie dostępna pod adresem: [http://localhost:8080](http://localhost:8080)

### 3. Frontend (React)

```bash
cd rently-frontend
npm install
npm run dev
```

Aplikacja frontendowa będzie dostępna pod adresem: [http://localhost:5173](http://localhost:5173)

## 🧰 Technologie i uzasadnienie wyboru

Spring Boot – szybkie tworzenie aplikacji backendowych z bogatym ekosystemem i wsparciem dla REST API.

Spring Security + JWT – bezpieczne uwierzytelnianie i autoryzacja użytkowników z użyciem tokenów JWT.

Spring Data JPA + Hibernate – wygodne operacje CRUD i mapowanie relacyjno-obiektowe dzięki ORM.

PostgreSQL – wydajna i skalowalna relacyjna baza danych typu open-source.

React – nowoczesna biblioteka do tworzenia dynamicznych interfejsów użytkownika (SPA).

Tailwind CSS – szybkie i efektywne stylowanie komponentów bez opuszczania HTML/JSX.

Docker – konteneryzacja aplikacji w celu łatwego wdrażania i testowania.

Maven – zarządzanie zależnościami i automatyzacja budowania backendu.

Vite – szybki i nowoczesny bundler dla aplikacji React, zapewniający błyskawiczny HMR i kompilację.

## 🗃️ Diagram ERD
![diagramRently](https://github.com/user-attachments/assets/dc45347a-3290-4aa8-bc5b-b17e15f71254)
