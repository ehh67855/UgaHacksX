# MixStash
> Like Git -- but for audio engineers.


## Prerequisites
Ensure you have the following installed on your system:
- **Maven**
- **Java 17**
- **MySQL**
- Node.js 18+
- npm or yarn


## Database Configuration

Open a terminal and log into MySQL:
   ```sh
   mysql -u root -p
   ```
Create the project database and grant yourself privileges
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
Change into the `frontend-2-nextjs` folder and run:
```sh
npm install
```

## Starting the application
1. Start the frontend
```sh
cd frontend-2-nextjs
npm run dev
```

Start the backend
```sh
cd backend
mvn spring-boot:run
```

## Technical Details of the Backend

Once we had our idea, we got to work setting up the basic structure of the app. We built the backend using Spring Boot and set up OAuth authentication along with an SQL database to handle user and project data. We stuck to the MVC architecture to keep everything clean and manageable.

### Authentication
For authentication, we made it so users could sign up and log in through email using an SMTP server. We implemented a JWT authentication manager to keep user sessions secure without requiring constant logins. The JWT tokens are generated and validated using a secret key defined in the application properties.

### Database
We used MySQL as our database to store user and project data. The database schema is managed using JPA with Hibernate as the ORM provider. This allows us to define our database entities as Java classes and manage database operations through repository interfaces.

### Email Service
We integrated an email service using Spring Boot's mail starter. This service is used to send activation emails to users upon registration. The email contains a token that the user must use to activate their account.

### Project Management
The backend supports project management features, including creating projects, uploading project versions, and managing project comments. Each project can have multiple versions, and each version can store binary data. We used Spring's MultipartFile to handle file uploads.

### Lombok
To reduce boilerplate code, we used Lombok annotations such as `@Data`, `@RequiredArgsConstructor`, and `@Builder`. This helps in generating getters, setters, constructors, and builders automatically, making the code more concise and readable.

### Security
We used Spring Security to secure our endpoints. The security configuration ensures that only authenticated users can access certain endpoints. We also implemented role-based access control to differentiate between regular users and administrators.


## Tehnical Details of Backend

## Technical Stack

### Core Technologies
- **Next.js 15** - React framework with App Router
- **React 19** - UI component library
- **TypeScript** - Static typing for JavaScript
- **Tailwind CSS** - Utility-first styling

### UI Components
- **Radix UI** - Headless component primitives
- **Custom Components**:
  - Toast notifications
  - Responsive sidebar
 
### Developer Experience
- **ESLint** & **Prettier** - Code quality tools
- **SWC** - Fast bundling and compilation

### Performance Features
- Server/Client component separation
- Custom font optimization (Geist Sans/Mono)
- Optimized asset loading

## Project Structure

```
frontend/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   │   └── ui/       # Shared UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   └── styles/       # Global styles
```

## Key Features
- Modern React patterns with TypeScript
- Component-based architecture
- Type-safe development
- Accessibility-first components
- Toast notification system
- Responsive design
