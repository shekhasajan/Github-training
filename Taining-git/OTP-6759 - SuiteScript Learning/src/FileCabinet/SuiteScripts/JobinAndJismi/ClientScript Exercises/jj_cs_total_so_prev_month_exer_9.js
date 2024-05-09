/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord','N/search'],
/**
 * @param{currentRecord} currentRecord
 */
function(currentRecord,search) {
    
  

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
var fieldId =scriptContext.fieldId;
if(fieldId == 'entity'){
    var customerId = currentRecord.getValue({
        fieldId:'entity'
    })
    var salesorderSearchObj = search.create({
        type: "salesorder",
        filters:
        [
           ["type","anyof","SalesOrd"], 
           "AND", 
           ["datecreated","within","lastmonth"], 
           "AND", 
           ["mainline","is","T"], 
           "AND", 
           ["customermain.internalid","anyof",customerId]
        ],
        columns:
        [
           search.createColumn({name: "trandate", label: "Date"}),
        ]
     });
     var searchResultCount = salesorderSearchObj.runPaged().count;
     log.debug("salesorderSearchObj result count",searchResultCount);
     salesorderSearchObj.run().each(function(result){
        // .run().each has a limit of 4,000 results
        return true;
     });

     currentRecord.setValue({
        fieldId:'custbody_jj_total_no_so',
        value:searchResultCount
     })
     

}
    }



    return {
       
        fieldChanged: fieldChanged
       
    };
    
});
