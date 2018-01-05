/*
*******************************************************************************************  

   _____                      _     _____        _            
  / ____|                    | |   |  __ \      | |           
 | (___  _ __ ___   __ _ _ __| |_  | |  | | __ _| |_ __ _     
  \___ \| '_ ` _ \ / _` | '__| __| | |  | |/ _` | __/ _` |    
  ____) | | | | | | (_| | |  | |_  | |__| | (_| | || (_| |    
 |_____/|_| |_| |_|\__,_|_|   \__|_|_____/ \__,_|\__\__,_| __ 
 \ \    / /      | (_)   | |     | | (_)                  /_ |
  \ \  / /_ _ ___| |_  __| | __ _| |_ _  ___  _ __   __   _| |
   \ \/ / _` / __| | |/ _` |/ _` | __| |/ _ \| '_ \  \ \ / / |
    \  / (_| \__ \ | | (_| | (_| | |_| | (_) | | | |  \ V /| |
     \/ \__,_|___/_|_|\__,_|\__,_|\__|_|\___/|_| |_|   \_(_)_|
                                                              
SDV v.1
*******************************************************************************************


  _______      __
 |  __ \ \    / /
 | |  | \ \  / / 
 | |  | |\ \/ /  
 | |__| | \  /   
 |_____/   \/    
 Data Validation  
  
  _____  _____  _      _____  
 |  __ \|  __ \| |    |  __ \ 
 | |  | | |  | | |    | |__) |
 | |  | | |  | | |    |  _  / 
 | |__| | |__| | |____| | \ \ 
 |_____/|_____/|______|_|  \_\                                                              
  Dependant Drop-Down List Rule

    1. Install triggers      
      a. prepare data
        prepare lists: each data list in separate sheet
        prepare unique lists for the first DV rules from data sheets in sepatate sheets
        create DV as usual for first columns with future DDLR:
          Data → Data Validation → Select range of unique values
      b. set variables
         sSheetsData       = ['Data1', 'Data2', 'Data1']
                                 ↓        ↓        ↓
         sSheetsValidation = ['Sht_1', 'Sht_1', 'Sht_2']
         ||
         Makes relationships between them
         Sht_1 has 2 DDLR: from Data1, Data2
         Sht_2 has 1 DDLR: frm Data1
         
      c. set trigger onOpen_ + onEdit_ (once)
      d. initialyse data
        do it each time:
          data changes
          column order in DV sheets change
        onOpen thigger will also do it each time sheet is refreshed
      
    2. onOpen: initialyse data
      a. initialyze columns
        initialyze header rows... → header row = first row with 100% match of data
        finds header columns → matched by column name. 
          Important: Column names are in row1 in Data sheets
        writes data to settings
        
        make DVR object
        
        Input:
          var sSheetsData       = ['Data1', 'Data2', 'Data1'];
          var sSheetsValidation = ['Sht_1', 'Sht_1', 'Sht_2'];        
        
        Output:
          // call it connections later
          var oDvRules = { 
            "SheetsValidation": {
              "Sht_1": {
                "0data": {"nHeaderRow": 3, "columnsToUse": [1, 2]} // key = idFile (0 is this file) + nameSheet
                "1YbOHEQkQZaz6nlTikF3oBiNg4wEZY2t1sZz-9p6VKSEdata": {"nHeaderRow": 3, "columnsToUse": [5, 6]}             
               }
              "Sht_2": {
                "0data": {"nHeaderRow": 3, "columnsToUse": [1, 2]}
                ...
              }
            }
            
            "SheetsData": {
              // key = idFile (0 is this file) + nameSheet
              "0data": { 
                "sName": "Data1",
                "data": oDvData1 // see sample in 3c ↓
               }                
              "0Data2": { 
                "sName": "Data2" 
                "data": oDvData2
              }
            }
            
        
        
      b. sorting data 
        Data in Data sheets must be sorted because last level of SDV will look for values in actual ranges
      c. make objects for SDV
      
        Input: Sorted Data
          |        A       |       B       |        C        |        D        
           ________________________________________________________________
           Planet           Mainland        Country           City        =====> first row of sheet |Data|
           ----------------------------------------------------------------
        01 Earth	         Europe	         Britain	       London
        02 Earth	         Europe		     Britain	       Manchester
        03 Earth	         Europe		     Britain	       Liverpool
        04 Earth	         Europe		     France	           Paris
        05 Earth	         Europe		     France	           Lion
        06 Earth	         Europe		     Italy	           Rome
        07 Earth             Europe		     Italy	           Milan
        08 Earth	         Europe		     Greece	           Athenes
        09 Earth	         Asia		     China	           Pekin
        10 Earth	         Africa		     Algeria	       Algiers
        11 Earth	         America		 USA	           Dallas
        12 Earth             America		 USA	           New York
        13 Earth             America		 USA	           San Francisco
        14 Earth             America		 USA	           Chicago     
        15 Tatooine	         Yulab		 	 Putesh	           ASU
        16 Tatooine	         Yulab		 	 Putesh	           Niatirb
        17 Tatooine	         Yulab	 	 	 Zalip	           Duantan  
        ----------------------------------------------------------------
            ↑  Note: planet names has to repeat so script could sort the data properly
            ↑  Note: do not change data order for proper work of script
        
        Output: Object for checks
        
        var oDvData = 
        "headers": ["Planet", "Mainland", "Country", "City"]
        "d":
          {"Earth":
            {"Europe":{
              "Britain":["London","Manchester","Liverpool"],
              "France":["Paris","Lion"],
              "Italy":["Rome","Milan"],
              "Greece":["Athenes"]
          },
          "Asia":{"China":["Pekin"]},
          ...}
        
        we assume more then one data sheets, so script makes array of sets:
                         
        writes aDvDatas in propetries, use:
          PropertiesService.getUserProperties();  


    3. onEdit
     go through sheets []

*/



/*
  Tests
    + wrong sheet
    + wrong range
    + wrong value
    + fill the only value
    + change last level
    + big range
    + 2+ rules: same file source
    + 2+ rules on 1 sheet
    - mixed range: rule intersections (no rule intersecions...)
    
    + 2+ rules: not same file source    
    change existing setting
    change columns on setting
    change sheet source on setting
    1 work, 2+ data sheets
    set with wrong column numbers
    use many times a day -- limit 8(
    big data sheet (wordy)
    
    
    TODO: 
      1. write auto-sets on _Dv_Ini_
      2, think of Quota: Properties read/write	50,000 / day

*/