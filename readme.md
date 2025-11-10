# Request Guidelines

## Tracker

---

### Get an specific habit

GET /tracker/habit:id

```
curl http://myurl:port/tracker/habit/n
```

### Get all habits

GET /tracker/habit

```
curl http://myurl:port/tracker/habit
```

### POST /tracker/habit

Creates a new habit

```
curl -X POST http://myurl:port/tracker/habit -H 'Content-Type:application/json' -d '{"name":"habitName","goal":1,"overflow":0}'
```

src/
 ├─ config/
 │   ├─ env.ts          # Loads .env, validates with zod or joi
 │   └─ db.ts           # PostgreSQL client (pg or Prisma)
 │
 ├─ modules/
 │   ├─ users/
 │   │   ├─ user.model.ts
 │   │   ├─ user.repository.ts
 │   │   ├─ user.service.ts
 │   │   ├─ user.controller.ts
 │   │   └─ user.routes.ts
 │   └─ auth/
 │       ├─ auth.service.ts
 │       └─ auth.routes.ts
 │
 ├─ middleware/
 │   ├─ errorHandler.ts
 │   ├─ authGuard.ts
 │   └─ requestLogger.ts
 │
 ├─ utils/
 │   ├─ logger.ts
 │   └─ response.ts
 │
 ├─ app.ts              # Express app setup
 └─ server.ts           # Entry point