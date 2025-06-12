# Final Project

## Title: myRoomMateApp

### Submitted by Rohit Nadimpalli, Mohamed Ashiq Basheer Ahamed

### Note : I have uploaded word document for clear screen shots of the application and Screenshots are available in the screenshots folder

## Design and Purpose

We’ve noticed that many students rely on apps like Split wise to manage shared expenses. At the same time, most student apartments have chore charts stuck on the fridge—but those often get ignored. Asking a roommate to pay up or clean the dishes can get awkward. That’s where our app comes in. Our goal is to create an all-in-one roommate management app that handles both shared expenses and chores—without the awkward conversations.
MyRoommateApp is a full-featured mobile application built with React Native (Expo) and a PHP + MySQL backend, designed for roommates and shared households. The app streamlines chore scheduling, expense tracking, and group management — all accessible through an intuitive and modern UI.

## What This App Does

### 1. Group Creation and Joining
-	Users can start a new group by choosing a group name and you’re a unique username. After that, the app will give a unique code for the new group.
-	Alternatively, users can ‘join’ an existing group by entering a shared group code.
### 2. Home Dashboard
-	Upon entering the app, users will see a dashboard that allows them to manage chores, track expenses, view group members, and log out.
### 3. Managing Chores
-	Users can add new chores, specifying how long they should take and how often they need to be done. They can also see who is currently assigned to each chore, its due date, and its status (pending, completed, or overdue). A single tap on an "Assign" button will evenly distribute chores among group members. Users can mark their own assigned chores as "Done" for the week. If someone clicks "Assign" again, the chores will be re-assigned.
### 4. Expense Tracking
-	Users can record shared group expenses, including what the expense was for, the total cost, who paid, and which group members are involved. All group expenses can be viewed instantly, which helps make money discussions among roommates less uncomfortable.
### 5. Group Member Management
-	View a list of all members in the group.
-	Share group code via the device’s native sharing options.
  
## Tools Used

-	⁠Frontend (React Native Application)
-	Backend (PHP API)
-	MySQL 
-	Android Studio (Emulator) 
-	Xampp
  
## Limitations & Notes

-	The app currently uses username-based identification & Group code without authentication.
-	IP address must be configured manually for backend calls.
-	Localhost backend does not support remote access unless configured (use LAN IP).
-	Some error handling assumes a functional server and clean data.

## Future Improvements

We plan to add several new features and improvements, including:
-	Secure user accounts: Implementing a robust login/signup system with secure session handling.
-	Expense summaries: Providing charts and summaries to clearly show each person's contribution to group expenses.
-	Overdue chore alerts: Sending push notifications via Firebase to remind users about overdue chores.
-	Enhanced group management: Adding more options for group settings, such as removing members or changing the group name.
-	Improved user experience: Further refining the app's usability and overall user experience, which was limited by time constraints during development.

## Screens in the App

### Screen 1:
Group Selection This screen is where you start. You'll enter your username and then choose if you want to create a new group or join a group that already exists.

<img width="196" alt="image" src="https://github.com/user-attachments/assets/1bba02a3-2e50-406b-bcb9-272f29bc0c28" />


### Screen 2:
"My Roommate" Group Dashboard, Once you enter your username and group code. This screen displays a pop-up message confirming, "You are already a member of this group."

<img width="196" alt="image" src="https://github.com/user-attachments/assets/bb4a2d88-f786-4ef4-b943-b71d6ef3e8f6" />

### Screen 3:
"My Roommate" Group Dashboard This screen presents "My Roommate" group dashboard. It clearly displays your unique group code and a welcoming message. From here, you can easily access dedicated sections for managing chores, tracking expenses, viewing group members, and logging out.

<img width="213" alt="image" src="https://github.com/user-attachments/assets/9ba2f1aa-a9a6-4e7f-8526-9e35e7c1b0db" />


### Screen 4:
Manage Chores Overview This screen, titled "Manage Chores," displays a comprehensive list of all tasks for Group 620. It includes buttons to either add a new chore or automatically assign existing chores equally among members. For each chore, details like estimated time, frequency, the assigned person, due date, and current status are clearly shown.

<img width="200" alt="image" src="https://github.com/user-attachments/assets/6331f44e-78ab-41e9-af2c-8a7590a59bd8" />

### Screen 5:
Add New Chore This image shows a pop-up window (modal) appearing over the "Manage Chores" screen. It's a form that lets users add a new chore by typing in its name, estimating the hours it will take, and selecting how often it should occur. There are also options to cancel or submit the new chore.

<img width="203" alt="image" src="https://github.com/user-attachments/assets/02815573-ab01-41ec-b179-2d1388ed40cc" />

### Screen 6:

Chore Added Confirmation This screen confirms that a new chore has been successfully added. A "Success" alert box is displayed on top of the "Manage Chores" list, letting the user know their action was successful.

<img width="205" alt="image" src="https://github.com/user-attachments/assets/ee3488d7-f08b-4651-bc43-691860ef7544" />

### Screen 7:

Unassigned and Assigned Chores This "Manage Chores" screen displays a mix of tasks: some, like "CLEAN FLOOR" and "WASH DISHES," are currently unassigned, while others already show who they're assigned to. Each chore entry includes details such as its estimated time, frequency, assignment status, and due date.

