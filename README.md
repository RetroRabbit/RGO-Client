# Introduction
This platform is, somewhat for making the grad onboarding process simpler. Also for creating a central location for tracking changes to personal information, certification, skills,project and etc.

# Getting Started

## Designs
https://www.figma.com/file/rPWv2FIKByov9GdtHWbhFG/HRIS-Working-File?node-id=0%3A1&mode=dev

### Install software for the project
- Microsoft Visual Studio Code
- Node.js v18.17.1
- Make sure to check version if you are using nvm

### Cloning the [repository](https://retro-rabbit@dev.azure.com/retro-rabbit/RetroGradOnboard/_git/RGO-Client)
```powershell /cmd / internal terminal
git clone 'https://retro-rabbit@dev.azure.com/retro-rabbit/RetroGradOnboard/_git/RGO-Client'
```

### Open project
Open folder "RGO-Client" in Visual Studio Code

### Change to the develop branch
Make sure to have Git installed to run any Git command lines.
```powershell
#cd RGO-Client
git checkout develop
```

### Install dependencies for the project
```powershell / cmd / internal terminal
#cd RGO-Client
npm install
npm install ngx-file-drop
```

### Running
```powershell
#cd RGO-Client
ng add @angular/pwa
ng serve (run 'npm start' if the command does not work.)
```

Runs on [this](http:/localhost:4200) location


# Naming Conventions
## Endpoints
Use forward slash
Use forward slashes for resource hierarchy and to separate URI resources.
Example: "/employee/{id}"


## Use nouns, not verbs
When naming the URIs, you should use nouns to describe what the resource is and not what it does. For example:
Wrong:   "getEmployees/"
Correct: "employees/"

## Use plural nouns
This makes it clear that there is more than one resource within a collection. Using singular nouns can be confusing. For example:
Wrong:  "chart/{id}"
Correct: "charts/{id}"

## Lowercase letters
As a standard, URLs are typed in lowercase. The same applies to API URIs.


## Use hyphens to separate words
When chaining words together, hyphens are the most user-friendly way and are a better choice than underscores.
For example: "employee-documents/10"


## Endpoint strings can be the same provided that the Request Mapping is different:
PUT "employee/{id}"
GET "employee/{id}"

## Variables
All variables in methods must be in camelCase

Anything referenced by a service should prefixed with an underscore, to indicate that it is a reference to a service 

All Method names must be PascalCase
 ie: SaveEmployeeDocument(SimpleEmployeeDocumentDto employeeDocDto)

PS: When naming and endpoint, variable or method make the name as descriptive as possible. The only exception is for small scopes like a lambda.
