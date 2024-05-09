/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search','N/runtime'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search, runtime) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try{
                var loadSearch = search.load({
                    id: 'customsearch_jj_cust_search_xyz'
                });
                var senderId = '-5';
                // let recipientDetails = runtime.getCurrentUser();
                // let recipientId = recipientDetails.id;
              //  log.debug('recipientId',recipientId)
                loadSearch.run().each(function(result) {
                //    var cusId= result.getValue({
                //         name:'entityid'
                //     })
                    var cusId= result.id;

    log.debug('cusId',cusId)
                    email.send({
                        author:senderId,
                        recipients: cusId,
                        subject: 'Helloo.. new offers!!',
                        body: 'checkout the new website'
                     //   attachments: [pdfFile]  
                    });
                })
                return true;
            }
            catch(e){
                log.debug('error',e)
            }
            
        }

        return {execute}

    });
