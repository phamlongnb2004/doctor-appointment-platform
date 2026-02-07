# Shopping Cart System - Complete Implementation

## Overview
Implemented a full-featured shopping cart system for medical services with session-based and user-based cart management.

## Database Schema

### Tables Created
1. **carts** - Main cart table
   - `id` (BIGINT, Primary Key)
   - `user_id` (BIGINT, nullable) - For logged-in users
   - `session_id` (VARCHAR(255), nullable) - For guest users
   - `created_at`, `updated_at` (TIMESTAMP)

2. **cart_items** - Cart items table
   - `id` (BIGINT, Primary Key)
   - `cart_id` (BIGINT, Foreign Key to carts)
   - `service_id` (BIGINT, Foreign Key to medical_services)
   - `quantity` (INT)
   - `price` (DECIMAL(10,2)) - Price at time of adding
   - `created_at`, `updated_at` (TIMESTAMP)

## Backend Implementation

### Models
- **Cart.java** - Cart entity with relationships
- **CartItem.java** - Cart item entity with service relationship

### DTOs
- **AddToCartRequest** - Request for adding items
- **CartResponse** - Cart data with totals
- **CartItemResponse** - Cart item with service details

### Service Layer
**CartService.java** - Business logic:
- `addToCart()` - Add item or update quantity
- `getCart()` - Get cart by userId or sessionId
- `updateCartItem()` - Update item quantity
- `removeCartItem()` - Remove item from cart
- `clearCart()` - Clear all items

### Controller
**CartController.java** - REST endpoints:
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart
- `PUT /api/cart/items/{itemId}` - Update item quantity
- `DELETE /api/cart/items/{itemId}` - Remove item
- `DELETE /api/cart/clear` - Clear cart

## Frontend Implementation

### Context
**CartContext.js** - Global cart state management:
- Session ID generation for guest users
- User ID detection for logged-in users
- Cart state with items, totalItems, totalAmount
- Methods: addToCart, updateCartItem, removeCartItem, clearCart, refreshCart
- Auto-load cart on mount

### Pages
**CartPage.js** - Shopping cart page:
- Cart items list with images
- Quantity controls
- Remove item buttons
- Order summary with totals
- Checkout button
- Continue shopping button
- Empty cart state
- Mobile responsive design

### Components Updated
**Header.js**:
- Added cart icon with badge showing item count
- Badge updates automatically when cart changes
- Click navigates to /cart page

**ServiceDetailPage.js**:
- Integrated CartContext
- "Add to Cart" button adds to cart
- "Buy Now" button adds to cart and navigates to cart page
- Loading state while adding
- Disabled when out of stock

### Styling
**cart.css** - Cart page styles:
- Clean, modern design
- Hover effects on cart items
- Mobile responsive layout
- Proper spacing and alignment

### Routes
Added `/cart` route in App.js

### App Integration
- Wrapped entire app with `<CartProvider>`
- Cart state available throughout the app

## Features

### Session Management
- **Guest Users**: Cart stored by session ID (localStorage)
- **Logged-in Users**: Cart stored by user ID
- Session persists across page refreshes
- Cart merges when user logs in (future enhancement)

### Cart Operations
1. **Add to Cart**
   - Add new item or increase quantity if exists
   - Uses discounted price if available
   - Shows success message
   - Updates cart badge immediately

2. **Update Quantity**
   - Increase/decrease quantity
   - Validates against available stock
   - Recalculates totals

3. **Remove Item**
   - Remove single item
   - Shows confirmation message
   - Updates totals

4. **Clear Cart**
   - Remove all items at once
   - Confirmation message

### UI/UX Features
- Real-time cart badge in header
- Loading states for all operations
- Success/error messages
- Empty cart state with call-to-action
- Product images in cart
- Price display with formatting
- Quantity controls with validation
- Subtotal calculations
- Free shipping indicator
- Mobile responsive design

## Testing Steps

1. **Add to Cart (Guest User)**
   ```
   - Go to /services
   - Click on a service
   - Change quantity
   - Click "Add to Cart"
   - Check cart badge updates
   - Click cart icon
   - Verify item appears in cart
   ```

2. **Update Quantity**
   ```
   - In cart page, change quantity
   - Verify subtotal updates
   - Verify total updates
   ```

3. **Remove Item**
   ```
   - Click "Remove" button
   - Verify item removed
   - Verify totals recalculated
   ```

4. **Clear Cart**
   ```
   - Click "Clear All"
   - Verify all items removed
   - Verify empty state shown
   ```

5. **Buy Now**
   ```
   - From service detail page
   - Click "Buy Now"
   - Verify redirected to cart
   - Verify item added
   ```

6. **Session Persistence**
   ```
   - Add items to cart
   - Refresh page
   - Verify cart persists
   ```

## API Endpoints

### Add to Cart
```
POST /api/cart/add
Body: {
  "serviceId": 1,
  "quantity": 2,
  "sessionId": "session_xxx" (for guests)
}
Query: ?userId=1 (for logged-in users)
```

### Get Cart
```
GET /api/cart?userId=1
or
GET /api/cart?sessionId=session_xxx
```

### Update Item
```
PUT /api/cart/items/1?quantity=3&userId=1
or
PUT /api/cart/items/1?quantity=3&sessionId=session_xxx
```

### Remove Item
```
DELETE /api/cart/items/1?userId=1
or
DELETE /api/cart/items/1?sessionId=session_xxx
```

### Clear Cart
```
DELETE /api/cart/clear?userId=1
or
DELETE /api/cart/clear?sessionId=session_xxx
```

## Files Created/Modified

### Created
- `database/create_cart_tables.sql`
- `backend/src/main/java/com/doctorappointment/model/Cart.java`
- `backend/src/main/java/com/doctorappointment/model/CartItem.java`
- `backend/src/main/java/com/doctorappointment/repository/CartRepository.java`
- `backend/src/main/java/com/doctorappointment/repository/CartItemRepository.java`
- `backend/src/main/java/com/doctorappointment/dto/AddToCartRequest.java`
- `backend/src/main/java/com/doctorappointment/dto/CartResponse.java`
- `backend/src/main/java/com/doctorappointment/dto/CartItemResponse.java`
- `backend/src/main/java/com/doctorappointment/service/CartService.java`
- `backend/src/main/java/com/doctorappointment/controller/CartController.java`
- `frontend/src/contexts/CartContext.js`
- `frontend/src/pages/CartPage.js`
- `frontend/src/styles/cart.css`

### Modified
- `frontend/src/components/Header.js` - Added cart icon with badge
- `frontend/src/pages/ServiceDetailPage.js` - Integrated cart functionality
- `frontend/src/App.js` - Added CartProvider and cart route

## Next Steps (Future Enhancements)

1. **Checkout Process**
   - Payment integration
   - Order creation
   - Order confirmation

2. **Cart Merging**
   - Merge guest cart with user cart on login

3. **Wishlist**
   - Save items for later
   - Move to cart from wishlist

4. **Stock Validation**
   - Real-time stock checking
   - Prevent over-ordering

5. **Coupon System**
   - Apply discount codes
   - Calculate discounts

6. **Cart Persistence**
   - Save cart to database for logged-in users
   - Sync across devices

## Status
✅ **COMPLETE** - Shopping cart system fully implemented and functional

## URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- Cart Page: http://localhost:3000/cart
- Services: http://localhost:3000/services
