# EventApp Backend API

Node.js · Express · MongoDB · JWT · Multer

---

## 🗂️ Project Structure

```
EventBackend/
├── config/
│   └── db.js                      ← MongoDB connection
├── src/
│   ├── server.js                  ← Express app entry point
│   ├── models/
│   │   ├── User.js                ← User schema + bcrypt
│   │   ├── Event.js               ← Event schema + text index
│   │   └── Group.js               ← Group schema
│   ├── controllers/
│   │   ├── auth.controller.js     ← register, login, getMe
│   │   ├── event.controller.js    ← CRUD + RSVP + save
│   │   ├── user.controller.js     ← profile, avatar, saved
│   │   └── group.controller.js    ← CRUD + join/leave
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── user.routes.js
│   │   └── group.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js     ← JWT protect + adminOnly
│   │   └── upload.middleware.js   ← Multer image uploads
│   └── utils/
│       ├── jwt.js                 ← Token generator
│       └── seed.js                ← Sample data seeder
├── uploads/                       ← Auto-created, stores images
├── .env.example
└── package.json
```

---

## 🚀 Setup

### 1. Install dependencies
```bash
cd EventBackend
npm install
```

### 2. Create your .env file
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventapp
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

### 3. Make sure MongoDB is running
```bash
# If using local MongoDB:
mongod

# Or use MongoDB Atlas (cloud) — paste the connection string in MONGO_URI
```

### 4. Seed sample data (optional but recommended)
```bash
npm run seed
```
This creates 2 users, 2 groups and 6 events to test with:
- Admin → `admin@eventapp.com` / `admin123`
- User  → `user@eventapp.com`  / `user1234`

### 5. Start the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔌 Full API Reference

### Auth
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/register` | ❌ | `name, email, password` | `{ token, user }` |
| POST | `/api/auth/login` | ❌ | `email, password` | `{ token, user }` |
| GET | `/api/auth/me` | ✅ | — | `{ user }` |

### Events
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/events` | ❌ | `?category=Tech&search=react&page=1&limit=20&upcoming=true` |
| GET | `/api/events/:id` | ❌ | Full event with populated organizer + attendees |
| POST | `/api/events` | 🔒 Admin | `multipart/form-data` with optional `coverImage` |
| PUT | `/api/events/:id` | 🔒 Admin | Same as POST |
| DELETE | `/api/events/:id` | 🔒 Admin | Soft delete (sets isActive: false) |
| POST | `/api/events/:id/rsvp` | ✅ | Toggles attendance |
| POST | `/api/events/:id/save` | ✅ | Toggles bookmark |

### Users
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/users/saved-events` | ✅ | Current user's bookmarked events |
| PUT | `/api/users/profile` | ✅ | `name, bio` |
| PUT | `/api/users/avatar` | ✅ | `multipart/form-data` with `avatar` file |
| GET | `/api/users/:id` | ❌ | Public profile |
| GET | `/api/users` | 🔒 Admin | All users |
| DELETE | `/api/users/:id` | 🔒 Admin | Delete user |

### Groups
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/groups` | ❌ | All active groups |
| GET | `/api/groups/:id` | ❌ | Group with members + events |
| POST | `/api/groups` | 🔒 Admin | `multipart/form-data` with optional `coverImage` |
| PUT | `/api/groups/:id` | 🔒 Admin | Update group |
| DELETE | `/api/groups/:id` | 🔒 Admin | Soft delete |
| POST | `/api/groups/:id/join` | ✅ | Toggle join/leave |

---

## 📱 Connect to the Mobile App

In your React Native app, edit `lib/api.ts`:

```ts
// Use your machine's local IP (not localhost!)
// Find it: ipconfig (Windows) or ifconfig (Mac/Linux)
export const BASE_URL = "http://192.168.1.XXX:5000/api";
```

> ⚠️ Android emulator: use `http://10.0.2.2:5000/api` instead of your IP.
> ⚠️ Physical device: must be on the same WiFi network as your PC.

---

## 🖼️ Image Uploads

Uploaded files are saved to `/uploads/` and served as static files.

Access them via: `http://YOUR_IP:5000/uploads/filename.jpg`

To display in the app, prefix with your base URL:
```ts
const imageUrl = `http://192.168.1.XXX:5000${user.avatar}`;
```
