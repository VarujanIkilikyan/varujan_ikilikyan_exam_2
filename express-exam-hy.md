# 📝 Քննություն: Ստեղծել Գրքերի Գրադարանի REST API Express.js-ով

**Դասընթաց:** Node.js & Express.js  
**Տևողություն:** 3 ժամ  
**Ընդհանուր միավորներ:** 100

---

## Նկարագրություն

Ձեր խնդիրն է կառուցել **Գրքերի Գրադարանի REST API** օգտագործելով Express.js: Ձեր հավելվածը պետք է հետևի **MVC օրինաչափությանը** (Models, Controllers, Routes)` միջանկյալ ծրագրերով (middlewares) և JSON ֆայլերի պահեստարանով — այն նույն ճարտարապետությունը, որը սովորել եք դասարանում:

API-ն թույլ է տալիս օգտատերերին **գրանցվել**, **մուտք գործել** և կառավարել իրենց անձնական գրքերի հավաքածուն (ավելացնել, դիտել, թարմացնել, ջնջել գրքեր): Գրքերի ցուցակագրման վերջնակետը (endpoint) պետք է աջակցի **էջադրմանը** (pagination): Բոլոր տվյալները պետք է պահվեն JSON ֆայլերում: Բոլոր պատասխանները պետք է լինեն **JSON** ձևաչափով:

---

## 📖 Ի՞նչ է Էջադրումը (Pagination):

Երբ ձեր API-ն վերադարձնում է տարրերի ցանկ (օրինակ՝ գրքեր), ցանկը կարող է շատ մեծանալ — հարյուրավոր կամ նույնիսկ հազարավոր տարրեր: Բոլոր տարրերը մեկ պատասխանով ուղարկելը **դանդաղ է և անարդյունավետ**: **Էջադրումը** լուծում է այս խնդիրը՝ տվյալները բաժանելով ավելի փոքր մասերի, որոնք կոչվում են **էջեր**:

### Ինչպես է այն աշխատում

Հաճախորդը (client) URL-ում ուղարկում է երկու **հարցման պարամետր** (query parameters):

| Պարամետր | Նշանակություն | Օրինակ |
|-----------|--------------------------------------|---------|
| `page`    | Ո՞ր էջի համարը վերադարձնել (սկսվում է 1-ից) | `1`     |
| `limit`   | Քանի՞ տարր լինի յուրաքանչյուր էջում | `10`    |

**Հարցման օրինակ:**
```
GET /books?page=2&limit=5
```

Սա նշանակում է. _"Տվեք ինձ 2-րդ էջը, յուրաքանչյուր էջում 5 գիրք"_ — այսպիսով դուք բաց եք թողնում առաջին 5 գրքերը և վերադարձնում 6-ից 10-րդ գրքերը:

### Մաթեմատիկան դրա հետևում

Պարզելու համար, թե որ տարրերը պետք է վերադարձնել, օգտագործում եք երկու արժեք.

- **`skip`** = քանի տարր բաց թողնել = `(page - 1) * limit`
- **`limit`** = քանի տարր վերցնել բաց թողնելուց հետո

Օրինակ, եթե ունեք 12 գիրք և հաճախորդը հայցում է `page=2&limit=5`.

```
skip = (2 - 1) * 5 = 5
limit = 5

Բոլոր գրքերը:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                               ↑ բաց թողնել 5-ը, ապա վերցնել 5-ը
Արդյունք:     [6, 7, 8, 9, 10]
```

### JavaScript-ում կարող եք օգտագործել `.slice()`:

```js
const page = 2;
const limit = 5;
const skip = (page - 1) * limit;

