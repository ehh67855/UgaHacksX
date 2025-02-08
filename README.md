# UgaHacksX

## Prerequisites
Ensure you have the following installed on your system:
- **Maven**: Required for building the backend.
- **Java 17**: The project is compatible with Java 17.
- **MySQL**: Required for the database.

## Database Configuration

Open a terminal and log into MySQL:
   ```sh
   mysql -u root -p
   ```
Create the project database abnd grant yourself prilages
```sql
CREATE DATABASE ugahacks;
CREATE USER 'springuser'@'localhost' IDENTIFIED BY 'UgaHacksX@2025';
GRANT ALL PRIVILEGES ON ugahacks.* TO 'springuser'@'localhost';
FLUSH PRIVILEGES;
```

Ensure your user was created
```sql
SELECT user, host FROM mysql.user WHERE user = 'springuser';
```

## Frontend setup
Change into the frontend folder and run:
```sh
npm install
npm install -g nx
```

## Starting the application
1. Start the frontend
```sh
cd frontend
npm start
```

Start the backend
```sh
cd backend
mvn spring-boot:run
```
