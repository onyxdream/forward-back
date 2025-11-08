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