const paginatedBooks = allBooks.slice(skip, skip + limit);
```

### Ի՞նչ պետք է վերադարձնի ձեր API-ն

Էջադրված տարրերի հետ մեկտեղ, ձեր API-ն պետք է վերադարձնի **մետատվյալներ**, որպեսզի հաճախորդը տեղեկություն ունենա ընդհանուր տվյալների մասին և կարողանա նավարկել էջերի միջև.

```json
{
  "books": [ ... ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 12,
    "totalPages": 3
  }
}
```

| Դաշտ        | Նշանակություն                                            |
|-------------|----------------------------------------------------|
| `page`      | Ընթացիկ էջի համարը                             |
| `limit`     | Քանի տարր յուրաքանչյուր էջում                             |
| `total`     | Տվյալների բազայում առկա տարրերի ընդհանուր քանակը               |
| `totalPages`| Էջերի ընդհանուր քանակը = `Math.ceil(total / limit)`  |

### Լռելյայն արժեքներ (Default values)

Եթե հաճախորդը չի ուղարկում `page` կամ `limit`, դուք պետք է օգտագործեք **լռելյայն արժեքներ**.
- `page` լռելյայն `1`
- `limit` լռելյայն `10`

### Հարցման պարամետրերի ընթերցումը Express-ում

Express-ում URL-ից հարցման պարամետրերը հասանելի են `req.query`-ում.

```
GET /books?page=2&limit=5
```

```js
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
```

> **Նշում:** `req.query.page`-ը միշտ **տող** (string) է, ուստի անհրաժեշտ է այն փոխակերպել թվի՝ օգտագործելով `parseInt()`: `|| 1` մասը սահմանում է լռելյայն արժեքը, եթե պարամետրը բացակայում է կամ անվավեր է:

---


## Նախագծի Կառուցվածքը

```
book-library/
├── app.js
├── .env
├── .gitignore
├── package.json
├── data/
│   ├── users.json
│   └── books.json
├── controllers/
│   ├── auth.js
│   └── books.js
├── models/
│   ├── users.js
│   └── books.js
├── routes/
│   ├── index.js
│   ├── auth.js
│   └── books.js
└── middlewares/
    ├── authorization.js
    ├── errorHandler.js
    ├── validation.js
    └── schemas/
        ├── auth.schema.js
        └── books.schema.js
