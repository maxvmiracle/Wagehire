# 🧪 Frontend Testing Guide

## 🎯 Overview
This guide will help you test all the fixes we've implemented to ensure your Wagehire application is working correctly.

## 📋 Pre-Testing Setup

### 1. Environment Configuration
Make sure your frontend has the correct environment variables:

```env
REACT_APP_API_BASE_URL=https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api
REACT_APP_SUPABASE_URL=https://xzndkdqlsllwyygbniht.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ
```

### 2. Clear Browser Data
- Clear browser cache and cookies
- Open browser in incognito/private mode for clean testing

## 🧪 Test Scenarios

### **Test 1: Registration Role Assignment** ✅

**Objective**: Verify that registration assigns correct roles

**Steps**:
1. Open the application in your browser
2. Go to `/register` page
3. Register a new user with the following data:
   - Email: `test-user-1@example.com`
   - Password: `TestPass123!`
   - Name: `Test User 1`
   - Phone: `1234567890`
   - Position: `Software Engineer`
   - Experience: `3`
   - Skills: `JavaScript, React, Node.js`

**Expected Results**:
- ✅ Registration should succeed
- ✅ User should be redirected to login page
- ✅ First user should become admin (if no users exist)
- ✅ Subsequent users should become candidates

**Verification**:
- Check the success message
- Try logging in with the new credentials

---

### **Test 2: Login and Authentication** ✅

**Objective**: Verify login works correctly

**Steps**:
1. Go to `/login` page
2. Login with the credentials from Test 1
3. Check if you're redirected to dashboard

**Expected Results**:
- ✅ Login should succeed
- ✅ Should be redirected to dashboard
- ✅ User data should be displayed correctly

**Verification**:
- Check dashboard shows correct user information
- Verify user role is displayed correctly

---

### **Test 3: Profile Update** ✅

**Objective**: Verify profile updates work and persist

**Steps**:
1. Login to the application
2. Go to `/profile` page
3. Click "Edit Profile" button
4. Update the following fields:
   - Name: `Updated Test User`
   - Phone: `9876543210`
   - Position: `Senior Software Engineer`
   - Experience: `5`
   - Skills: `JavaScript, React, Node.js, TypeScript, AWS, Docker`
5. Click "Save Changes"

**Expected Results**:
- ✅ Profile update should succeed
- ✅ Success message should appear
- ✅ Profile data should be updated immediately
- ✅ Changes should persist after page refresh

**Verification**:
- Check if the updated data appears in the form
- Refresh the page and verify data persists
- Check if profile completion percentage updates

---

### **Test 4: Profile Completion Icon** ✅

**Objective**: Verify profile completion icon updates correctly

**Steps**:
1. After updating profile in Test 3
2. Go to dashboard
3. Look at the profile section

**Expected Results**:
- ✅ Profile completion icon should update
- ✅ Should show "Profile Complete" if all fields are filled
- ✅ Should show "Update Profile" if fields are missing

**Verification**:
- Check if the icon changes from incomplete to complete
- Verify the completion percentage is accurate

---

### **Test 5: Interview Scheduling** ✅

**Objective**: Verify interview scheduling works correctly

**Steps**:
1. Login to the application
2. Go to `/schedule-interview` page
3. Fill out the interview form:
   - Company Name: `Test Company`
   - Job Title: `Software Engineer`
   - Scheduled Date: `2025-01-30`
   - Scheduled Time: `14:00`
   - Duration: `60`
   - Round: `1`
   - Status: `Scheduled`
   - Interview Type: `Technical`
   - Location: `Remote`
   - Notes: `Test interview`
   - Company Website: `https://testcompany.com`
   - Job Description: `Test job description`
   - Salary Range: `$80k - $120k`
   - Interviewer Name: `John Doe`
   - Interviewer Email: `john.doe@testcompany.com`
4. Click "Schedule Interview"

**Expected Results**:
- ✅ Interview should be created successfully
- ✅ Should be redirected to interviews page
- ✅ New interview should appear in the list

**Verification**:
- Check if the interview appears in `/interviews` page
- Verify all the data is saved correctly
- Check if the interview status is correct

---

### **Test 6: Interview Management** ✅

**Objective**: Verify interview listing and management

**Steps**:
1. Go to `/interviews` page
2. Check if the interview from Test 5 appears
3. Click on the interview to view details

**Expected Results**:
- ✅ Interview should be listed
- ✅ Interview details should be displayed correctly
- ✅ All fields should match what was entered

**Verification**:
- Check if company name, job title, and other details are correct
- Verify the interview date and time are displayed properly

---

### **Test 7: Dashboard Functionality** ✅

**Objective**: Verify dashboard displays correct information

**Steps**:
1. Go to `/dashboard` page
2. Check all sections

**Expected Results**:
- ✅ User information should be displayed correctly
- ✅ Profile completion should be accurate
- ✅ Navigation should work properly
- ✅ Role-based features should be accessible

**Verification**:
- Check if user name and role are displayed
- Verify profile completion percentage
- Test navigation links

---

### **Test 8: Admin vs Candidate Access** ✅

**Objective**: Verify role-based access control

**Steps**:
1. Login as admin user (first registered user)
2. Check available navigation items
3. Login as candidate user (subsequent users)
4. Compare available features

**Expected Results**:
- ✅ Admin should see all features (Users, Candidates, Admin Panel)
- ✅ Candidates should see limited features (Dashboard, Interviews, Profile)
- ✅ Role-based restrictions should work

**Verification**:
- Check navigation menu items
- Verify access to different pages
- Test admin-only features

## 🚨 Troubleshooting

### Common Issues and Solutions

**Issue**: Registration fails with 401 error
- **Solution**: Check if the API URL is correct in environment variables

**Issue**: Profile updates don't persist
- **Solution**: Clear browser cache and try again

**Issue**: Interview scheduling fails
- **Solution**: Make sure you're logged in and check browser console for errors

**Issue**: Profile completion icon doesn't update
- **Solution**: Refresh the page after profile update

## ✅ Success Criteria

All tests should pass with the following results:

- ✅ Registration assigns correct roles
- ✅ Login works for all users
- ✅ Profile updates persist and reflect in UI
- ✅ Profile completion icons update correctly
- ✅ Interview scheduling works
- ✅ Dashboard displays correct information
- ✅ Role-based access control works

## 🎉 Completion

Once all tests pass, your application is ready for production deployment!

---

**Next Steps After Testing**:
1. Deploy frontend to production (Vercel, Netlify, etc.)
2. Configure production environment variables
3. Test production deployment
4. Monitor application performance 