<img width="217" alt="image" src="https://github.com/user-attachments/assets/afb5b6bd-b0bd-4856-ae80-7748cbf7a0da" />

### Screen 8:
Chore Assignment Confirmation When clicked on assign chores, a pop-up alert appears on the screen, confirming that "Successfully assigned 2 chores."

<img width="217" alt="image" src="https://github.com/user-attachments/assets/7abb893d-817e-406e-8af1-c5b7e2957cdc" />

### Screen 9:
"Mark Done" Option This image highlights the specific area on the chore management screen where a user can select the option to mark a chore as "Done."

<img width="219" alt="image" src="https://github.com/user-attachments/assets/f44af117-3311-4bc0-a2a4-cc9f676da2ab" />

### Screen 10:
Chore Marked as Completed This "Manage Chores" screen now displays that a task has been successfully marked as completed by a user. All other chores remain listed with their current status and assignment details visible.

<img width="219" alt="image" src="https://github.com/user-attachments/assets/7cedadee-9494-4c43-a7b8-8e7acde7d63e" />

### Screen 11:
"Confirm Completion" Dialog On the "Manage Chores" screen, a pop-up confirmation dialog is shown, asking the user to confirm if they have completed the "cleaning" chore.

<img width="253" alt="image" src="https://github.com/user-attachments/assets/73f9cf77-f872-40af-91b1-748a4482f640" />


### Screen 12:
Manage Expenses Dashboard This screen, "Manage Expenses," provides an overview of recent group spending. It features individual expense cards detailing the description, amount, who paid, and who shared in the cost. Below these, there's a "Who Owes Whom?" summary, which clearly outlines the current financial balances between roommates.

<img width="232" alt="image" src="https://github.com/user-attachments/assets/f6d0e10e-9136-404f-8ff6-9821a97d6bb9" />

### Screen 13:
Add New Expense Dialog This image displays a pop-up window (modal) for adding a new expense. It includes fields for the expense's description and amount, a dropdown or selection for who paid, and options to tag which roommates participated in (and thus owe for) the expense. Buttons to either submit or cancel the new expense are also present.

<img width="232" alt="image" src="https://github.com/user-attachments/assets/fed1cdf3-7c3d-41c5-9475-121f76929b18" />

### Screen 14:
Expense Added Confirmation This screen shows a "Success" alert message that reads "Expense added successfully!" The alert appears overlaid on the "Manage Expenses" list, confirming that the new expense has been recorded.

<img width="235" alt="image" src="https://github.com/user-attachments/assets/670191e0-856c-412c-9d66-ba2eb871afba" />

### Screen 15: 

Group Members & Share Group Code This screen, labeled "Group Members," shows your unique group code prominently along with a convenient "Share" button. It also provides a clear list of all group members, displaying each person's name and their assigned role. When the "Share" button is tapped, a standard sharing menu (native share sheet) appears, pre-filled with an invitation message that allows you to easily copy the group code or send it to others through various apps..

<img width="237" alt="image" src="https://github.com/user-attachments/assets/5113af92-1b04-4e07-9339-a9b048a76f22" />
<img width="229" alt="image" src="https://github.com/user-attachments/assets/f2da7606-88fa-412d-9979-86a3f9e6798e" />

## Backend SQL Tables: 

### Screen shot 1 -
This image shows the phpMyAdmin interface for the myroommateapp database, displaying a list of all its tables. The tables include chores, chore_assignments, expense_participants, expenses, groups, posts, users, and user_groups.

<img width="357" alt="image" src="https://github.com/user-attachments/assets/e9033675-3774-4ece-8865-dc6edbdc6883" />

### Screen shot 2: 
This image shows the users table from your MyRoommate App database, showing user IDs, usernames and their associated group IDs.

<img width="364" alt="image" src="https://github.com/user-attachments/assets/88955c63-fbc5-4b49-a61e-3dd56b37ceea" />

### Screen shot 3 -
This image displays the expenses table from your MyRoommate App database. It lists recorded expenses with details like their ID, the group they belong to, the amount, a description, who paid, and when it was created.

<img width="369" alt="image" src="https://github.com/user-attachments/assets/b8c11de3-00e6-41f2-b81f-69023f31bab7" />

### Screen shot 4 -
This image shows the chores table from your MyRoommate App database. It lists various chores with their ID, name, estimated hours, frequency (weekly/daily), and creation timestamp.

<img width="383" alt="image" src="https://github.com/user-attachments/assets/54ad2d0b-4b19-4d8b-b3cd-43460903d76b" />

### Screen shot 5 -
This image displays the user with groups table in your MyRoommate App database. It shows the mapping of users to specific groups, indicating which user (by user_id and username) belongs to which group_id.

<img width="332" alt="image" src="https://github.com/user-attachments/assets/3d1d612a-9a14-4655-afdf-f1789d1d2473" />

### Screen shot 6 -
This image displays the XAMPP Control Panel, showing that both your Apache Web Server and MySQL Database are currently Running. This confirms your local server environment is active, allowing your React Native app to connect to its PHP backend and database

<img width="271" alt="image" src="https://github.com/user-attachments/assets/dac1015a-bab2-462a-b41e-3d0ef934ca6e" />

 


