# Event Management System 

 This system allows an admin to create profiles, assign timezone preferences, create and update events, and view event update logs — all synchronized with an **Express.js backend API**.

---

## Project Overview

**Goal:**  
To build a scalable, timezone-aware Event Management System that supports:
- Multiple user profiles  
- Event creation, editing, and viewing  
- Multi-timezone synchronization  
- Event update logs (previous vs updated values)  

**Architecture:**  
- **Frontend:** React (Next.js / Vite) + Redux Toolkit  
- **Backend:** Node.js + Express.js, MongoDB   
- **Timezone Handling:** `dayjs` with `utc` + `timezone` plugins  
- **Styling:** Vanilla CSS (no component libraries)

---

## Features

### Profiles
- Admin can create multiple user profiles.  
- Each profile can have a unique timezone.  
- Changing a profile’s timezone automatically updates how all timestamps appear.

### Event Management
- Create events for one or more selected profiles.  
- Start and End Date/Time pickers (with validation).  
- Timezone-specific event display — every profile sees events in their local timezone.

### Event Updating
- Users can update their events.
- Each update records a log with:
  - Previous vs Updated values  
  - Timestamp of update (converted to user’s timezone)

### Event Logs
- Modal showing detailed event change history.
- Auto-converts timestamps when the profile’s timezone changes.

---


---

## Installation & Setup

### Clone Repository

```
git clone https://github.com/adityap5/Event-Management/

```
### Install Dependencies

#### Frontend
```
cd client
npm install
npm run dev
```
#### Environment setup (Frontend)
```
VITE_API_URL = http://localhost:5000/api

```
#### Backend
```
cd server
npm install
node server.js
```

#### Environment setup (Backend)
```
PORT=5000
MONGODB_URI=
```
### Data Flow & Architecture

#### Frontend Flow

##### ProfileManager

- Fetches all profiles.
- Selects one currentProfile to view events.
- Updates timezone for selected profile.

##### EventForm

- Independent from current profile.
- User manually selects profiles for event creation.
- Validates dates & times before submitting to API.

##### EventList

- Displays all events of currentProfile.
- Allows editing an event → triggers update log.

##### EventLogModal

- Fetches and displays event update logs in local timezone.

#### DSA & Optimization Strategies

- O(1) lookup	Efficient profile toggle	Used .some() and .filter() by _id in profileSlice
- Memoization (useMemo)	Avoid re-rendering filtered event lists	Cached derived data for performance
- Immutable state updates	Predictable Redux behavior	Redux Toolkit uses Immer for efficient immutability
- Timezone normalization	Prevent inconsistent date math	All conversions centralized in dateUtils.js
- Batched updates	Reduce unnecessary renders	Combined Redux dispatches when updating related state



### Important Design Choices

- Profiles and Events are decoupled
- Selecting a profile only affects event viewing, not event creation.
- Centralized State Management
- Redux slices ensure consistent access to profiles, events, and timezone.
- Reusable Components
- Dropdowns, Date/Time inputs, and Error messages built as reusable components.
- Vanilla CSS
- Lightweight styling ensures fast load and no dependency bloat.

### Tech Stack

#### Frontend	
- React
#### State Management
- Redux Toolkit
#### HTTP Client
- Axios
#### Date/Timezone
- Day.js
#### Styling
- Vanilla CSS
#### Backend
- Express.js
- Node.JS
#### Database
- MongoDB

### Validation Rules

- Start Date	Cannot be before today
- End Date	Must be after Start Date
- Timezone	Must be selected
- Profiles	At least one must be selected



