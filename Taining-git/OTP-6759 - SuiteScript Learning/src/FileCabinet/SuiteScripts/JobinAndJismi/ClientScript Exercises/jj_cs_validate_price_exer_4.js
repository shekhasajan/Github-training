/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record', 'N/ui/dialog'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{dialog} dialog
 */
function(currentRecord, record, dialog) {
    

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {
        console.log('test1')
        var currentRecord = scriptContext.currentRecord;
        var sublistId = scriptContext.sublistId;
        var fieldId = scriptContext.fieldId;
        if(sublistId=='item'){
          
            var amount = currentRecord.getCurrentSublistValue({  
                sublistId: 'item',
                fieldId: 'amount',
                });
                if(amount <= 200){
                    let options = {
                        title: 'Alert',
                        message: 'Amount must be greater than 200'
                    };
                
                    function success(result) {
                        console.log('Success with value ' + result);
                    }
                
                    function failure(reason) {
                        console.log('Failure: ' + reason);
                    }
                
                    dialog.alert(options).then(success).catch(failure);
                }
                else{
                    console.log('above')
                    return true;
                }
        }
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {
       
    }

   


    return {
      
        validateLine: validateLine
        //validateInsert: validateInsert
     
    };
    
});
