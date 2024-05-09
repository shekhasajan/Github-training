/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record','N/email','N/runtime'],
    /**
 * @param{record} record
 */
    (record, email, runtime) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            let recordNew = scriptContext.newRecord;
            let recordType = scriptContext.newRecord.type;
            let recordId = scriptContext.newRecord.id;
            let recipientDetails = runtime.getCurrentUser();
            let recordName = recordNew.getValue({
                fieldId: 'entityid' 
            });
            log.debug('soRecordType',recordType);
            log.debug('soRecordId',recordId);
            log.debug('recipient details',recipientDetails);
            log.debug('recordName',recordName);
            let senderId = 94;
            let recipientId = recipientDetails.id;
            if (scriptContext.type === scriptContext.UserEventType.CREATE){
                try{
                var htmlBody = '<html><body><h1>Record Created!</h1>';
                htmlBody += '<p>Entity Type is: ' + recordType + '</p>';
                htmlBody += '<p>Entity Id is: ' + recordId + '</p>';
                htmlBody += '<p>Record name is: ' + recordName + '</p>';
                htmlBody += '</body></html>';
                email.send({
                    author: senderId,
                    recipients: recipientId,
                    subject: 'Test Sample Email',
                    body: htmlBody  
                });
            }
            catch(e){
                log.debug('error', e)
            }

            }
            if (scriptContext.type ===  scriptContext.UserEventType.DELETE) {
                try {
                    var htmlBody = '<html><body><h1>Record Deleted!</h1>';
                    htmlBody += '<p>Entity Type is: ' + recordType + '</p>';
                    htmlBody += '<p>Entity Id is: ' + recordId + '</p>';
                    htmlBody += '<p>Record name is: ' + recordName + '</p>';
                    htmlBody += '</body></html>';
                    email.send({
                        author: senderId,
                        recipients: recipientId,
                        subject: 'Test Sample Email',
                        body: htmlBody  
                    });   
                } catch (error) {
                    log.debug('error', error)
                }
            
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
