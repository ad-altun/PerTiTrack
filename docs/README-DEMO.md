# Demo Account & Test Data

## Demo Login Credentials

To test the application, use the following demo account:

- **Email:** demo@pertitrack.denizaltun.de
- **Password:** Demo1234!

##  Getting Started

1. Navigate to the deployed application or run locally
2. Click **Sign In**
3. Enter demo credentials
4. Explore the dashboard and features

---

##  Demo Workflow

1. Landing → 2. Login → 3. Dashboard → 4. Today's Status → 5. View Time Records

**💡 Tip**: Try exploring different date ranges to see the full history of time tracking and absence records.

## Test Data Overview

The demo account contains **21 months of realistic work history** (January 2024 - October 2025) to showcase all application features:

###  Data Summary

| Category | Details |
|----------|---------|
| **Coverage Period** | January 2, 2024 → October 3, 2025 |
| **Total Absences** | 13 requests (all approved) |
| **Time Records** | 76 entries across different work locations |
| **Work Schedule** | Mon-Fri, 9:00-18:00 (60-min lunch breaks) |

###  Absences Breakdown

**2024 (7 absences)**
-  Vacation: 19 days (Feb, Jul, Dec)
-  Sick Leave: 4 days (Mar, Oct)
-  Training: 2 days (Sep - React Workshop)
-  Personal: 1 day (Apr - partial day)

**2025 (6 absences)**
- ️ Vacation: 17 days (Mar, Aug)
-  Sick Leave: 2 days (Apr)
-  Training: 2 days (Jun - TypeScript Conference)
-  Personal: 2 days (Jan, Sep - partial days)

###  Time Tracking Features

The demo data includes examples of:
-  Regular office work days
-  Remote/home office work
-  Client site visits
- ️ Flexible start/end times
-  Consistent break patterns
-  Occasional overtime

###  What You Can Test

1. **Authentication & Authorization**
    - Login with demo credentials
    - JWT token-based session management
    - Role-based access (EMPLOYEE role)

2. **Time Booking**
    - View historical time records
    - See clock-in/clock-out patterns
    - Review break durations
    - Check flextime records

3. **Absence Management**
    - Browse absence history
    - View approved requests
    - See different absence types (vacation, sick, training, personal)
    - Check date ranges and partial-day absences

4. **Work Schedule**
    - Review employee work schedule
    - See weekly work hours
    - Understand break configurations

5. **Dashboard & Reports**
    - Current status overview
    - Today's summary
    - Historical data visualization

##  Notes

- **Data Realism**: All timestamps and patterns reflect real-world work scenarios
- **Work Patterns**: Mix of office/remote work shows hybrid work support
- **Date Coverage**: 21-month span demonstrates long-term data handling
- **Absence Types**: Multiple leave types show comprehensive HR features
- **No Approval Flow**: Approval system is still in development (all absences pre-approved)
- **Single Role**: Currently only EMPLOYEE role is implemented

##  Technical Details
- **Password Encryption**: BCrypt
- **Token Type**: JWT (15-Minutes expiration)
- **Database**: PostgreSQL with sample data pre-loaded
