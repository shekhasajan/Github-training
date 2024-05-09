/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/email', 'N/record','N/runtime'],
/**
 * @param{currentRecord} currentRecord
 * @param{email} email
 * @param{record} record
 */
function(currentRecord, email, record, runtime) {
    var oldQuantityArr = [];
    var olditemQtyObj={};
    function pageInit(scriptContext) {

        var currentRecord = scriptContext.currentRecord;
   
           var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
           console.log('lineCount', lineCount)
           var flag = 0;
           // Loop through each line item to check for quantity changes
           for (var i = 0; i < lineCount; i++) {
            var oldItem = currentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
               var oldQuantity = currentRecord.getSublistValue({
                   sublistId: 'item',
                   fieldId: 'quantity',
                   line: i
               });

              

             
               //oldQuantityArr.push(olditemQtyObj);
               
               olditemQtyObj[oldItem]=oldQuantity
            }
            console.log('olditemQtyObj',olditemQtyObj)
          //  console.log(oldQuantityArr)
    }


  

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
//     function saveRecord(scriptContext) {
//         var currentRecord = scriptContext.currentRecord;
//      //   var currentPO = currentRecord.get();
//         var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
//         console.log('lineCount', lineCount)
// var flag = 0;
// var changedQuantity=[];
//         // Loop through each line item to check for quantity changes
//         for (var i = 0; i < lineCount; i++) {
//             var newQuantity = currentRecord.getSublistValue({
//                 sublistId: 'item',
//                 fieldId: 'quantity',
//                 line: i
//             });
//             var newItem = currentRecord.getSublistValue({
//                 sublistId: 'item',
//                 fieldId: 'item',
//                 line: i
//             });
            
//             console.log('newQuantity', newQuantity)
//             console.log('olditemQtyObj[newItem]',olditemQtyObj[newItem])
//           if(olditemQtyObj[newItem] == newQuantity )
//           {
//             console.log('correct')
//           }
//           else{
//             console.log('mismatch')
//             var qtyObj = {Item:newItem, newQty:newQuantity, OldQty:olditemQtyObj[newItem]}
//             changedQuantity.push(qtyObj)

//           }
//             // If quantity has changed, send email to vendor
            
//         }

//         return false; // Allow saving the record if no quantity changes were detected
//     }


    

    // /**
    //  * Validation function to be executed when sublist line is committed.
    //  *
    //  * @param {Object} scriptContext
    //  * @param {Record} scriptContext.currentRecord - Current form record
    //  * @param {string} scriptContext.sublistId - Sublist name
    //  *
    //  * @returns {boolean} Return true if sublist line is valid
    //  *
    //  * @since 2015.2
    //  */
    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
 
        if (context.fieldId === 'quantity') {
            var oldQuantity = currentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: context.line
            });
 console.log('oldQuantity',oldQuantity)
            var updatedQuantity = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity'
            });
            console.log('updatedQuantity',updatedQuantity)
 
            var itemName = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });
            var itemName1 = currentRecord.getCurrentSublistText({
                sublistId: 'item',
                fieldId: 'item'
            });
 console.log('itemName1',itemName1)
            var documentNumber = currentRecord.getValue({
                fieldId: 'tranid'
            });
 
            var vendorId = currentRecord.getValue({
                fieldId: 'entity' // Assuming 'entity' field holds the vendor ID
            });
            let recipientDetails = runtime.getCurrentUser();
            let recipientId = recipientDetails.id;
          //  sendEmailToVendor(oldQuantity, updatedQuantity, itemName, documentNumber, vendorId);
          var sub = ' The quantity updated in the PO: ' + documentNumber ;
          var htmlBody = '<html><body><h1>Quantity updated!</h1>';
          htmlBody += '<p> The quantity updated in the PO: ' + documentNumber + '</p>';
          htmlBody += '<p>Item is: ' + itemName1 + '</p>';
          htmlBody += '<p>Oldquantity: ' + oldQuantity + '</p>';
          htmlBody += '<p>New quantity: ' + updatedQuantity + '</p>';
          htmlBody += '</body></html>';

          email.send({
            author: recipientId,
            recipients: vendorId,
            subject: sub,
            body: htmlBody
          })
        }
    }
 



    return {
        pageInit:pageInit,
       // saveRecord: saveRecord
       fieldChanged:fieldChanged
      
    };
    
});