```

---

## Քայլ 1: Նախագծի Կարգավորում (5 միավոր)

### 1.1 Նախաձեռնեք ձեր նախագիծը

- Ստեղծեք `package.json`՝ `"type": "module"` հատկությամբ՝ ES մոդուլների աջակցության համար:
- Ավելացրեք `"dev"` սկրիպտ, որն օգտագործում է `nodemon`՝ հավելվածը գործարկելու համար:

### 1.2 Տեղադրեք կախվածությունները (dependencies)

Անհրաժեշտ է տեղադրել հետևյալ փաթեթները.

| Փաթեթ      | Նպատակ                     |
|-------------|-----------------------------|
| `express`   | Վեբ շրջանակ (framework)               |
| `dotenv`    | Շրջակա միջավայրի փոփոխականների բեռնում  |
| `morgan`    | HTTP հարցումների լոգավորում         |
| `uuid`      | Եզակի ID-ների գեներացում         |
| `md5`       | Գաղտնաբառի հեշավորում            |
| `crypto-js` | Թոքենի գաղտնագրում/վերծանում |
| `joi`       | Հարցումների վավերացում (validation)          |
| `http-errors` | HTTP սխալների ստեղծում       |
| `lodash`    | Օժանդակ ֆունկցիաներ           |
| `nodemon`   | Մշակման սերվեր (devDependency)  |

### 1.3 Ստեղծեք ձեր `.env` ֆայլը

```
PORT=4000
PASSWORD_SECRET=your_password_secret_here
TOKEN_SECRET=your_token_secret_here
```

### 1.4 Ստեղծեք `.gitignore`

```
node_modules
.env
```

---

## Քայլ 2: `app.js` — Հավելվածի Մուտքի Կետ (10 միավոր)

Ստեղծեք ձեր հիմնական հավելվածի ֆայլը: Այն պետք է.

1. Վերևում ներմուծի `dotenv/config`:
2. Ներմուծի `path`, `morgan`, `express` և `createServer` `http`-ից:
3. Ներմուծի հիմնական երթուղիչը (router) `./routes/index.js`-ից:
4. Ներմուծի սխալների մշակիչը `./middlewares/errorHandler.js`-ից:
5. Ստեղծի Express հավելված:
6. Կարդա `PORT`-ը `process.env`-ից:
7. Գրանցի **միջանկյալ ծրագրերը** (middlewares) հետևյալ հերթականությամբ.
   - `morgan('dev')` — լոգավորման համար:
   - `express.json()` — JSON հարցումների մարմինները վերլուծելու համար:
   - `express.urlencoded({ extended: false })` — ձևաթղթերի տվյալները վերլուծելու համար:
8. Գրանցի **հիմնական երթուղիչը**:
9. Գրանցի **սխալների մշակիչները**.
   - `errorHandler.notFound`
   - `errorHandler.errors`
10. Ստեղծի HTTP սերվեր և լսի `PORT`-ը:

---

## Քայլ 3: `models/users.js` — Օգտատիրոջ Մոդել (15 միավոր)

Այս մոդուլը կառավարում է օգտատերերի տվյալների բոլոր գործողությունները: Պահպանման համար պետք է օգտագործեք **JSON ֆայլ** (`data/users.json`):

### Դուք պետք է իրականացնեք հետևյալ ֆունկցիաները.

#### `getDataPath(dirPath)`
- Վերցնում է ֆայլի անունը և վերադարձնում բացարձակ ուղին `data/` թղթապանակի ներսում:
- Օգտագործեք `path.resolve()` `process.cwd()`-ի հետ:

#### `readJSON()` (async)
- Կարդում է օգտատերերի JSON ֆայլը՝ օգտագործելով `fs.readFile()` `utf8` կոդավորմամբ:
- Վերլուծում և վերադարձնում է տվյալները:
- Վերադարձնում է `[]`, եթե ֆայլը գոյություն չունի (օգտագործեք `try/catch`):

#### `writeJSON(data)` (async)
- Տվյալները գրում է օգտատերերի JSON ֆայլում:
- Ձևաչափման համար օգտագործեք `JSON.stringify(data, null, 2)`:
- Օգտագործեք `try/catch`:

#### `findById(id)` (async)
- Կարդում է բոլոր օգտատերերին և վերադարձնում այն մեկը, որը համընկնում է `id`-ի հետ:
- Վերադարձնում է `null`, եթե չի գտնվել:

#### `findByEmail(email)` (async)
- Կարդում է բոլոր օգտատերերին և վերադարձնում այն մեկը, որը համընկնում է `email`-ի հետ:
- Վերադարձնում է `null`, եթե չի գտնվել:

#### `checkEmailUnique(email)` (async)
- Վերադարձնում է `true`, եթե այդ էլ. փոստով օգտատեր արդեն գոյություն ունի, այլապես՝ `false`:

#### `create(data)` (async)
- Կարդում է ընթացիկ օգտատերերին:
- Ստեղծում է նոր օգտատիրոջ օբյեկտ `uuidV4()`-ով գեներացված `id`-ով:
- Ավելացնում է զանգվածին և հետ գրում ֆայլում:
- Վերադարձնում է նոր օգտատիրոջը:

#### `hashPassword(pass)`
- Հեշավորում է գաղտնաբառը՝ օգտագործելով. `md5(md5(pass) + PASSWORD_SECRET)`:
- Վերադարձնում է հեշավորված տողը:

#### `encrypt(data)`
- Գաղտնագրում է տվյալները՝ օգտագործելով `CryptoJS.AES.encrypt(JSON.stringify(data), TOKEN_SECRET)`:
- Վերադարձնում է գաղտնագրված տողը:

#### `decrypt(ciphertext)`
- Վերծանում է գաղտնագրված տողը՝ օգտագործելով `CryptoJS.AES.decrypt()`:
- Արդյունքը վերլուծում է `JSON.parse()`-ով:
- Վերադարձնում է տվյալների օբյեկտը, կամ `null` ձախողման դեպքում (օգտագործեք `try/catch`):

Դուք պետք է արտահանեք բոլոր ֆունկցիաները և՛ որպես **անվանական արտահանումներ** (named exports), և՛ որպես **լռելյայն օբյեկտ** (default object):

---

## Քայլ 4: `models/books.js` — Գրքի Մոդել (15 միավոր)

Այս մոդուլը կառավարում է գրքերի տվյալների բոլոր գործողությունները: Պահպանման համար պետք է օգտագործեք **JSON ֆայլ** (`data/books.json`):

### Դուք պետք է իրականացնեք հետևյալ ֆունկցիաները.

#### `readJSON()` / `writeJSON(data)` (async)
- Նույն օրինաչափությունը, ինչ օգտատերերի մոդելում, բայց կարդում/գրում է `data/books.json` ֆայլը:

#### `findAll(userId, page, limit)` (async)
- Ֆիլտրում է բոլոր գրքերը ըստ `userId`-ի՝ օգտագործելով `.filter()`:
- Իրականացնում է **էջադրում**՝ օգտագործելով `page` և `limit` պարամետրերը:
- Հաշվում է `skip = (page - 1) * limit`:
- Վերադարձնում է ֆիլտրված գրքերի **էջադրված հատվածը**՝ օգտագործելով `.slice(skip, skip + limit)`:
- Նաև վերադարձնում է օգտատիրոջ գրքերի **ընդհանուր քանակը** (մինչև կտրելը):
- Վերադարձվող ձևաչափը՝ `{ books: [...], total: <թիվ> }`:

#### `findById(id)` (async)
- Վերադարձնում է մեկ գիրք ըստ իր `id`-ի, կամ `null`:

#### `create(data)` (async)
- Ստեղծում է նոր գիրք `uuid` id-ով:
- `data`-ն պետք է ներառի՝ `title`, `author`, `year`, `genre`, `userId`:
- Գրում է ֆայլում և վերադարձնում նոր գիրքը:

#### `update(id, userId, data)` (async)
- Գտնում է գիրքը ըստ `id`-ի:
- **Թարմացնում է միայն այն դեպքում, եթե `book.userId === userId`** (սեփականության ստուգում):
- Միավորում է նոր տվյալները և գրում ֆայլում:
- Վերադարձնում է թարմացված գիրքը, կամ `null`, եթե չի գտնվել / չի պատկանում օգտատիրոջը:

#### `deleteBook(id, userId)` (async)
- Հեռացնում է գիրքը ըստ `id`-ի:
- **Ջնջում է միայն այն դեպքում, եթե `book.userId === userId`** (սեփականության ստուգում):
- Վերադարձնում է `true`, եթե ջնջվել է, `false`, եթե չի գտնվել / չի պատկանում օգտատիրոջը:

Դուք պետք է արտահանեք բոլոր ֆունկցիաները և՛ որպես **անվանական արտահանումներ**, և՛ որպես **լռելյայն օբյեկտ**:

---

## Քայլ 5: Միջանկյալ ծրագրեր (Middlewares) (20 միավոր)

### 5.1 `middlewares/errorHandler.js` (5 միավոր)

Դուք պետք է արտահանեք օբյեկտ երկու մեթոդով.

#### `notFound(req, res, next)`
- Ստեղծում է `404` HTTP սխալ՝ օգտագործելով `http-errors`, և փոխանցում այն `next()`-ին:

#### `errors(err, req, res, next)`
- Արձագանքում է սխալի կարգավիճակի կոդով (լռելյայն `500`):
- Վերադարձնում է JSON՝ `{ message, errors }`:

---

### 5.2 `middlewares/authorization.js` (5 միավոր)

Դուք պետք է արտահանեք միջանկյալ ծրագրի ֆունկցիա, որը.

1. Կարդում է թոքենը `req.headers.authorization`-ից:
2. Եթե թոքեն գոյություն չունի → կանչում է `next()` `401` HTTP սխալով:
3. Վերծանում է թոքենը՝ օգտագործելով `Users.decrypt(token)`:
4. Եթե վերծանումը ձախողվում է կամ `userId`-ն բացակայում է → կանչում է `next()` `401` HTTP սխալով:
5. Սահմանում է `req.userId = decryptData.userId`:
6. Կանչում է `next()`՝ շարունակելու համար:
7. Ամեն ինչ փաթաթում է `try/catch`-ի մեջ:

---

### 5.3 `middlewares/validation.js` (5 միավոր)

Դուք պետք է արտահանեք **բարձր կարգի ֆունկցիա** (higher-order function) `validator(schema, path)`, որը վերադարձնում է միջանկյալ ծրագիր.

1. Ֆունկցիան ընդունում է `schema` (Joi սխեմա) և `path` (լռելյայն՝ `'body'`):
2. Վավերացնում է `req[path]`-ը սխեմայի նկատմամբ `{ abortEarly: false }` տարբերակով:
3. Եթե վավերացումը ձախողվում է.
   - Հավաքեք բոլոր սխալների հաղորդագրությունները `errors` օբյեկտի մեջ՝ օգտագործելով `lodash.set()`:
   - Մաքրեք սխալների հաղորդագրությունները՝ հեռացնելով չակերտավորված դաշտի անունը:
   - Նետեք `422` HTTP սխալ՝ `{ message: 'Validation error', errors }` բովանդակությամբ:
4. Եթե վավերացումն անցնում է → կանչեք `next()`:
5. Օգտագործեք `try/catch`:

---

### 5.4 Վավերացման Սխեմաներ (5 միավոր)

#### `middlewares/schemas/auth.schema.js`

Անհրաժեշտ է սահմանել հետևյալ Joi սխեմաները.

```
register:
  - username: string, alphanumeric, required
  - email: string, valid email, required
  - password: string, min 6, max 32, required
  - age: number, integer, min 16, max 120, required

