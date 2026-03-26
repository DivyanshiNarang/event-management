# 📱 EventApp — User App (Android)

React Native · Expo · NativeWind · React Hook Form · Zod · JWT · MongoDB

---

## 🗂️ Complete File Structure

```
EventApp/
├── app/
│   ├── _layout.tsx              ← Root layout (fonts, AuthProvider, Stack nav)
│   ├── index.tsx                ← Auth redirect gate
│   ├── auth/
│   │   ├── login.tsx            ← Login screen (RHF + Zod)
│   │   └── register.tsx         ← Register screen (RHF + Zod)
│   ├── (tabs)/
│   │   ├── _layout.tsx          ← Bottom tab navigator
│   │   ├── home.tsx             ← Feed, search, categories, trending
│   │   ├── explore.tsx          ← Category grid + search results
│   │   ├── saved.tsx            ← Saved events list
│   │   └── profile.tsx          ← Profile + image upload + edit
│   └── event/
│       └── [id].tsx             ← Event detail + RSVP
├── components/
│   ├── ui/
│   │   ├── Button.tsx           ← 4-variant button (primary/secondary/ghost/danger)
│   │   └── Input.tsx            ← Styled input with error state
│   ├── EventCard.tsx            ← Full + compact card
│   └── CategoryPills.tsx        ← Horizontal filter strip
├── hooks/
│   ├── useAuth.tsx              ← Auth context + provider
│   └── useEvents.ts             ← Events/saved fetching hooks
├── lib/
│   ├── api.ts                   ← Axios instance + JWT interceptor
│   ├── auth.ts                  ← SecureStore helpers
│   └── types.ts                 ← TypeScript interfaces
├── constants/colors.ts          ← Design tokens
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── global.css
└── app.json
```

---

## 🚀 Setup Instructions

### 1. Create the Expo project
```bash
npx create-expo-app EventApp --template blank-typescript
cd EventApp
```

### 2. Copy all the files from this project into the folder

### 3. Install dependencies
```bash
npm install
```

### 4. Add fonts
Download these fonts and place in `assets/fonts/`:
- `Syne-Bold.ttf`         → fonts.google.com/specimen/Syne
- `DMSans-Regular.ttf`    → fonts.google.com/specimen/DM+Sans
- `DMSans-Medium.ttf`     → fonts.google.com/specimen/DM+Sans
- `SpaceMono-Regular.ttf` → fonts.google.com/specimen/Space+Mono

### 5. Set your backend URL
Edit `lib/api.ts`:
```ts
export const BASE_URL = "http://YOUR_LOCAL_IP:3000/api";
// Find your IP: run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
```

### 6. Run on Android
```bash
npx expo start --android
# Or scan QR with Expo Go app
```

---

## 🔌 Backend API Contract

Your Node.js backend needs these endpoints:

### Auth
| Method | Endpoint         | Body                        | Returns             |
|--------|------------------|-----------------------------|---------------------|
| POST   | /auth/register   | name, email, password       | { token, user }     |
| POST   | /auth/login      | email, password             | { token, user }     |
| GET    | /auth/me         | —                           | { user }            |

### Events
| Method | Endpoint              | Params/Body              | Returns              |
|--------|-----------------------|--------------------------|----------------------|
| GET    | /events               | ?category=&search=       | { events: [...] }    |
| GET    | /events/:id           | —                        | { event }            |
| POST   | /events/:id/rsvp      | —                        | { attending: bool }  |
| POST   | /events/:id/save      | —                        | { saved: bool }      |

### Users
| Method | Endpoint         | Body                    | Returns         |
|--------|------------------|-------------------------|-----------------|
| GET    | /users/saved-events | —                    | { events: [...] } |
| PUT    | /users/profile   | name, bio               | { user }        |
| PUT    | /users/avatar    | multipart: avatar file  | { user }        |

---

## 🎨 Design System

| Token      | Value     | Usage              |
|------------|-----------|--------------------|
| bg         | #09090f   | Screen backgrounds |
| surface    | #12121e   | Cards, inputs      |
| surface2   | #1a1a2e   | Nested surfaces    |
| accent     | #6c63ff   | Primary actions    |
| accent2    | #ff6b9d   | Highlights         |
| accent3    | #00d4aa   | Success / free     |
| textP      | #f0f0ff   | Primary text       |
| textS      | #8888aa   | Secondary text     |

---

## 📦 Key Dependencies

| Package                    | Purpose                    |
|----------------------------|----------------------------|
| expo-router                | File-based navigation      |
| nativewind                 | Tailwind CSS for RN        |
| react-hook-form            | Form state management      |
| zod + @hookform/resolvers  | Schema validation          |
| axios                      | HTTP client                |
| expo-secure-store          | Token storage              |
| expo-image-picker          | Profile photo upload       |
| expo-linear-gradient       | UI gradients               |
| date-fns                   | Date formatting            |
