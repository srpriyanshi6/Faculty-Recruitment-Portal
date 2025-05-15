# Faculty-Recruitment-Portal

## How to Run
1. Load the database on the server using the sql file `FacultuRecruitment.sql`
2. In index.js , replace the username and password for the sql connection instead of placeholder `root` and `Pass@123`
3. In terminal run the following commands
   
         npm install
         npm run start

4. Open the portal at `http://localhost:3000/`

## Portal features and working

### The structure and data
The data collected can be seen in the scheme added in the repository and the way the data is stored in the servers

### 1. Login and SignUp
The portal employes a secure signup and authentication for the users
![screenshot](https://github.com/user-attachments/assets/c9f43014-17d1-4146-8eec-9a6ea197a967)

### 2. Dynamic Form for varied amounts of data
Based on the amount of data, the form can be editted to include more fields or delete certain fields allowing users to enter all necessary info
![image](https://github.com/user-attachments/assets/9c388bfb-8ec3-4d5c-90d0-6f243f82971d)

### 3. Document (jpg and pdf) upload and immediate preview functionality
The documents uploaded can be previewed and also changed by logging in again till the application/portal is allowed to be open
![image](https://github.com/user-attachments/assets/b84ef97b-e705-4a9f-8f27-2ef209c0f254)


### 4. PDF generation and printing
The portal provides an easy and quick pdf generation of all entered details to reduce unnecessary confusion for user
![image](https://github.com/user-attachments/assets/7250ed3f-db51-450d-afbc-87f35ccef0ed)
