# System Diagrams

## Use Case Diagram

```mermaid
graph TD
    %% Actors
    Patient[Patient]
    Doctor[Doctor]
    Admin[Administrator]
    Nurse[Nurse]
    Receptionist[Receptionist]

    %% Use Cases
    subgraph Authentication
        Login[Login]
        Logout[Logout]
        Register[Register]
    end

    subgraph Patient Management
        ViewProfile[View Profile]
        UpdateProfile[Update Profile]
        BookAppointment[Book Appointment]
        ViewMedicalHistory[View Medical History]
    end

    subgraph Doctor Management
        ViewSchedule[View Schedule]
        UpdateSchedule[Update Schedule]
        ViewPatientRecords[View Patient Records]
        PrescribeMedication[Prescribe Medication]
    end

    subgraph Admin Management
        ManageUsers[Manage Users]
        ManageStaff[Manage Staff]
        GenerateReports[Generate Reports]
        ManageInventory[Manage Inventory]
    end

    subgraph Nurse Management
        UpdatePatientStatus[Update Patient Status]
        ViewPatientVitals[View Patient Vitals]
        ManageMedication[Manage Medication]
    end

    subgraph Receptionist Management
        ManageAppointments[Manage Appointments]
        ProcessPayments[Process Payments]
        RegisterPatient[Register Patient]
    end

    %% Relationships
    Patient --> Login
    Patient --> Logout
    Patient --> Register
    Patient --> ViewProfile
    Patient --> UpdateProfile
    Patient --> BookAppointment
    Patient --> ViewMedicalHistory

    Doctor --> Login
    Doctor --> Logout
    Doctor --> ViewSchedule
    Doctor --> UpdateSchedule
    Doctor --> ViewPatientRecords
    Doctor --> PrescribeMedication

    Admin --> Login
    Admin --> Logout
    Admin --> ManageUsers
    Admin --> ManageStaff
    Admin --> GenerateReports
    Admin --> ManageInventory

    Nurse --> Login
    Nurse --> Logout
    Nurse --> UpdatePatientStatus
    Nurse --> ViewPatientVitals
    Nurse --> ManageMedication

    Receptionist --> Login
    Receptionist --> Logout
    Receptionist --> ManageAppointments
    Receptionist --> ProcessPayments
    Receptionist --> RegisterPatient
```

## Sequence Diagrams

### Patient Appointment Booking

```mermaid
sequenceDiagram
    participant Patient
    participant System
    participant Doctor
    participant Receptionist

    Patient->>System: Request Appointment
    System->>System: Check Doctor Availability
    System->>Doctor: Send Availability Request
    Doctor-->>System: Confirm Availability
    System->>Patient: Show Available Slots
    Patient->>System: Select Time Slot
    System->>Receptionist: Notify New Appointment
    Receptionist->>System: Confirm Appointment
    System->>Patient: Send Confirmation
```

### Medical Record Update

```mermaid
sequenceDiagram
    participant Doctor
    participant System
    participant Database
    participant Patient

    Doctor->>System: Login
    System->>Database: Authenticate
    Database-->>System: Authentication Success
    Doctor->>System: Request Patient Records
    System->>Database: Fetch Records
    Database-->>System: Return Records
    Doctor->>System: Update Medical History
    System->>Database: Save Updates
    Database-->>System: Confirm Save
    System->>Patient: Notify Update
```

### Inventory Management

```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant Database
    participant Supplier

    Admin->>System: Login
    System->>Database: Authenticate
    Database-->>System: Authentication Success
    Admin->>System: Check Inventory Levels
    System->>Database: Fetch Inventory Data
    Database-->>System: Return Inventory Data
    alt Low Stock
        System->>Admin: Alert Low Stock
        Admin->>System: Place Order
        System->>Supplier: Send Order Request
        Supplier-->>System: Confirm Order
        System->>Database: Update Order Status
    end
```

### Patient Registration

```mermaid
sequenceDiagram
    participant Patient
    participant Receptionist
    participant System
    participant Database

    Patient->>Receptionist: Request Registration
    Receptionist->>System: Login
    System->>Database: Authenticate
    Database-->>System: Authentication Success
    Receptionist->>System: Enter Patient Details
    System->>Database: Validate Information
    Database-->>System: Validation Success
    System->>Database: Create Patient Record
    Database-->>System: Record Created
    System->>Patient: Send Registration Confirmation
```

### Staff Management

```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant Database
    participant Staff

    Admin->>System: Login
    System->>Database: Authenticate
    Database-->>System: Authentication Success
    Admin->>System: Add New Staff
    System->>Database: Check Staff Existence
    Database-->>System: Staff Not Found
    System->>Database: Create Staff Record
    Database-->>System: Record Created
    System->>Staff: Send Account Details
```

These diagrams illustrate the main interactions and workflows in the Hospital Management System. The use case diagram shows the different actors and their interactions with the system, while the sequence diagrams detail specific processes and their flow. 