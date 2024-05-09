/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            var newRecord = scriptContext.newRecord;
            var soNum = newRecord.getValue({
                fieldId:'custbody_jj_number'
            });
          log.debug('soNum',soNum)
          if(soNum >=100){
            newRecord.setValue({
                fieldId:'custbody_jj_result',
                value: 'Result: Passed'
            });
          }
          else{
            newRecord.setValue({
                fieldId:'custbody_jj_result',
                value: 'Result: Failed'
            });
          }
        //   newRecord.save({  enableSourcing: false,
        //     ignoreMandatoryFields: true});
        }

        return {onAction};
    });
