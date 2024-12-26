---

### Final Database Schema with Additional Notes

---

### 1. **Users**  
For managing multiple users (e.g., families or individuals).  
- `id` (Primary Key)  
- `name`  
- `email` (Unique)  
- `password` (hashed)  
- `created_at`  
- `updated_at`  

---

### 2. **Incomes**  
Tracks variable incomes like salaries, freelance work, or one-time payments.  
- `id` (uuid)  
- `user_id` (Foreign Key to `Users.id`)  
- `amount`  
- `source` (e.g., Salary, Freelance, Gift)  
- `frequency` (e.g., Monthly, Weekly, One-Time)  
- `date_received`  
- `created_at`  
- `updated_at`  

- `description` (optional)  

---

### 3. **Expenses**  
Tracks spending in various categories.  
- `id` (Primary Key)  
- `user_id` (Foreign Key to `Users.id`)  
- `category_id` (Foreign Key to `Categories.id`)  
- `amount`  
- `date`  
- `created_at`  
- `updated_at`  

- `description`  
---

### 4. **Categories**  
Groups expenses into meaningful buckets like rent, food, and transportation.  
- `id` (Primary Key)  
- `name` (e.g., Rent, Food, Transportation)  
- `created_at`  
- `updated_at`  

- `icon` (optional, for UI purposes)  
---

### 5. **Budgets**  
Sets spending limits for categories over a specific period.  
- `id` (Primary Key)  
- `user_id` (Foreign Key to `Users.id`)  
- `category_id` (Foreign Key to `Categories.id`)  
- `amount` (e.g., $200 for groceries)  
- `start_date`  
- `end_date`  
- `created_at`  
- `updated_at`  

---

### 6. **Goals**  
Tracks savings for specific purposes like vacations, emergency funds, or large purchases.  
- `id` (Primary Key)  
- `user_id` (Foreign Key to `Users.id`)  
- `name` (e.g., "Save for Car")  
- `target_amount` (e.g., $10,000)  
- `saved_amount` (current saved amount)  
- `due_date`  
- `created_at`  
- `updated_at`  

---

### 7. **Recurring Expenses**  
Tracks regular expenses like subscriptions, rent, or utility bills.  
- `id` (Primary Key)  
- `user_id` (Foreign Key to `Users.id`)  
- `category_id` (Foreign Key to `Categories.id`)  
- `amount`  
- `frequency` (e.g., Monthly, Weekly)  
- `next_due_date`  
- `description`  
- `created_at`  
- `updated_at`  

---

### 8. **Transactions**  
Logs all income, expense, or transfer actions for better auditability and analytics.  
- `id` (Primary Key)  
- `user_id` (Foreign Key to `Users.id`)  
- `type` (e.g., Income, Expense, Transfer to Goal)  
- `amount`  
- `date`  
- `description`  
- `related_id` (Foreign Key to `Incomes.id`, `Expenses.id`, or `Goals.id`)  
- `created_at`  
- `updated_at`  

---

### **Additional Notes**  

1. **Salary Types and Frequency**:  
   - Use the `frequency` field in the `Incomes` table to differentiate between monthly, weekly, or one-time income sources.  

2. **Savings and Goals**:  
   - Link `Goals` with `Transactions` to track deposits or withdrawals from income and budgets into specific goals.  

3. **Analytics and Reports**:  
   - Combine data from `Incomes`, `Expenses`, and `Budgets` to provide insights on user spending habits, income trends, and progress toward savings goals.  

4. **Flexibility for Families or Individuals**:  
   - The `Users` table ensures that multiple members of a family can manage their own budgets, goals, and expenses separately.  

5. **Recurring Expenses**:  
   - The `Recurring Expenses` table simplifies tracking regular bills or subscriptions by automating their inclusion in monthly or weekly expenses.  

---


https://github.com/Maclinz/expense-tracker_fullstack/tree/master/backend