Searched codebase for "give me a prompt in markdown format which describes what to implement in each file, i have already added content to the entity folder. #codebase ", 43 results

Here’s a prompt in Markdown format describing what to implement in each file for your Spring Boot e-commerce platform for artists. Since your `entity` folder is already populated, this focuses on the remaining files and their responsibilities.

---

# Backend Implementation Plan

## 1. Repository Layer

Implement Spring Data JPA repositories for CRUD operations:

- **UserRepository.java**
  ```java
  // Interface extending JpaRepository<User, Long>
  // Custom query methods for finding users by username/email
  ```

- **ArtistRepository.java**
  ```java
  // Interface extending JpaRepository<ArtistProfile, Long>
  // Methods for searching artists by name or user
  ```

- **ArtworkRepository.java**
  ```java
  // Interface extending JpaRepository<Artwork, Long>
  // Methods for filtering artworks by artist, price, etc.
  ```

- **CartItemRepository.java**
  ```java
  // Interface extending JpaRepository<CartItem, Long>
  // Methods for finding cart items by user
  ```

- **OrderRepository.java**
  ```java
  // Interface extending JpaRepository<Order, Long>
  // Methods for finding orders by user, status, etc.
  ```

---

## 2. Service Layer

Implement business logic and interaction with repositories:

- **UserService.java**
  ```java
  // Methods for user registration, authentication, profile updates
  ```

- **ArtistService.java**
  ```java
  // Methods for managing artist profiles and their artworks
  ```

- **ArtworkService.java**
  ```java
  // Methods for adding, updating, deleting, and listing artworks
  ```

- **ShoppingService.java**
  ```java
  // Methods for cart management, order creation, checkout process
  ```

---

## 3. Controller Layer

Expose REST endpoints for frontend interaction:

- **UserController.java**
  ```java
  // Endpoints for user registration, login, profile management
  ```

- **ArtistController.java**
  ```java
  // Endpoints for artist profile management and artwork operations
  ```

- **ArtworkController.java**
  ```java
  // Endpoints for listing, searching, and viewing artworks
  ```

- **ShoppingController.java**
  ```java
  // Endpoints for cart operations, order placement, order history
  ```

- **AuthController.java**
  ```java
  // Endpoints for authentication (login, logout, token refresh)
  ```

- **AdminController.java**
  ```java
  // Endpoints for admin operations (user management, order oversight)
  ```

---

## 4. Configuration

- **SecurityConfig.java**
  ```java
  // Configure authentication and authorization (JWT, roles)
  ```

- **WebConfig.java**
  ```java
  // CORS, resource handlers, other web-related configuration
  ```

---

## 5. Application Properties

- **application.properties**
  ```properties
  # Add database connection, JPA, and security settings
  ```

---

**Note:**
- All repository interfaces should extend `JpaRepository`.
- Service classes should be annotated with `@Service`.
- Controller classes should be annotated with `@RestController` and mapped appropriately.
- Use dependency injection for service and repository beans.

---

You can copy this prompt into your documentation or issue tracker to guide development.