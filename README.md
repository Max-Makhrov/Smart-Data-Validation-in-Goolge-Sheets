# Smart-Data-Valigation-in-Goolge-Sheets
Create dependent drop-down lists in your sheets.

#Setup:
1. Open your Sheets
2. Go to menu `Tools > Script Editor`
3. Paste the code from here.
4. Reload the Google Sheets file
5. The new menu will appear at the right. Go to `Smart Data Validation > Set/Update`
6. The sample sheets will appear. See the work in the sheet "Work Sample". See setting in the sheet "_Dv_Ini_"
7. Have fun!

#Features:
1. Set 2 and more level dependent drop-down lists (DDLs)
2. Set 1 and more DDLs on a single sheet.
3. Set 1 and more DDLs from single data sheet.
4. Set DDLs from another files as a source data.
5. Set DDLs in a custom order of columns.
6. Auto-complete values when the only value is left.
7. Auto-delete validation when user deletes values in previous level
8. When you set new rule, use auto column numbers detection. It works when column names are the same in source and work sheet.
9. Validation works when user copies data down (uses Ctrl + V or Ctrl + D keys).

#Limitations
1. Up to 500 values in a single DDL
2. Up to 50,000 calls / day.
Limits are related to Google quotas: https://developers.google.com/apps-script/guides/services/quotas
