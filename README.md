# Smart-Data-Valigation-in-Goolge-Sheets
Create dependent drop-down (DDL) lists in your sheets.

# Features
1. Set 2 and more level dependent drop-down lists.
2. Set 1 and more DDLs on a single sheet.
3. Set 1 and more DDLs from single data sheet.
4. Set DDLs from another files as a source data.
5. Set DDLs in a custom order of columns.
6. Auto-complete values when the only value is left.
7. Auto-delete validation when user deletes values in previous level

*Tip.* When you set new rule, use auto column numbers detection. It works when column names are the same in source and work sheet.

*Tip.* Validation works when user copies data down (uses `[Ctrl + V]` or `[Ctrl + D]` keys).

# Setup
1. Open your Sheets
2. Go to menu `Tools > Script Editor`
3. Paste the code from here: https://github.com/Max-Makhrov/Smart-Data-Valigation-in-Goolge-Sheets/blob/master/Master.gs.
4. Reload the Google Sheets file
5. The new menu will appear at the right. 

![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2018/01/ddl9.png)
6. Go to `Smart Data Validation > Set/Update`

![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2018/01/ddl101.png)
7. The sample sheets will appear. See the work in the sheet "Work Sample". See setting in the sheet "_Dv_Ini_"

![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2018/01/ddl7.png)
8. Have fun!

*Tip.* Name columns the same in the datasheet and in the worksheet. The script will find the number of columns for data validation.
![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2018/01/ddl8.png)

*Tip.* The sheet with settings is called “_Dv_Ini_”, it contains some hidden columns. Usually, a user does not need to make these settings.

## Advanced settings
![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2018/01/ddl111.png?w=676)

1.  **Source file Id.**  If the file is the same, leave this column blank. If you need to make the external file as a source, please make sure to fill this column.
2.  **Header Row**  and  **Columns**. If column names in the datasheet and in the worksheet are the same, leave these columns blank. If you need to set different column names or to use different headers, please fill. `Header row`  = a number of a row with column names in the worksheet.  `Columns` is a comma-separated list of columns for data validation.

*Tip.* **How to get file id.** Copy it from a file name, see a picture:
![enter image description here](https://sheetswithmaxmakhrov.files.wordpress.com/2018/01/ddl12.png?w=676)




# Limitations
1. Up to 500 values in a single DDL
2. Up to 50,000 calls / day.
Limits are related to Google quotas: https://developers.google.com/apps-script/guides/services/quotas

Notes:
* All \*.gs liles from code source are modules in a project. Master.gs is a compressed version of all the files. It's made in order to reduce copy-paste work of installation.
* If you want to see the code as it was developed, with all comments in a single file, please make a copy of this Google Sheet: https://docs.google.com/spreadsheets/d/16hL0Ip9rN8SFHkinBbN-1xUSfUQu5aKvdA2rEgOWSFM/copy. Open > Go To File > Make a Copy



--------------

Notes:
* Compressed the code with https://jscompress.com/
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEyMTc2NzY0MzddfQ==
-->