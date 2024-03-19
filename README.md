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
ng serve (run 'npm start' if the command does not work.)
```

Runs on [this](http:/localhost:4200) location


# Naming Conventions

This section outlines the best practices for naming APIs, variables, and methods. Following these conventions ensures consistency, readability, and ease of understanding in your API design.

### Endpoints
- **Use forward slash**: For resource hierarchy and separation of URI resources.
- **Use nouns, not verbs**: To describe resources.
- **Use plural nouns**: To indicate collections.
- **Lowercase letters**: URLs should be typed in lowercase.
- **Use hyphens to separate words**: For readability and SEO benefits.
- **Endpoint strings can be the same with different Request Mapping**: Different HTTP methods can operate on the same URI.

#### Correct and Incorrect Examples
| Aspect                                               | Correct Example            | Incorrect Example   |
|------------------------------------------------------|----------------------------|---------------------|
| **Use forward slash**                                | `/resource/subresource`    | `resource_subresource` |
| **Use nouns, not verbs**                             | `/users`                   | `/getUsers`         |
| **Use plural nouns**                                 | `/orders`                  | `/order`            |
| **Lowercase letters**                                | `/user-profile`            | `/User-Profile`     |
| **Use hyphens to separate words**                    | `/user-profile`            | `/user_profile`     |
| **Endpoint strings can be the same with different Request Mapping** | Different methods for `/employees/{id}` (PUT, GET) | Separate endpoints for each action |

### Variables
- **All variables in camelCase**: For consistency and readability in code.
- **Service references with underscore**: To indicate a service or injected dependency.

#### Correct and Incorrect Examples
| Aspect                                               | Correct Example            | Incorrect Example   |
|------------------------------------------------------|----------------------------|---------------------|
| **All variables in camelCase**                       | `employeeId`               | `EmployeeID` or `employee_id` |
| **Service references with underscore**               | `_employeeService`         | `employeeService`   |

### Methods
- **Method names in PascalCase**: For clear identification as methods or actions.
- **Descriptive names, except in lambdas**: Names should clearly describe the method's purpose.

#### Correct and Incorrect Examples
| Aspect                                               | Correct Example            | Incorrect Example   |
|------------------------------------------------------|----------------------------|---------------------|
| **Method names in PascalCase**                       | `SaveEmployeeDocument`     | `saveEmployeeDocument` |
| **Descriptive names, except in lambdas**             | `CalculateAnnualSalary`    | `CalcSalary` or `CS` |

