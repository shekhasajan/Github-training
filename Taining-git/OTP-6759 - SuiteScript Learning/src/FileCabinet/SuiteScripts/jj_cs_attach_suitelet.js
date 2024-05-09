/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/http', 'N/https', 'N/record', 'N/search', 'N/url'],
/**
 * @param{currentRecord} currentRecord
 * @param{http} http
 * @param{https} https
 * @param{record} record
 * @param{search} search
 * @param{url} url
 */
function(currentRecord, http, https, record, search, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

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
        var customerFilter,subsidiaryFilter;
        
        if(scriptContext.fieldId=='custpage_jj_filter_sub'){
         subsidiaryFilter = scriptContext.currentRecord.getValue({
            fieldId: 'custpage_jj_filter_sub'
        });
        console.log('subsidiaryFilter',subsidiaryFilter)
       
    }
    if(scriptContext.fieldId=='custpage_jj_filter_name'){
         customerFilter = scriptContext.currentRecord.getValue({
            fieldId: 'custpage_jj_filter_name'
        });
        console.log('customerFilter',customerFilter)
       
    }
    var currenturl = url.resolveScript({
        scriptId: "customscript_jj_sl_filter_so_exer_5",
        deploymentId: "customdeploy_jj_deploy_filter_exer_5",
        returnExternalUrl: false
    })+ '&subsidiaryFilter=' + encodeURIComponent(subsidiaryFilter) + '&customerFilter=' + encodeURIComponent(customerFilter)
 
    console.log('suiteletUrl', currenturl)
    window.location.href = currenturl;

    
    //fetch(currenturl);
  //  var subsidiaryId = rec.getValue('fieldId'); //Read data from suitelet



//     var suiteUrl = url.resolveScript({
//         scriptId: 'customscript_jj_sl_filter_so_exer_5',
//         deploymentId: 'customdeploy_jj_deploy_filter_exer_5',
// // set the script Id and the deployment Id for the suitelet you want to pass the value to.           
//         params : {
//             customerFilter : customerFilter, 
//             subsidiaryFilter: subsidiaryFilter//define a parameter and pass the value to it
//         }
//  });
//  fetch(suiteUrl);
 
 //window.location.href = suiteUrl;
 //window.location.href = suiteUrl; // replace current window OR
 //window.open(suiteUrl,"socialPopupWindow","location=no,width=900,height=900,scrollbars=yes,top=100,left=400,resizable = no");//open it a a new window
    }


   

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
       
    };
    
});
