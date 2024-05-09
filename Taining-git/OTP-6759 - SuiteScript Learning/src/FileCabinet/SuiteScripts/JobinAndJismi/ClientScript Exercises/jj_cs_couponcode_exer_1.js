/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/ui/dialog'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{dialog} dialog
 * @param{message} message
 */


function(currentRecord,dialog) {
    function setCouponcode(currentRecord){

        var isChecked = currentRecord.getValue({
            fieldId: 'custentity_jj_apply_coupon'
           })
           var codeField = currentRecord.getField({
            fieldId: 'custentity_jj_coupon_code'
        });
           if(isChecked){  
            codeField.isDisabled = false;
        }
        else{
            currentRecord.setValue({
                fieldId: 'custentity_jj_coupon_code',
                value:'',
                ignoreFieldChanged:true
            });
            codeField.isDisabled = true;
           
        }
    }
   
   
    function pageInit(scriptContext) {
        var currentRecord = scriptContext.currentRecord;
        setCouponcode(currentRecord);
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        var currentRecord = scriptContext.currentRecord;
        var findField = scriptContext.fieldId;
     
        if (findField === 'custentity_jj_apply_coupon'){
           setCouponcode(currentRecord);
           
        }
    }


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
        var couponApplied = currentRecord.getValue({
            fieldId: 'custentity_jj_coupon_code'
        });
           console.log('couponApplied', couponApplied)
           console.log(couponApplied.length)
          if (couponApplied.length !== 5){
            let options = {
                title: 'Alert',
                message: '5 letter coupon code should be added. Click OK to continue.'
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
            return true;
          }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
         saveRecord: saveRecord
    };
    
});
