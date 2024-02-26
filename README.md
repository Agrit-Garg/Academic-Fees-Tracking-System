
# Basic Fees Management System

The Fees Management System is a software application designed to streamline the process of managing fees and payments within an educational institution or any organization that deals with fee collection. This system provides administrators, teachers, and students with a user-friendly interface to efficiently handle various aspects of fee management, including fee collection, tracking payments, generating reports, and communicating fee-related information.




## Features

- Online Fee Portal for students
- Offline Fee Taking and Management via Admin
- Dynamic Admin Pannel
- Fees Tracking by Student
- Receipt Generation
- Sending Reminders via Admin at One Click


## Installation

### Clone the repository

```bash
  git clone https://github.com/Anjney-Mishra/BasicFeeManagementSystem.git
```
### Install the node packages
```bash
  npm install
```
### Configure the config file (Email Service)
 - There is folder config at main directory
 - Inside it there is file config.js
 config.js
 ```bash
const sessionSecret = "mysitesessionsecret";

const emailUser = "";
const emailPassword = "";
module.exports = {
    sessionSecret,
    emailUser,
    emailPassword
}
```
- You can go with your sessionSecret
- Put your SMTP mailer email in emailUser and its password in emailPassword

### Run the application
```bash
  npm run dev
```


    
## Note

It uses mongodb localhost for database make sure to check that too.

