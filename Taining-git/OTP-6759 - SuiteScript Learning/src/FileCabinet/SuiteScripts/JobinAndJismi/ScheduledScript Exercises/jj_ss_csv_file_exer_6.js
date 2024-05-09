/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search','N/file'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search,file) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
try{
    var mySearch = search.load({
        id: 'customsearch_jj_customer_search'
    });
    // // var senderId = '-5';
    // var columns = mySearch.columns;
    // log.debug('mySearch', columns);
    // log.debug('mySearch lenght', columns.length);
    
    //Creating arrays that will populate results
    
    
    var csvContent = 'Name,Date Created,Terms,Sales Rep\n';
    //Looping through the search results
    mySearch.run().each(function(result){
        var name = result.getValue({ name: "entityid" });
        var dateCreated = result.getValue({ name: "datecreated" });
        var terms = result.getText({ name: "terms" });
        var salesRep = result.getText({ name: "salesrep" });
       log.debug('name',name);
       log.debug('dateCreated',dateCreated);
        csvContent += name + ',' + dateCreated + ',' + terms + ',' + salesRep +'\n';
          return true; 
       });
 
    // Create the CSV file
    var csvFile = file.create({
        name: 'customers_report.csv',
        contents: csvContent,
        folder: 202,
        fileType: 'CSV'
    });
    var csvFileId = csvFile.save();
 
    log.debug('CSV File Created with ID', csvFileId);
    
    //  function createFile(content){
    //  //Creating a string variable that will be used as CSV Content
    //  var contents='';
     
    //  for(var z =0; z<content.length;z++){
    //   contents +=content[z].toString() + '\n';
    //  }
   
    
    // log.debug('contents',contents);
    // var fileObj = file.create({
    //  name: 'testsearchcsv.csv',
    //  fileType: file.Type.CSV,
    //  contents: contents,
    //  description: 'This is description',
    //  folder: 202
    // });
    

   // var fileId = fileObj.save();
  //  log.debug('fileId',fileId)
  //  return fileId;
//}

    email.send({
        author:1945,
        recipients: -5,
        subject: 'Helloo.. new offers!!',
        body: 'checkout the new website',
        attachments: [csvFile]  
    });
}
catch(e){
    log.debug('err',e)
}
        }

        return {execute}

    });
