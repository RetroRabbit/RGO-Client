# Introduction
This platform is, somewhat for making the grad onboarding process simpler. Also for creating a central location for tracking changes to personal information, certification, skills,project and etc.

# Getting Started
### Install software for the project
- Microsoft Visual Studio 2022 (Select 'ASP.NET and Web development' and '.NET
desktop development' workloads.)
- Node.js v18.17.1

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
ng serve (run 'npm start' if the command does not work.)
```
Runs on [this](http:/localhost:4200) location

### Change to the Dev branch
Make sure to have Git installed to run any Git command lines.
```powershell
#cd RGO-client\Frontend\RGO-Frontend
git checkout Dev
```

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