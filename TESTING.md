# Testing Guide - Campus Pay

## Table of Contents
- [Manual Testing](#manual-testing)
- [Test Scenarios](#test-scenarios)
- [API Testing](#api-testing)
- [Future Automated Testing](#future-automated-testing)

## Manual Testing

### Prerequisites
- Application running locally (see README.md)
- Two browser windows or incognito mode for testing different user roles
- Stripe test account

## Test Scenarios

### 1. Authentication Tests

#### Test Case 1.1: User Registration
**Steps:**
1. Navigate to http://localhost:5173
2. Click "Register"
3. Fill in the form:
   - Email: `test.student@campus.edu`
   - Password: `Test123!`
   - First Name: `Test`
   - Last Name: `Student`
   - Role: `Student`
   - Student ID: `TEST001`
4. Click "Register"

**Expected Result:**
- User is created and logged in
- Redirected to dashboard
- Dashboard shows $0.00 balance

#### Test Case 1.2: User Login
**Steps:**
1. Navigate to login page
2. Enter credentials:
   - Email: `student@campus.edu`
   - Password: `student123`
3. Click "Login"

**Expected Result:**
- User is authenticated
- JWT token stored in localStorage
- Redirected to dashboard
- Navbar shows user name

#### Test Case 1.3: Invalid Login
**Steps:**
1. Attempt login with wrong password
2. Attempt login with non-existent email

**Expected Result:**
- Error message displayed
- User remains on login page

#### Test Case 1.4: Protected Routes
**Steps:**
1. Logout
2. Try accessing `/dashboard` directly

**Expected Result:**
- Redirected to login page

#### Test Case 1.5: Role-Based Access
**Steps:**
1. Login as student
2. Try accessing `/admin/charges`

**Expected Result:**
- Redirected to dashboard (no access)

### 2. Student Dashboard Tests

#### Test Case 2.1: View Balance
**Steps:**
1. Login as student
2. View dashboard

**Expected Result:**
- Balance displayed prominently
- Shows "No outstanding balance" if $0.00
- Shows "Amount Due" if balance > 0

#### Test Case 2.2: View Charges
**Steps:**
1. Login as student
2. Check unpaid charges table

**Expected Result:**
- Table shows all unpaid charges
- Columns: Description, Category, Semester, Due Date, Amount
- Checkboxes for selection

#### Test Case 2.3: Select Multiple Charges
**Steps:**
1. Check multiple charge checkboxes
2. View selected total

**Expected Result:**
- Total updates dynamically
- Shows count of selected charges
- "Pay Now" button enabled

#### Test Case 2.4: Payment History
**Steps:**
1. Scroll to Payment History section
2. Review past payments

**Expected Result:**
- Shows date, amount, status
- Status badges (completed/pending/failed)
- Truncated transaction IDs

### 3. Payment Processing Tests

#### Test Case 3.1: Successful Payment
**Steps:**
1. Select one or more unpaid charges
2. Click "Pay Now"
3. Enter Stripe test card: `4242 4242 4242 4242`
4. Expiry: `12/34`, CVC: `123`
5. Click "Pay Now"

**Expected Result:**
- Payment processed successfully
- Charges marked as paid
- Balance updated
- Payment appears in history
- Hold removed (if balance is $0)

#### Test Case 3.2: Failed Payment
**Steps:**
1. Select charges
2. Use declining test card: `4000 0000 0000 0002`
3. Attempt payment

**Expected Result:**
- Payment fails with error message
- Charges remain unpaid
- Balance unchanged

#### Test Case 3.3: Payment Cancellation
**Steps:**
1. Select charges
2. Click "Pay Now"
3. Click "Cancel" in payment form

**Expected Result:**
- Payment form closes
- No payment created
- Selection maintained

### 4. Admin - Charge Management Tests

#### Test Case 4.1: Create Charge
**Steps:**
1. Login as admin (`admin@campus.edu` / `admin123`)
2. Navigate to "Manage Charges"
3. Click "Add New Charge"
4. Fill form:
   - Student: Select from dropdown
   - Amount: `250.00`
   - Description: `Lab Fee - Chemistry 101`
   - Category: `Lab Fees`
   - Semester: `Spring 2026`
   - Due Date: Select future date
5. Submit

**Expected Result:**
- Charge created successfully
- Appears in charges list
- Student sees charge in their dashboard

#### Test Case 4.2: View All Charges
**Steps:**
1. Navigate to "Manage Charges"
2. Review charges table

**Expected Result:**
- Shows all charges for all students
- Displays student ID, description, category, amount, status

#### Test Case 4.3: Delete Unpaid Charge
**Steps:**
1. Find an unpaid charge
2. Click "Delete"
3. Confirm deletion

**Expected Result:**
- Charge removed from list
- Student no longer sees charge

#### Test Case 4.4: Cannot Delete Paid Charge
**Steps:**
1. Find a paid charge

**Expected Result:**
- No delete button visible for paid charges

### 5. Admin - User Management Tests

#### Test Case 5.1: View All Students
**Steps:**
1. Login as admin
2. Navigate to "Manage Users"

**Expected Result:**
- Table shows all students
- Displays: Student ID, Name, Email, Balance, Hold Status

#### Test Case 5.2: Add Account Hold
**Steps:**
1. Find student with no hold
2. Click "Add Hold"

**Expected Result:**
- Hold status changes to "Hold Active"
- Student cannot make payments
- Student sees hold warning on dashboard

#### Test Case 5.3: Remove Account Hold
**Steps:**
1. Find student with hold
2. Click "Remove Hold"

**Expected Result:**
- Hold status changes to "No Hold"
- Student can make payments

### 6. Integration Tests

#### Test Case 6.1: Full Student Payment Flow
**Steps:**
1. Admin creates charge for student
2. Student logs in
3. Student sees new charge
4. Student pays charge
5. Admin verifies payment
6. Admin checks student has no hold

**Expected Result:**
- Complete flow works end-to-end
- Data consistent across views

#### Test Case 6.2: Multi-Charge Payment
**Steps:**
1. Admin creates 3 charges for student
2. Student selects all 3 charges
3. Student pays in single transaction

**Expected Result:**
- All 3 charges marked as paid
- Single payment record created
- Balance updated correctly

## API Testing

### Using cURL

#### Health Check
```bash
curl http://localhost:5001/health
```

#### Register User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api.test@campus.edu",
    "password": "Test123!",
    "firstName": "API",
    "lastName": "Test",
    "role": "student",
    "studentId": "API001"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@campus.edu",
    "password": "student123"
  }'
```

#### Get Charges (with token)
```bash
curl http://localhost:5001/api/charges \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API endpoints
2. Create environment variables for:
   - `base_url`: `http://localhost:5001`
   - `token`: Save from login response
3. Test each endpoint with different scenarios

### Using Thunder Client (VS Code Extension)

Create collection with all endpoints and test scenarios.

## Future Automated Testing

### Unit Tests (Jest)

**Example test structure:**

```javascript
// server/src/models/__tests__/UserModel.test.ts
describe('UserModel', () => {
  test('should create user', () => {
    const user = UserModel.create({...});
    expect(user.id).toBeDefined();
  });
  
  test('should find user by email', () => {
    const user = UserModel.findByEmail('test@example.com');
    expect(user).toBeDefined();
  });
});
```

### Integration Tests (Supertest)

**Example test structure:**

```javascript
// server/src/routes/__tests__/auth.test.ts
describe('POST /api/auth/login', () => {
  test('should login valid user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@campus.edu',
        password: 'student123'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
```

### E2E Tests (Playwright)

**Example test structure:**

```javascript
// e2e/student-payment.spec.ts
test('student can pay charges', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('[name="email"]', 'student@campus.edu');
  await page.fill('[name="password"]', 'student123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/dashboard/);
  
  // Select charge and pay
  await page.click('input[type="checkbox"]');
  await page.click('text=Pay Now');
  
  // Fill Stripe form
  // ... payment flow
  
  await expect(page.locator('text=Payment successful')).toBeVisible();
});
```

## Test Coverage Goals

- [ ] Unit Tests: 80%+ coverage
- [ ] Integration Tests: All API endpoints
- [ ] E2E Tests: Critical user flows
- [ ] Security Tests: OWASP top 10
- [ ] Performance Tests: Load testing

## Reporting Issues

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/error messages
5. Browser/environment details
6. Console errors (if any)
