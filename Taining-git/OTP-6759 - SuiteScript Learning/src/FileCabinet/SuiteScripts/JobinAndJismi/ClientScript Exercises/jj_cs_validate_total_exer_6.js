/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record', 'N/ui/dialog'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 */
function(currentRecord, record, dialog) {
    

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        var currentRecord = scriptContext.currentRecord;
        console.log('currentRecord', currentRecord)
        var amount = currentRecord.getValue({
            fieldId:'total'
        })
       
        console.log('amount', amount);
       
        // if(amount <= 10000){
        //     dialog.confirm({
        //         title: "Warning!",
        //         message: "Total amount is less than 10000. Click OK to continue!"
        //       }).then(function (result) {
        //         if (result) {
        //             // User clicked OK, allow saving the record
        //             console.log('ok')
        //             return true;
        //         } else {
        //             console.log('not ok')
        //             // User clicked Cancel, prevent saving the record
        //             return false;
        //         }
        //     }).catch(function (reason) {
        //         console.log('Dialog failed: ' + reason);
        //         // Dialog failed, prevent saving the record
        //         return false;
        //     });
             
        // }
        // else{
        //     console.log('above')
        //     return true;
        // }
        if (amount <= 10000) {
            let con = confirm("Total amount is less than 10000. Click OK to continue");
            if (con) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return true;
        }
      
    }

    return {
        saveRecord: saveRecord
    };
    
});
