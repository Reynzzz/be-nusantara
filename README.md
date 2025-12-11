# Golden Compass Club - Backend API

Backend API untuk Golden Compass Club menggunakan Node.js, Express.js, Sequelize, dan PostgreSQL.

## Teknologi yang Digunakan

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM untuk PostgreSQL
- **PostgreSQL** - Database
- **Nodemon** - Development tool untuk auto-reload

## Struktur Folder

```
backend/
├── config/
│   └── database.js          # Konfigurasi database Sequelize
├── controllers/
│   ├── eventController.js   # Controller untuk Events
│   ├── newsController.js    # Controller untuk News
│   ├── productController.js # Controller untuk Products
│   └── aboutController.js   # Controller untuk About
├── models/
│   ├── Event.js             # Model Event
│   ├── News.js              # Model News
│   ├── Product.js           # Model Product
│   └── About.js             # Model About
├── routes/
│   ├── eventRoutes.js       # Routes untuk Events
│   ├── newsRoutes.js        # Routes untuk News
│   ├── productRoutes.js     # Routes untuk Products
│   └── aboutRoutes.js       # Routes untuk About
├── .env.example             # Contoh file environment
├── .gitignore
├── package.json
├── server.js                # File utama server
└── README.md
```

## Instalasi

1. Install dependencies:
```bash
cd backend
npm install
```

2. Buat file `.env` dari `.env.example`:
```bash
cp .env.example .env
```

3. Edit file `.env` dan sesuaikan konfigurasi database:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=golden_compass_club
DB_USER=postgres
DB_PASSWORD=your_password

PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

4. Pastikan PostgreSQL sudah berjalan dan database sudah dibuat.

5. Jalankan server:
```bash
# Development mode (dengan nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get single news
- `POST /api/news` - Create new news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=jersey` - Get products by category
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### About
- `GET /api/about` - Get about content
- `PUT /api/about` - Update about content

### Health Check
- `GET /api/health` - Check server status

## Contoh Request

### Create Event
```bash
POST /api/events
Content-Type: application/json

{
  "title": "Event Title",
  "description": "Event Description",
  "date": "2024-12-25",
  "location": "Jakarta",
  "image": "https://example.com/image.jpg"
}
```

### Create News
```bash
POST /api/news
Content-Type: application/json

{
  "title": "News Title",
  "excerpt": "News Excerpt",
  "content": "News Content",
  "image": "https://example.com/image.jpg",
  "date": "2024-12-25"
}
```

### Create Product
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "price": 100000,
  "description": "Product Description",
  "category": "jersey",
  "stock": 10,
  "image": "https://example.com/image.jpg"
}
```

## Catatan

- Database akan otomatis di-sync saat server pertama kali dijalankan
- Pastikan PostgreSQL sudah terinstall dan berjalan
- Untuk development, gunakan `npm run dev` untuk auto-reload dengan nodemon

