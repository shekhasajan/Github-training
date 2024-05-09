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
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */

    function findLineCountAndLoc(currentRecord){
        var lineCount = currentRecord.getLineCount({
            sublistId: 'item'
        });
        console.log('lineCount',lineCount);
    
        var location = currentRecord.getValue({
            fieldId: 'location'
        });
        console.log('location',location);
        var obj = {lineCount:lineCount, location:location};
        console.log('obj', obj)
        return obj;
    }

    function setLinelevelLocation(currentRecord){
        let obj = findLineCountAndLoc(currentRecord);
        console.log('obj1', obj)
        for(var i=0;i<obj.lineCount;i++){
            console.log('line')
            var lineNum = currentRecord.selectLine({
                sublistId: 'item',
                line: i
            });

                    currentRecord.setCurrentSublistValue({   //set item field
                        sublistId: 'item',
                        fieldId: 'custcol_jj_location',
                        value:obj.location,
                        });
                
        }
    }


    function pageInit(scriptContext) {

    var currentRecord = scriptContext.currentRecord;
    setLinelevelLocation(currentRecord);
  
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
        var fieldId = scriptContext.fieldId;
        if (fieldId === 'location') {
            setLinelevelLocation(currentRecord);
        }
    }

    
 

   
    function saveRecord(scriptContext) {
        var currentRecord = scriptContext.currentRecord;
        let obj = findLineCountAndLoc(currentRecord);
        for(var i=0;i<obj.lineCount;i++){
            console.log('line')
            var lineNum = currentRecord.selectLine({
                sublistId: 'item',
                line: i
            });
           var getLoc = currentRecord.getCurrentSublistValue({   //set item field
                sublistId: 'item',
                fieldId: 'custcol_jj_location'
                });
                console.log('getLoc', getLoc);
            if(getLoc !== obj.location) {
               return false;  
               
            }        
          
           // return false;  
                
        }
        return true;


    }
  

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
     
    };
    
});
