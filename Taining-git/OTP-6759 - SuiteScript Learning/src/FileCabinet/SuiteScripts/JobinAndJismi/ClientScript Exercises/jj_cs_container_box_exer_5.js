/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 */
function(currentRecord, record) {
    
 

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

   
    // function fieldChanged(scriptContext) {
    //     var currentRecord = scriptContext.currentRecord;
    //     if(scriptContext.fieldId == 'custbody_jj_length' || scriptContext.fieldId=='custbody_jj_breadth' || scriptContext.fieldId=='custbody_jj_height')
    //     var length = currentRecord.getValue({
    //         fieldId:'custbody_jj_length'
    //     });
    //     var breadth = currentRecord.getValue({
    //         fieldId:'custbody_jj_breadth'
    //     });
    //     var height = currentRecord.getValue({
    //         fieldId:'custbody_jj_height'
    //     });

    // }

 


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
        console.log('validate')
        var currentRecord = scriptContext.currentRecord;
       // if(scriptContext.fieldId == 'custbody_jj_length' || scriptContext.fieldId=='custbody_jj_breadth' || scriptContext.fieldId=='custbody_jj_height')
       
      
     

        if(scriptContext.sublistId=='item'){
            var itemId = currentRecord.getCurrentSublistValue({  
                sublistId: 'item',
                fieldId: 'item'
                });
                var itemRec= record.load({
                    type: record.Type.INVENTORY_ITEM,
                    id: itemId,
                    isDynamic: true
                })
                var length = itemRec.getValue({
                    fieldId:'custitem_jj_length'
                });
                console.log('length',length)
                var breadth = itemRec.getValue({
                    fieldId:'custitem_jj_breadth'
                });
                console.log('breadth',breadth)
                var height = itemRec.getValue({
                    fieldId:'custitem_jj_height'
                });
                console.log('height',height)
            var rate = currentRecord.getCurrentSublistValue({  
                sublistId: 'item',
                fieldId: 'rate'
                });
        var containerValue = currentRecord.setCurrentSublistValue({  
            sublistId: 'item',
            fieldId: 'custcol_jj_container_box',
            value: length*breadth*height
            });
            console.log('containerValue',containerValue)
            var amount = rate*length*breadth*height;
            console.log('amount',amount)
            currentRecord.setCurrentSublistValue({  
                sublistId: 'item',
                fieldId: 'amount',
                value: amount
                });
            var amountVal =currentRecord.getCurrentSublistValue({  
                sublistId: 'item',
                fieldId: 'amount'
                });
                if(amountVal !== amount){
                    return false;
                }
                else{
                    return true;
                }
        }

    }

  

 

    return {
      
        //fieldChanged: fieldChanged,
        validateLine: validateLine
    };
    
});
