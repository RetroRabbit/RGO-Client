# Introduction
This platform is, somewhat for making the grad onboarding process simpler. Also for creating a central location for tracking changes to personal information, certification, skills,project and etc.

# Getting Started
### Cloning the [repository](https://retro-rabbit@dev.azure.com/retro-rabbit/RetroGradOnboard/_git/RGO-Client)
```powershell
git clone 'https://retro-rabbit@dev.azure.com/retro-rabbit/RetroGradOnboard/_git/RGO-Client'
```
### Install dependencies for the project(frontend)
```powershell
#cd RGO-Client\Frontend\RGO-Frontend
npm install
```
### Running
```powershell
#cd RGO-Client\Frontend\RGO-Frontend
ng serve
```
Runs on [this](http:/localhost:4200) location

# Dependencies
- @angular/cli
- @angular/core
- @ngrx/store

### FAQ
```typescript
// user type
enum UserRoles {
    GRAD = 0,
    PRESENTER,
    MENTOR,
    ADMIN
}

// user status
enum UserStatus {
    NEW = 1,
    ACTIVE,
    INACTIVE
}

// form status
enum FormStatus {
    NEW = 0,
    ACTIVE,
    INACTIVE
}

// field status
enum FieldStatus {
    SIGNATURE = 0,
    FILEUPLOAD,
    DROPDOWN,
    TEXTAREA,
    TEXTBOX
}

// stack type
enum StackType {
    DATABASE = 0,
    FRONTEND,
    BACKEND,
}

// event type
enum EventType {
    EVENTS = 0,
    WORKSHOPS
}

// form type
enum FormType {
    
}
```