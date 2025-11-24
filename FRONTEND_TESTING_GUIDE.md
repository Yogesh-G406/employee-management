# Frontend Manual Testing Guide

## Prerequisites
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173`

## Test Cases

### 1. Initial Load
- [ ] Open `http://localhost:5173` in browser
- [ ] Verify page loads without errors
- [ ] Check that "Employee Management" title is visible
- [ ] Verify "Add Employee" button is present

### 2. Add New Employee
- [ ] Click "Add Employee" button
- [ ] Verify form appears with all fields:
  - First Name
  - Last Name
  - Email
  - Position
  - Department
- [ ] Fill in the form:
  - First Name: "Alice"
  - Last Name: "Johnson"
  - Email: "alice.johnson@example.com"
  - Position: "Software Engineer"
  - Department: "Engineering"
- [ ] Click "Submit" button
- [ ] Verify redirect to employee list
- [ ] Verify new employee card appears

### 3. View Employee List
- [ ] Verify employee cards display:
  - Avatar with first letter of first name
  - Full name
  - Position
  - Email
  - Department
- [ ] Verify hover effects on cards
- [ ] Verify Edit and Delete buttons appear on hover

### 4. Edit Employee
- [ ] Hover over an employee card
- [ ] Click the Edit button (pencil icon)
- [ ] Verify form is pre-filled with employee data
- [ ] Change Position to "Senior Software Engineer"
- [ ] Click "Submit"
- [ ] Verify redirect to list
- [ ] Verify changes are reflected in the card

### 5. Delete Employee
- [ ] Hover over an employee card
- [ ] Click the Delete button (trash icon)
- [ ] Verify employee is removed from list

### 6. Responsive Design
- [ ] Resize browser to mobile width (375px)
- [ ] Verify layout adapts to single column
- [ ] Verify all buttons are accessible
- [ ] Verify form is usable on mobile
- [ ] Test on tablet width (768px)
- [ ] Verify 2-column grid on tablet

### 7. UI/UX Features
- [ ] Verify smooth animations when cards appear
- [ ] Check gradient avatar backgrounds
- [ ] Verify shadow effects on cards
- [ ] Test button hover states
- [ ] Verify input field focus states
- [ ] Check color scheme (indigo/purple theme)

### 8. Error Handling
- [ ] Try submitting form with empty required fields
- [ ] Verify validation messages appear
- [ ] Try adding employee with duplicate email
- [ ] Check console for errors

### 9. Navigation
- [ ] Click "Back to List" from Add/Edit form
- [ ] Verify navigation works correctly
- [ ] Test browser back/forward buttons

## Expected Results
✅ All features should work smoothly
✅ UI should be visually appealing with premium design
✅ Animations should be smooth
✅ Mobile responsive layout should work perfectly
✅ No console errors
