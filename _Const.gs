// User Settings
var C_USER_SETTINGS_SHEET = '_Dv_Ini_'; // name of sheet with settings
var C_SORT_DV_DATA = false; // set to false to leave data on sheets unsorted




// Script Settings
var C_DELIMETERS = ['>', '=>', '->', '>>', '|', ' |', '-->', '>>>']; // standart delimeters between values
var C_USER_PROPERTY_DV = 'Dv_my_property_1984';

// DV Sample Settings
var C_SAMPLE_DATA_SHEET = 'Data Sample'; // sample worksheet containing data
var C_SAMPLE_WORK_SHEET = 'Work Sample'; // sample worksheet to work on, for DV tests



// this settings are hard-coded into scripts
var C_USER_SETTINGS_KEYS = ['Work Sheet', 'Data Sheet', 'Source File Id', 'Header Row', 'Columns']; // headers for sheet with settings
var C_USER_SETTINGS_HIDDEN = [        0,             0,                1,            1,         1]; // hide columns with settings by default
var C_NUMBER_DELIMETER = ','; // default delimeter for lists of numbers on sheet with settings
var C_USER_SETTINGS_NOTES = 
  [
    'Name of sheet to make dependent drop-downs',
    'Name of sheet with data relating to the Work Sheet',
    '[Optional] Id of file with data. Please omit if Data Sheet is in current file',
    '[Optional] Header row of Work Sheet. Data Validations come after this row. Leave this field blank to make trigger automatically find matching headers from Data Sheet in Work Sheet.',
    '[Optional] Column numbers for Data Validation, [ ' + C_NUMBER_DELIMETER + ' ] separated list. Data Validations come after this row. Leave this field blank to make trigger automatically find matching headers from Data Sheet in Work Sheet.'    
    
  ];
  
  
// Custom Error Key
var C_CUSTOM_ERROR_KEY = 'Oh, Boy!';