login:
  - email: string, valid email, required
  - password: string, min 6, max 32, required
```

#### `middlewares/schemas/books.schema.js`

```
create:
  - title: string, min 1, max 200, required
  - author: string, min 1, max 100, required
  - year: number, integer, min 1000, max current year, required
  - genre: string, valid values: ["fiction", "non-fiction", "science", "history", "fantasy", "mystery", "biography", "other"], required

update:
  - title: string, min 1, max 200, required
  - author: string, min 1, max 100, required
  - year: number, integer, min 1000, max current year, required
  - genre: string, valid values (նույն ցուցակը), required
```

---

## Քայլ 6: Երթուղիներ (Routes) (15 միավոր)

### 6.1 `routes/index.js` (5 միավոր)

1. Ստեղծեք հիմնական `Router`:
2. Սահմանեք `GET /` երթուղի, որը վերադարձնում է JSON՝ `{ message: "Welcome to the Book Library API" }`:
3. Կցեք `authRouter`-ը `/auth`-ում:
4. Կցեք `booksRouter`-ը `/books`-ում:
5. Արտահանեք երթուղիչը:

---

### 6.2 `routes/auth.js` (5 միավոր)

| Մեթոդ | Ուղի        | Միջանկյալ ծրագիր                             | Կոնտրոլեր            |
|--------|-------------|----------------------------------------|-----------------------|
| POST   | `/register` | `validation(schema.register, 'body')`  | `controller.register` |
| POST   | `/login`    | `validation(schema.login, 'body')`     | `controller.login`    |
| GET    | `/profile`  | `authorization`                        | `controller.profile`  |

---

### 6.3 `routes/books.js` (5 միավոր)

**Գրքերի բոլոր երթուղիները պետք է օգտագործեն `authorization` միջանկյալ ծրագիրը:**

| Մեթոդ | Ուղի   | Միջանկյալ ծրագիր                                          | Կոնտրոլեր           |
|--------|--------|-----------------------------------------------------|----------------------|
| GET    | `/`    | `authorization`                                     | `controller.getAll`  |
| POST   | `/`    | `authorization`, `validation(schema.create, 'body')`| `controller.create`  |
| PUT    | `/:id` | `authorization`, `validation(schema.update, 'body')`| `controller.update`  |
| DELETE | `/:id` | `authorization`                                     | `controller.delete`  |

---

## Քայլ 7: Կոնտրոլերներ (20 միավոր)

### 7.1 `controllers/auth.js` (10 միավոր)

#### `register(req, res, next)`
1. Վերցրեք `username`, `email`, `password`, `age` `req.body`-ից:
2. Ստուգեք՝ արդյոք էլ. փոստն արդեն օգտագործվում է `Users.checkEmailUnique(email)`-ի միջոցով:
3. Եթե էլ. փոստը գոյություն ունի → նետեք `422` սխալ՝ `"Email is already in use!"` հաղորդագրությամբ:
4. Ստեղծեք օգտատիրոջը **հեշավորված գաղտնաբառով**՝ օգտագործելով `Users.hashPassword(password)`:
5. Պատասխանելուց առաջ ջնջեք `password`-ը օգտատիրոջ օբյեկտից:
6. Պատասխանեք `{ message: "User registered successfully", user }` բովանդակությամբ:

#### `login(req, res, next)`
1. Վերցրեք `email`, `password` `req.body`-ից:
2. Գտեք օգտատիրոջը ըստ էլ. փոստի՝ օգտագործելով `Users.findByEmail(email)`:
3. Եթե օգտատերը չի գտնվել ԿԱՄ գաղտնաբառը չի համընկնում հեշավորված գաղտնաբառի հետ → նետեք `401` սխալ:
4. Ստեղծեք թոքեն՝ գաղտնագրելով `{ userId: user.id }`:
5. Ջնջեք `password`-ը օգտատիրոջ օբյեկտից:
6. Պատասխանեք `{ token, user }` բովանդակությամբ:

#### `profile(req, res, next)`
1. Գտեք օգտատիրոջը ըստ `req.userId`-ի՝ օգտագործելով `Users.findById()`:
2. Պատասխանեք `{ user }` բովանդակությամբ:

**Ձեր բոլոր մեթոդները պետք է օգտագործեն `try/catch` և կանչեն `next(e)` սխալների դեպքում:**

---

### 7.2 `controllers/books.js` (10 միավոր)

#### `getAll(req, res, next)`
1. Կարդացեք `page` և `limit` `req.query`-ից:
2. Փոխակերպեք դրանք թվերի՝ օգտագործելով `parseInt()`, օգտագործեք լռելյայն արժեքներ՝ `page = 1`, `limit = 10`:
3. Կանչեք `Books.findAll(req.userId, page, limit)`:
4. Հաշվեք `totalPages = Math.ceil(total / limit)`:
5. Պատասխանեք այսպես.
```json
{
  "books": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```


#### `create(req, res, next)`
1. Վերցրեք `title`, `author`, `year`, `genre` `req.body`-ից:
2. Ստեղծեք նոր գիրք `userId: req.userId`-ով:
3. Պատասխանեք `{ message: "Book added successfully", book }` բովանդակությամբ:

#### `update(req, res, next)`
1. Վերցրեք `id` `req.params.id`-ից:
2. Վերցրեք `title`, `author`, `year`, `genre` `req.body`-ից:
3. Կանչեք `Books.update(id, req.userId, { title, author, year, genre })`:
4. Եթե վերադարձվում է `null` → նետեք `404` սխալ՝ `"Book not found"` հաղորդագրությամբ:
5. Պատասխանեք `{ message: "Book updated successfully", book }` բովանդակությամբ:

#### `delete(req, res, next)`
1. Վերցրեք `id` `req.params.id`-ից:
2. Կանչեք `Books.deleteBook(id, req.userId)`:
3. Եթե վերադարձվում է `false` → նետեք `404` սխալ՝ `"Book not found"` հաղորդագրությամբ:
4. Պատասխանեք `{ message: "Book deleted successfully" }` բովանդակությամբ:

**Ձեր բոլոր մեթոդները պետք է օգտագործեն `try/catch` և կանչեն `next(e)` սխալների դեպքում:**

---

## Տվյալների Ֆայլեր

### `data/users.json`

Սկսեք դատարկ զանգվածով.
```json
[]
```

### `data/books.json`

Սկսեք դատարկ զանգվածով.
```json
[]
```

---

## API Վերջնակետերի Ամփոփում

| Մեթոդ | Վերջնակետ         | Auth? | Նկարագրություն              |
|--------|-----------------|-------|--------------------------|
| GET    | `/`             | ❌    | Ողջույնի հաղորդագրություն          |
| POST   | `/auth/register`| ❌    | Գրանցել նոր օգտատեր      |
| POST   | `/auth/login`   | ❌    | Մուտք գործել և ստանալ թոքեն      |
| GET    | `/auth/profile` | ✅    | Ստանալ ընթացիկ օգտատիրոջ պրոֆիլը |
| GET    | `/books?page=1&limit=10` | ✅ | Ստանալ օգտատիրոջ գրքերը (էջադրված) |
| POST   | `/books`        | ✅    | Ավելացնել նոր գիրք           |
| PUT    | `/books/:id`    | ✅    | Թարմացնել գիրքը            |
| DELETE | `/books/:id`    | ✅    | Ջնջել գիրքը            |

---

## Գնահատման Չափանիշներ

| Բաժին                                        | Միավորներ |
|------------------------------------------------|--------|
| Նախագծի կարգավորում և `app.js`                       | 10     |
| Օգտատիրոջ մոդել (`models/users.js`)                 | 15     |
| Գրքի մոդել (`models/books.js`) ներառյալ էջադրումը| 15     |
| Միջանկյալ ծրագրեր (error, auth, validation, schemas)  | 20     |
| Երթուղիներ                                         | 10     |
| Կոնտրոլերներ ներառյալ էջադրումը `getAll`-ում       | 20     |
| Էջադրում (պատասխանի ճիշտ ձևաչափ և լռելյայն արժեքներ)| 10     |
| **Ընդհանուր**                                      | **100** |



---

## Պահանջների Ստուգաթերթ

Համոզվեք, որ ձեր նախագիծը համապատասխանում է հետևյալ բոլոր կետերին.

- [ ] Օգտագործում է ES մոդուլների շարահյուսություն (`import`/`export`)
- [ ] Հետևում է MVC ճարտարապետությանը (models, controllers, routes)
- [ ] Երթուղիները կազմակերպված են առանձին ֆայլերում
- [ ] Վավերացումն օգտագործում է Joi սխեմաներ՝ վերաօգտագործելի միջանկյալ ծրագրի միջոցով
- [ ] Գաղտնաբառերը հեշավորված են `md5` + secret-ով
- [ ] Թոքենները գաղտնագրված/վերծանված են `crypto-js`-ով
- [ ] Authorization միջանկյալ ծրագիրը պաշտպանում է մասնավոր երթուղիները
- [ ] Սխալների մշակիչը որսում է 404-երը և ձևաչափում բոլոր սխալները որպես JSON
- [ ] Տվյալները պահպանվում են JSON ֆայլերում սերվերի վերագործարկումների միջև
- [ ] Գրքերը պատկանում են օգտատերերին (սեփականության ստուգում թարմացման/ջնջման ժամանակ)
- [ ] `GET /books`-ը աջակցում է էջադրմանը `page` և `limit` հարցման պարամետրերով
- [ ] Էջադրումն օգտագործում է լռելյայն արժեքներ (`page=1`, `limit=10`), երբ դրանք տրված չեն
- [ ] Էջադրման պատասխանը ներառում է `books`, `page`, `limit`, `total` և `totalPages`
- [ ] Բոլոր ասինխրոն կոդերն օգտագործում են `async/await` `try/catch`-ի հետ
- [ ] Կոդը մաքուր է և ունի իմաստալից մեկնաբանություններ

---

## Ինչպես Թեստավորել Ձեր Աշխատանքը

1. Գործարկեք `npm run dev` (կամ `yarn dev`)
2. Օգտագործեք **Postman** կամ **Thunder Client**՝ ձեր API-ն թեստավորելու համար.

### Հետևեք թեստավորման այս ընթացքին.

```
1. POST /auth/register
   Մարմին: { "username": "john", "email": "john@mail.com", "password": "123456", "age": 25 }
   → Դուք պետք է հետ ստանաք օգտատիրոջ օբյեկտը (առանց գաղտնաբառի)

2. POST /auth/login
   Մարմին: { "email": "john@mail.com", "password": "123456" }
   → Դուք պետք է հետ ստանաք թոքեն + օգտատիրոջ օբյեկտը

3. GET /auth/profile
   Գլխագիր: Authorization: <թոքենը login-ից>
   → Դուք պետք է հետ ստանաք ձեր օգտատիրոջ պրոֆիլը

4. POST /books
   Գլխագիր: Authorization: <թոքենը>
   Մարմին: { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925, "genre": "fiction" }
   → Դուք պետք է հետ ստանաք ստեղծված գիրքը

5. GET /books
   Գլխագիր: Authorization: <թոքենը>
   → Դուք պետք է հետ ստանաք ձեր գրքերի զանգվածը

6. PUT /books/:id
   Գլխագիր: Authorization: <թոքենը>
   Մարմին: { "title": "Updated Title", "author": "Updated Author", "year": 2020, "genre": "mystery" }
   → Դուք պետք է հետ ստանաք թարմացված գիրքը

7. DELETE /books/:id
   Գլխագիր: Authorization: <թոքենը>
   → Դուք պետք է հետ ստանաք հաջողության հաղորդագրություն
```

3. Վերագործարկեք սերվերը — ձեր բոլոր տվյալները պետք է դեռ այնտեղ լինեն:
4. Ստուգեք `data/users.json` և `data/books.json` ֆայլերը՝ պահված տվյալները հաստատելու համար:

---

## Հանձնում

Հանձնեք ձեր ամբողջ `book-library/` թղթապանակը՝ նախագծի կառուցվածքում նշված բոլոր ֆայլերով:

---

Հաջողություն: 📚---|
| GET    | `/` | ❌ | Բարի գալուստ հաղորդագրություն |
| POST   | `/auth/register` | ❌ | Նոր օգտվողի գրանցում |
| POST   | `/auth/login` | ❌ | Login‑ և token ստացում |
| GET    | `/auth/profile` | ✅ | Ուղղող օգտվողի գործիքագիր |
| GET    | `/books?page=1&limit=10` | ✅ | Օգտվողի գրքերի ցանկ (պանջված)
| POST   | `/books` | ✅ | Գիրքի ավելացում |
| PUT    | `/books/:id` | ✅ | Գիրքի թարմացում |
| DELETE | `/books/:id` | ✅ | Գիրքի ջնջում |
---

## Grading Criteria
| Դաս | Միավոր |
|------|--------|
| Project Setup & `app.js` | 10 |
| User Model | 15 |
| Book Model (pagination) | 15 |
| Middleware‑ներ | 20 |
| Router‑ներ | 10 |
| Controllers (pagination) | 20 |
| Pagination implementation | 10 |
| **Ընդհանուր** | **100** |
---

## Checklist
- [ ] ES մոդուլների օգտագործում (`import`/`export`)
- [ ] MVC կառուցվածք (models, controllers, routes)
- [ ] Router‑ների բաժնեցողություն
- [ ] Joi‑ով Middleware‑ն օգտագործում
- [ ] Գաղտնաբառերի hashing `md5` + secret
- [ ] Token‑ների encryption/decryption `crypto-js`
- [ ] Authorization middleware‑ը պաշտպանում է մասնատված router‑ները
- [ ] Error handler‑ը վերադասում բոլոր սխալները JSON‑ով
- [ ] Տվյալները պահված են JSON ֆայլերում
- [ ] Գրքերի user‑ownership ստուգում
- [ ] `GET /books`‑ը աջակցում pagination‑ին
- [ ] Pagination‑ի լռյալ արժեքները (`page=1`, `limit=10`)
- [ ] Pagination պատասխանները՝ `books`, `page`, `limit`, `total`, `totalPages`
- [ ] Async functions օգտագործում `async/await`‑ը, try/catch-ի հետ
- [ ] Կոդը հստակ և մեկնաբանված է
---

## How to Test Your Work
1. Կատարեք `npm run dev` (կամ `yarn dev`)
2. Օգտագործեք Postman կամ Thunder Client`ը՝ փորձարկելու API‑ն

### Փորձարկման հաջորդականությունը:
```
1. POST /auth/register
   Body: { "username": "john", "email": "john@mail.com", "password": "123456", "age": 25 }
   → պետք է ստանաք user‑ի object‑ը (առանց գաղտնաբառի)

2. POST /auth/login
   Body: { "email": "john@mail.com", "password": "123456" }
   → պետք է ստանաք token + user‑ի object

3. GET /auth/profile
   Header: Authorization: <token‑ը>
   → պետք է ստանաք օգտվողի profile‑ը

4. POST /books
   Header: Authorization: <token‑ը>
   Body: { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925, "genre": "fiction" }
   → պետք է ստանաք գիրքի object‑ը

5. GET /books
   Header: Authorization: <token‑ը>
   → պետք է ստանաք մատուցված գրքեր (պարտիվ pagination)

6. PUT /books/:id
   Header: Authorization: <token‑ը>
   Body: { "title": "Updated Title", "author": "Updated Author", "year": 2020, "genre": "mystery" }
   → պետք է ստանաք թարմացված գիրքի object‑ը

7. DELETE /books/:id
   Header: Authorization: <token‑ը>
   → պետք է ստանաք հաջողության հաղորդագրություն
```
3. Կատարեք սերվերի վերագործարկում՝ ամեն տվյալները պետք է պահպանվեն
4. Ստուգեք `data/users.json` և `data/books.json`‑ը՝ համոզվելու, որ դրանք պահված են
---

## Submission

Ներբեռնեք ամբողջ `book-library/` թղթապանակը, ներառելով բոլոր նշված ֆայլերը։

---

Good luck! 📚
