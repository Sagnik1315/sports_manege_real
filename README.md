# Sports Club Management Platform - Phase 1

## Overview

The Sports Club Management Platform is a web-based application developed to streamline athlete registration and administration for sports clubs.

This Phase 1 implementation focuses on:

* Athlete Registration System
* Database Integration
* Secure Admin Dashboard
* Athlete Data Management
* Document Upload and Management
* Data Export Functionality

The platform provides a complete workflow for athlete registration while allowing administrators to securely manage submitted applications.

---

## Live Demo

**Application:**
https://sports-manege-real.vercel.app/

**Admin Dashboard:**
https://sports-manege-real.vercel.app/admin/athletes

---

## Admin Credentials

Email:

```text
admin@sportsclub.com
```

Password:

```text
Admin@123
```

---

## Features

### Athlete Registration

Multi-step athlete registration process including:

#### 1. Personal Details

* Full Name
* Date of Birth
* Gender
* Mobile Number
* Email Address

#### 2. Guardian Details

* Guardian Name
* Relationship
* Contact Information

#### 3. Address Information

* State
* District
* City
* Pin Code
* Full Address

#### 4. Club / State Details

* Club Name
* State Association Information

#### 5. Competition Details

* Sport Selection
* Competition Category
* Age Group Classification

#### 6. Document Upload

* Image Upload Support
* Automatic Image Compression
* Secure Cloud Storage

---

## Validation Features

The application implements real-time validation:

### Mobile Number Validation

* Exactly 10 digits required

### Email Validation

* Standard email format validation

### Date of Birth Validation

* Automatic age calculation
* Dynamic age-group determination

### Required Field Validation

* Mandatory fields enforced before submission

### Document Validation

* Supported image formats
* File size validation
* Upload verification

---

## Admin Dashboard

The Admin Dashboard provides centralized athlete management.

### Dashboard Features

#### Athlete Listing

Displays:

* Name
* Mobile Number
* Age
* Age Group
* Competition Applied
* Status

#### Athlete Profile View

Administrators can view:

* Personal Details
* Guardian Information
* Address Information
* Competition Information
* Uploaded Documents

#### Document Access

Administrators can securely access uploaded documents.

#### Export Functionality

Athlete registration data can be exported for reporting and record keeping.

---

## Security Features

### Authentication

* Secure Admin Login
* Protected Routes
* Session-based Access Control

### Authorization

* Role-based dashboard access
* Restricted administrative functions

### Data Protection

* Form validation
* Secure data handling
* Controlled document access

---

## Technology Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* ShadCN UI

### State Management

* Zustand

### Validation

* Zod
* React Hook Form

### Database & Storage

* Firebase Firestore
* Cloudinary

### Deployment

* Vercel

---

## Project Structure

```text
src/
├── app/
│   ├── admin/
│   ├── athlete/
│   └── api/
│
├── components/
│   ├── forms/
│   ├── dashboard/
│   └── ui/
│
├── lib/
│   ├── firebase/
│   ├── cloudinary/
│   └── utils/
│
├── store/
│
├── services/
│
└── types/
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Sagnik1315/sports_manege_real.git
```

### Navigate to Project

```bash
cd sports_manege_real
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Open Browser

```text
http://localhost:3000
```

---

## Phase 1 Deliverables Completed

### Athlete Registration Form

* Multi-step registration process
* Real-time validation
* Age calculation
* Document upload support

### Database Integration

* Athlete information storage
* Document metadata storage
* Persistent records

### Admin Dashboard

* Secure authentication
* Athlete management interface
* Profile viewing
* Data export functionality

---

## Future Enhancements (Phase 2)

* Coach Registration
* Team Management
* Athlete Approval Workflow
* Competition Scheduling
* Notifications
* Advanced Reporting
* PDF Document Support
* Role-Based Access Expansion

---

## Developer

**Sagnik Banerjee**

GitHub:
https://github.com/Sagnik1315

Project Repository:
https://github.com/Sagnik1315/sports_manege_real

---

## License

This project was developed as part of a technical assessment for the Sports Club Management Platform.
