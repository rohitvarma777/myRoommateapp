# MyRoommateApp

Project Idea: We’ve noticed that many students rely on apps like Splitwise to manage shared expenses. At the same time, most student apartments have chore charts stuck on the fridge—but those often get ignored. Asking a roommate to pay up or clean the dishes can get awkward. That’s where our app comes in. Our goal is to create an all-in-one roommate management app that handles both shared expenses and chores—without the awkward conversations.

MyRoommateApp is a full-featured mobile application built with **React Native (Expo)** and a **PHP + MySQL backend**, designed for roommates and shared households. The app streamlines **chore scheduling**, **expense tracking**, and **group management** — all accessible through an intuitive and modern UI.

---

## Team Members

- **Mohamed Ashiq Basheer Ahamed**
- **Rohit Varma Nadimpalli**

---

## What This App Does

### 1. Group Creation and Joining
- Users can **create** a new group by providing a group name and username. // something which says system generates a unique code 
- Alternatively, users can **join** an existing group by entering a shared group code.

### 2. Home Dashboard
- Once inside, users land on a dashboard with access to:
  - Chore Management
  - Expense Tracking
  - Group Member List
  - Logout

### 3. Task Scheduling
- Add new chores with estimated time and frequency.
- View current assignments with details like:
  - Who is assigned  
  - Due date  
  - Status: Pending / Completed / Overdue  
- Once we click Assign chores are equally assigned with a single tap.
- Users can mark their assigned chores as **Done**. for the week and if some clicks assign tasks it will assign tasks again

### 4. Expense Tracking
- Log group expenses with description, amount, payer, and involved users.
- View all group expenses in real time.
- Helps avoid awkward money talk among roommates!

### 5. Group Member Management
- View a list of all members in the group.
- Share group code via the device’s native sharing options.

---

## How to Run the App




## Directory Overview

MyRoommateApp/  
├── App.js                      
├── index.js                    
├── app.json                    
├── package.json                
├── roommate_app.sql            
├── components/
│   └── CustomTextInput.js     
│   
├── screens/  
│   ├── GroupScreen.js          
│   ├── HomeScreen.js           
│   ├── TaskSchedulingScreen.js   
│   ├── ExpenseManagementScreen.js   
│   └── GroupMembersScreen.js   
│
└── php-api/   
├── db_connect.php  
├── create_group.php  
├── join_group.php  
├── add_expense.php  
├── get_expenses.php  
├── fetch_group_members.php  
├── add_chore.php  
├── fetch_chores.php  
├── assign_chores.php  
└── mark_chore_complete.php


---

Output :

Screen shot 1: This screen shot shows the first group joining page 

## Limitations & Notes

- The app currently uses username-based identification & Group code without authentication.
- IP address must be configured manually for backend calls.
- Localhost backend does not support remote access unless configured (use LAN IP).
- Some error handling assumes a functional server and clean data.

---

## Future Enhancements

- Add secure login/signup and session storage.
- Include charts/summary for expense contributions.
- Add push notifications for overdue chores using firebase.
- Enhance group settings (remove members, rename group, etc.)

---


## Screenshots

<!-- 1. Chore Completion -->
<img src="Screenshots/ChoreCompletion.png" alt="ChoreCompletion" width="300"/>
<p>The image shows the “Manage Chores” screen of a roommate app with a confirmation dialog asking if the user completed the “cleaning” chore.</p>

<!-- 2. Manage Chores -->
<img src="Screenshots/managechores.png" alt="Manage Chores" width="300"/>
<p>The image shows the “Manage Chores” screen of the app.</p>

<!-- 3. Chore Completed -->
<img src="Screenshots/chorecompleted.png" alt="Chore Completed" width="300"/>
<p>The image shows a “Manage Chores” screen where a user successfully marked a task as completed, and other chores are listed with their status and assignment details.</p>

<!-- 4. Already Member -->
<img src="Screenshots/alreadymember.png" alt="Already Member" width="300"/>
<p>The screen shows a “My Roommate” group dashboard with a success alert stating “You are already a member of this group.”</p>

<!-- 5. Group Screen -->
<img src="Screenshots/groupscreen.png" alt="Group Screen" width="300"/>
<p>The “Manage Chores” screen lists all chores for group 620—with buttons to add a new chore or assign chores equally—and shows each task’s details (time, frequency, assignee, due date, and status).</p>

<!-- 6. New Chore Added -->
<img src="Screenshots/newchore.png" alt="New Chore Added" width="300"/>
<p>The screen displays a “Success” alert confirming that a new chore was added successfully, over the Manage Chores list.</p>

<!-- 7. Add New Chore Form -->
<img src="Screenshots/addnewchore.png" alt="Add New Chore Form" width="300"/>
<p>A modal overlay with a form to add a new chore—entering its name, estimated hours, choosing frequency, and buttons to cancel or submit.</p>

<!-- 8. Group Dashboard -->
<img src="Screenshots/groupcreated.png" alt="Group Dashboard" width="300"/>
<p>The “My Roommate” dashboard shows your group code and greeting, with buttons to manage chores, expenses, members, and logout.</p>

<!-- 9. Expenses Screen -->
<img src="Screenshots/expensesscreen.png" alt="Expenses Screen" width="300"/>
<p>The “Manage Expenses” screen displays recent expense cards (showing description, amount, payer, and shared-with tags) and a “Who Owes Whom?” summary detailing each roommate’s owed balances.</p>

<!-- 10. Chore Added Confirmation -->
<img src="Screenshots/choreadded.png" alt="Chore Added Confirmation" width="300"/>
<p>A popup alert confirming “Chore added successfully” appears over the Manage Chores screen.</p>

<!-- 11. Select Group / Home Screen -->
<img src="Screenshots/homescreen.png" alt="Select Group / Home Screen" width="300"/>
<p>The “Select Group” screen prompts you to enter your username and either create a new roommate group or join an existing one.</p>

<!-- 12. Add Expense Form -->
<img src="Screenshots/addexpenses.png" alt="Add Expense Form" width="300"/>
<p>A modal dialog for adding a new expense, with inputs for description, amount, payer selection, participant tags, and buttons to submit or cancel.</p>

<!-- 13. View Group Members -->
<img src="Screenshots/viewmembers.png" alt="View Group Members" width="300"/>
<p>The “Group Members” screen displays your group code with a share button and lists each member’s name and role.</p>

<!-- 14. Expense Added Confirmation -->
<img src="Screenshots/expenseadded.png" alt="Expense Added Confirmation" width="300"/>
<p>A success alert confirming “Expense added successfully!” appears over the Manage Expenses list.</p>

<!-- 15. Assigned Chores Confirmation -->
<img src="Screenshots/assignedchore.png" alt="Assigned Chores Confirmation" width="300"/>
<p>A popup alert confirms “Successfully assigned 2 chores.” on the Manage Chores screen.</p>

<!-- 16. Share Sheet -->
<img src="Screenshots/sharesheet.png" alt="Share Sheet" width="300"/>
<p>A native share sheet appears with prewritten invite text letting you copy or send your group code to others.</p>

<!-- 17. Chore List (Unassigned) -->
<img src="Screenshots/chorelist.png" alt="Chore List (Unassigned)" width="300"/>
<p>The “Manage Chores” view shows unassigned chores like “CLEAN FLOOR” and “WASH DISHES” alongside already assigned tasks, each with estimated time, frequency, assignment status, and due dates.</p>
