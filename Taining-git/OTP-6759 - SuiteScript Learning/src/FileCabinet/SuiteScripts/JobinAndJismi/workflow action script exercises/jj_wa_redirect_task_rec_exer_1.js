/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/action', 'N/record', 'N/search'],
    /**
 * @param{action} action
 * @param{record} record
 * @param{search} search
 */
    (action, record, search) => {
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
            var title = newRecord.getValue({
                fieldId:'title'
            });
          log.debug('title',title)
var cusTaskRec = record.create({
    type: 'customrecord_jj_task_custom_record',
    isDynamic: true,
})
cusTaskRec.setValue({
    fieldId:'name',
    value:title
})
var recId = cusTaskRec.save();
log.debug('recId',recId)
return recId;

        }

        return {onAction};
    });
