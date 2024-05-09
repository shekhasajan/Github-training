/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/currentRecord', 'N/email', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{currentRecord} currentRecord
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (currentRecord, email, record, runtime, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            var loadSearch = search.load({
                id: 'customsearch_jj_openinvoice'
            });
            var invoiceArr = []
            
            loadSearch.run().each(function(result) {
                var docNo = result.getValue({
                    name: 'tranid'
                })
                var cusName = result.getText({
                    name: 'entity'
                });
                var openInv = {docNo:docNo,cusName:cusName};
                invoiceArr.push(openInv);
                return true;
            })
            log.debug('invoiceArr', invoiceArr);
            var invoiceData = JSON.stringify(invoiceArr)

            //load admin search
            var loadSearch = search.load({
                id: 'customsearch_jj_admin_search'
            });
            var senderId = '1945';
            var htmlBody = '<html><body><h1>Open invoices!</h1>';
            htmlBody += '<p>' + invoiceData + '</p>';
            htmlBody += '</body></html>';
            loadSearch.run().each(function(result) {
                var adminId = result.id;
                log.debug('admin',adminId);
              
                email.send({
                    author: senderId,
                    recipients: adminId,
                    subject: 'Open invoices!',
                    body: htmlBody  
                });
                log.debug('email send',adminId)
            })

        }

        return {execute}

    });
