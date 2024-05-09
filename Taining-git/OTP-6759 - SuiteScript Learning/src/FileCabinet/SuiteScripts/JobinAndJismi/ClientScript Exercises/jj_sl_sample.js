/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record'],
    /**
 * @param{email} email
 * @param{record} record
 */
    (email, record) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            var recipientEmail = 'recipient@example.com';
            var subject = 'Sample Scheduled Email';
            var body = 'This is a sample email sent from a scheduled script.';
            email.send({
                author: scriptContext.user,
                recipients: recipientEmail,
                subject: subject,
                body: body
            });
        }

        return {execute}

    });
