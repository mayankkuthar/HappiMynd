# HappiMynd OTP Authentication — API & Navigation Guide

This document describes the OTP-based authentication APIs used by the HappiMynd mobile app, so the same flows can be re-implemented on the web.

## Base Information

| Item | Value |
|------|-------|
| Base URL | `https://happimynd.com` |
| Content-Type | `application/json` |
| Auth header | `Authorization: Bearer <access_token>` (only for authenticated endpoints) |

> The OTP endpoints below are **public** (no auth token required).

---

## 1. OTP Login Flow (Phone)

The web version uses two calls for phone-OTP login:

1. **Send Login OTP** — sends an SMS OTP to the phone.
2. **Verify Login OTP** — validates the OTP. The response tells you whether the user already has an account (→ login) or is a new user (→ start registration).

### 1.1 Send Login OTP

Sends a one-time password to the given phone number.

- **Endpoint:** `POST /api/v1/send-login-otp`
- **Auth:** None

**Request body (mobile):**

```json
{
  "type": "mobile",
  "mobile": "9876543210",
  "country_code": "91"
}
```

**Request body (email):**

```json
{
  "type": "email",
  "email": "user@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | `"mobile"` or `"email"` |
| `mobile` | string | Yes (if type=mobile) | Phone number without country code |
| `country_code` | string | Yes (if type=mobile) | e.g. `"91"` (no `+`) |
| `email` | string | Yes (if type=email) | Email address |

**Success response:**

```json
{
  "status": "success",
  "message": "OTP sent to your phone"
}
```

**Error response:**

```json
{
  "status": "error",
  "message": "Failed to send OTP"
}
```

**Client behaviour (from app):**
- Show a **120-second resend cooldown** after a successful send.
- On failure, show `message` from the response as a toast/snackbar.
- Reference: `sendLoginOTP()` in `src/context/Hcontext.js:702`.

### 1.2 Verify Login OTP

Validates the OTP received by the user.

- **Endpoint:** `POST /api/v1/verify-login-otp`
- **Auth:** None

**Request body:**

```json
{
  "mobile": "9876543210",
  "country_code": "91",
  "otp": "123456"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mobile` | string | Yes | Phone number without country code |
| `country_code` | string | Yes | e.g. `"91"` (no `+`) |
| `otp` | string | Yes | OTP received via SMS |

**Case A — Existing user (login success):**

```json
{
  "status": "success",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "..."
}
```

**Case B — New user (no account yet):**

```json
{
  "status": "register",
  "mobile_verified_token": "<token>",
  "message": "..."
}
```

**Error response:**

```json
{
  "status": "error",
  "message": "OTP incorrect"
}
```

**Client behaviour (from app):**

| Response | Action on web |
|----------|---------------|
| `access_token` present | Store token (e.g. in `localStorage`), redirect to app Home/dashboard. |
| `status === "register"` and `mobile_verified_token` present | Redirect to "Getting Started" → registration, carrying `mobile`, `country_code` and `mobile_verified_token` forward. |
| otherwise | Show `message` (invalid OTP) and let the user retry. |

- Reference: `verifyLoginOTP()` in `src/context/Hcontext.js:723`; screen logic in `src/screens/Auth/Login.js:86` and `src/screens/Auth/PhoneRegistration.js:115`.

---

## 2. Registration via OTP (New User)

When `verify-login-otp` returns `status: "register"`, the user must complete a short registration. The phone was already verified, so registration does **not** re-request the OTP — it just collects profile details and creates the account.

### 2.1 Sign Up (create account)

- **Endpoint:** `POST /api/v1/signup`
- **Auth:** None

**Request body:**

```json
{
  "nickname": "John",
  "user_profile_id": 1,
  "age": 25,
  "gender": "male",
  "username": "john_doe",
  "password": "secret123",
  "confirm_password": "secret123",
  "signup_type": "individual",
  "country_code": "91",
  "mobile": "9876543210",
  "language": 1,
  "device_token": "fcm-device-token",
  "mobile_verified_token": "<token from verify-login-otp>"
}
```

**Success response (logs the user in):**

```json
{
  "status": "success",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Account created successfully"
}
```

**Client behaviour:**
- Store `access_token`, redirect to Home/dashboard.
- Reference: `userSignup()` in `src/context/Hcontext.js:239`; screen `src/screens/Auth/PhoneRegistration.js:144`.

> `mobile_verified_token` proves the phone was verified via OTP. For organisation-sponsored signups (`signup_type: "organisation"`), also send `happimyndCode`.

---

## 3. Password Reset Flow (OTP based)

Although separate from login, the password reset flow also uses OTP verification and may be useful on the web.

### 3.1 Forgot Password (send verification code)

- **Endpoint:** `POST /api/v1/forgot-password`
- **Auth:** None

**Request body:**

```json
{
  "email": "user@example.com",
  "type": "email",
  "mobile": ""
}
```

or

```json
{
  "email": "",
  "type": "mobile",
  "mobile": "9876543210"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | one of email/mobile | Email address |
| `mobile` | string | one of email/mobile | Phone number |
| `type` | string | Yes | `"email"` or `"mobile"` |

**Success response:**

```json
{
  "status": "success",
  "message": "Verification code sent"
}
```

**Client behaviour:**
- On success, navigate to the "Enter verification code" step.
- Reference: `forgotPassword()` in `src/context/Hcontext.js:327`; screen `src/screens/Auth/ForgotPassword.js`.

### 3.2 Verify OTP

- **Endpoint:** `POST /api/v1/verify-otp`
- **Auth:** None

**Request body:**

```json
{
  "email": "user@example.com",
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Success response:**

```json
{
  "status": "success",
  "message": "OTP verified"
}
```

**Client behaviour:**
- On success, navigate to "Reset password".
- On error, show "OTP incorrect".
- Reference: `verifyOtp()` in `src/context/Hcontext.js:345`; screen `src/screens/Auth/VerificationCode.js`.

### 3.3 Reset Password

- **Endpoint:** `POST /api/v1/reset-password`
- **Auth:** None

**Request body:**

```json
{
  "password": "newPass123",
  "confirm_password": "newPass123",
  "email": "user@example.com",
  "mobile": "9876543210"
}
```

**Success response:**

```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

**Client behaviour:**
- On success, redirect to the Login screen.
- Reference: `resetPassword()` in `src/context/Hcontext.js:363`; screen `src/screens/Auth/ResetPassword.js`.

---

## 4. Parental/Guardian OTP (Optional, Minors 10–18)

If the registered user is aged 10–18, the app asks for parent contact details and verifies them with an OTP before allowing registration.

### 4.1 Guardian Verification (send OTP)

- **Endpoint:** `POST /api/v1/guardian-verification`
- **Auth:** None

**Request body:**

```json
{
  "type": "mobile",
  "random_unique_id": 1717244400000,
  "email": "parent@example.com",
  "mobile": "9876543210"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | `"mobile"` or `"email"` |
| `random_unique_id` | number | Yes | Client-generated timestamp (`Date.now()`). Sent back during verification. |
| `email` | string | one of email/mobile | Parent email |
| `mobile` | string | one of email/mobile | Parent phone |

### 4.2 Verify Guardian OTP

- **Endpoint:** `POST /api/v1/verify-guardian-otp`
- **Auth:** None

**Request body:**

```json
{
  "otp": "123456",
  "unique_id": 1717244400000
}
```

**Success response:**

```json
{
  "status": "success",
  "message": "Parent verified"
}
```

**Client behaviour:**
- On success, unlock the Register button (parent consent obtained).
- Reference: `guardianVerification()` / `verifyGuardianOtp()` in `src/context/Hcontext.js:174` & `:190`; component `src/components/common/ParentOtp.js`.

---

## 5. Related Login APIs (non-OTP)

These are part of the same auth module and are listed for completeness.

| Purpose | Method | Endpoint | Body |
|---------|--------|----------|------|
| Username/password login | POST | `/api/v1/login` | `{ username, password, device_token }` |
| Login with HappiMynd code | POST | `/api/v1/login-with-code` | `{ happimynd_code, device_token }` |
| Phone login (direct) | POST | `/api/v1/phone-login` | `{ mobile, country_code }` |
| Logout | GET | `/api/v1/logout` | (Auth) |
| Get profile | GET | `/api/v1/get-profile` | (Auth) |

> `device_token` is the FCM push-notification token (mobile only). On web you may omit it or leave it empty.

---

## 6. Navigation / Screen Flow

Flow as implemented with React Navigation. Screen names used in the app's `AuthStack` are shown in code font.

```
OnBoarding
    │ (after onboarding)
    ▼
Login ───────────────► "Login with Phone" tab
    │                        │
    │  (New user link)       │ enter mobile → Send Login OTP
    ▼                        ▼
GettingStarted         Verify OTP (120s resend cooldown)
    │                        │
    ├─ Organisation Sponsored  │ verify-login-otp
    │      ▼                    ▼
    │  RegisterWithCode   ┌─── access_token ────► store token → Home
    │                     │
    │  Self Sponsored     └─── mobile_verified_token ──► GettingStarted (params)
    │      ▼                        │
    └──► PhoneRegistration          ├─ Self → PhoneRegistration (step 3)
         (step 1: phone)            └─ Org  → RegisterWithCode
         (step 2: verify OTP)
         (step 3: register form) ──► /signup ──► access_token ──► Home

Login ─► "Login with Password" tab
    │  Forgot Password?
    ▼
ForgotPassword ──► /forgot-password
    │
    ▼
VerificationCode ──► /verify-otp
    │  (Resend Code → /forgot-password again)
    ▼
ResetPassword ──► /reset-password ──► success ──► navigate back to Login
```

### Key decision points for the web implementation

1. **Login screen** — two tabs: *Login with Phone* (OTP) and *Login with Password*. New users tap "New to HappiMynd?" → account-type selection screen.
2. **Phone login** — after `/verify-login-otp`:
   - If `access_token` is returned → authenticated, redirect to dashboard.
   - If `status === "register"` → treat as a new user and route to account-type selection, carrying `mobile`, `country_code`, `mobile_verified_token` in the URL/state.
3. **Registration** — because the phone is already verified, the registration form shows directly (no OTP step) and posts `/signup` with `mobile_verified_token`.
4. **Minors (10–18)** — show the guardian-consent block; disable the final "Register" button until `verify-guardian-otp` returns success.
5. **Session persistence** — on web use `localStorage`/cookies to store the `access_token` and restore the session on page load (mobile equivalent is `AsyncStorage`, see `apiClient.js`).

---

## 7. Reference Implementation (Code Locations)

| Concern | Location |
|---------|----------|
| OTP API clients | `src/context/Hcontext.js` (`sendLoginOTP`:702, `verifyLoginOTP`:723, `sendOTP`:669, `verifyOtp`:345, `forgotPassword`:327, `resetPassword`:363, `guardianVerification`:174, `verifyGuardianOtp`:190, `phoneLogin`:1447, `userSignup`:239) |
| Auth HTTP client (token interceptor) | `src/context/apiClient.js` |
| Login screen (phone/password tabs) | `src/screens/Auth/Login.js` |
| Phone registration (3-step) | `src/screens/Auth/PhoneRegistration.js` |
| Forgot password flow | `src/screens/Auth/ForgotPassword.js`, `VerificationCode.js`, `ResetPassword.js` |
| Guardian (parent) OTP | `src/components/common/ParentOtp.js` |
| Auth navigation stack | `src/routes/AuthStack/AuthStackScreen.js` |
| Base URL | `src/config/index.js` (`BASE_URL: "https://happimynd.com"`) |
