# React-Django-Secure-E-Commerce

> [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Security-focused e-commerce website with robust user authentication, session management, and secure post-authentication
forms written in TypeScript with React and Python with Django.

## Requirements:

- [Node.js](https://nodejs.org/en/download/)

- [Python](https://www.python.org/downloads/)

- A browser that supports modern JS and cookies (Chrome/Firefox)

## Setup:

### Backend (ss_backend)

1. Navigate to the backend directory:
    ```
    cd ss_backend
    ```
2. Set up a virtual environment (recommended)

3. Install Python dependencies:
    ```
    pip install -r requirements.txt
    ```

4. Apply database migrations:
    ```
    python manage.py migrate
    ```

5. Create a superuser (optional, for admin access):
    ```
    python manage.py createsuperuser
    ```

6. Run the backend development server:
    ```
    python manage.py runserver
    ```

### Frontend (ss-frontend)

1. Navigate to the frontend directory:
    ```
    cd ss-frontend
    ```

2. Install Node.js dependencies:
    ```
    npm install
    ```

3. Fix security issues (optional, if a fix for any vulnerability is available):
    ```
    npm audit fix
    ```

4. Start the frontend development server:
    ```
    npm run dev
    ```

## Security Features:

### Authentication & Session Management

- JWT-based access + refresh token system with short time-to-live for access tokens (15 minutes)

- Refresh token rotation and blacklisting

- Generic error messages to prevent account enumeration

- Secure password storage via `PBKDF2`

- Logout revokes token both client and server side

- Role-based access control (customers/sellers/admins)

### Secure Form Handling

- Strong input validation on all fields (frontend + backend)

- XSS and SQL Injection sanitization via `DOMPurify`

- Parametrized DB queries to prevent SQL injection

- Strict length checks and buffer overflow prevention

- Content-Type and MIME validation on file or URL fields

### Attack Mitigations

- Cross-Site Scripting (XSS)

- SQL Injection

- Cross-Site Request Forgery (CSRF)

- Broken Access Control

- Brute Force and Dictionary attacks

- Command Injection

- Insecure Direct Object References (IDOR)

- Buffer Overflow

- Cryptographic Failures / Sensitive Data Exposure

- Misconfiguration and sensitive endpoint exposure

### Secure Forgot Password Flow

- Secure OTP generation with `secrets`

- Short-lived OTP validity (10 minutes)

- No account exposure via OTP feedback

### Static Code Analysis

- ESLint / TSLint

- TypeScript static typing

- Python `typing` module

- IntelliJ inspections

- Npm `audit` command

- Python Security plugin for IntelliJ

## Known Vulnerabilities

- Frontend: 0 vulnerabilities at the time of last update

- Backend: 1 transitive vulnerability at the time of last update
    - [CVE-2024-53861](https://nvd.nist.gov/vuln/detail/CVE-2024-53861)

## Deployment Notes

- Sending OTPs is not implemented, it is only generated and can be validated

- Sending Email warnings and Two-factor authentication (2FA) confirmations are not implemented

- Payment processing is not implemented

- Disable Django `DEBUG` in production

- Use secure `SECRET_KEY` in Django

- Specify `ALLOWED_HOSTS` in Django

- Use HTTPS with proper TLS setup

- Enable `CORS_ORIGIN_WHITELIST`and CSRF protection

- Store JWT access token securely in HttpOnly cookies or session

- Host behind a Web Application Firewall like Cloudflare for DoS protection

- Use a `.env` file to store all configurations including but not limited to `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`,
  `API_URL`, `DATABASE_URL`, `EMAIL_HOST`

## Threat Modeling: Attack Tree

This project includes a partial Attack Tree diagram to visualize and understand the potential vulnerabilities in the
system.
An attack tree is a structured representation of the different ways an attacker could compromise the application.
It shows:

- Key attack vectors like login, session management, and form submissions

- Entry points for XSS, SQL injection, CSRF, and privilege escalation

- Possible attacker goals, such as data theft, unauthorized purchases, or account takeover

### Note

This attack tree is not exhaustive.
It is a work-in-progress and focuses on the most critical areas of the application
based on the current implementation and known attack surface.

### Attack Tree Diagram

<br>![Attack_Tree_Diagram](https://i.postimg.cc/BQ7w7M79/Attack-Tree.png) <br><br>

## E-Commerce Features:

- Login, registration, and email-based password reset

- Product listing and checkout for customers

- Sellers can create or remove listings

- Contact/Feedback form

- Responsive Design supporting phones, tablets and laptops

- Dark and Light theme

- Material Design

## Disclaimer:

> **Do not deploy this application in a real-world or commercial environment**

While the system demonstrates strong security principles such as robust authentication, input validation, and secure
session management, it is still intended solely for educational and demonstration purposes.

This project does not include all the privacy, performance, error-handling, or compliance features necessary for
real-world deployment. For example:

- No integration with real payment gateways or banking APIs

- Limited scalability and fault tolerance

- No multi-device sessions management

- No production-grade logging, monitoring, or disaster recovery

- No PIPEDA/GDPR or other legal compliance considerations

- No user consent or data management workflows

- No localization support

- No support for validating non-Canadian phone numbers/addresses/card details

- No support for currencies other than the Canadian Dollar

## Screenshots:

- Login Page:

  <br>![Login_Page](https://i.postimg.cc/NMMcSpq3/Sign-In.png) <br><br>

- Sign Up Page:

  <br>![Sign_Up_Page](https://i.postimg.cc/76Wkk0qf/Sign-Up.png) <br><br>

- Store Page:

  <br>![Store_Page](https://i.postimg.cc/hvQqPvGM/Store.png) <br><br>

- Cart:

  <br>![Cart](https://i.postimg.cc/ZqjmwXgP/Cart.png) <br><br>

- Checkout Form:

  <br>![Checkout_Form](https://i.postimg.cc/CxTw5Gk8/Checkout.png) <br><br>

- Seller's Listings Page:

  <br>![Listings_Page](https://i.postimg.cc/QMjskj6x/Listings.png) <br><br>

- Seller's Listing Creation Form:

  <br>![Create_Listing_Form](https://i.postimg.cc/FHyNLYVB/Create-Listing-Form.png) <br><br>

### Important Disclaimer for Product Images

Please note that the telescopes displayed in the above "Store Page", "Cart", and "Seller's Listings Page" images are
real-world products and appear for demonstration purposes only.
The prices shown may not reflect the actual retail price of these products.
This is a sample store created to illustrate the functionality and appearance of this e-commerce platform.

No endorsement or affiliation with any specific telescope manufacturer or brand is implied or intended.
The inclusion of these product images does not constitute an advertisement or an offer to sell these particular
telescopes.
All product names, logos, and brands are property of their respective owners.
