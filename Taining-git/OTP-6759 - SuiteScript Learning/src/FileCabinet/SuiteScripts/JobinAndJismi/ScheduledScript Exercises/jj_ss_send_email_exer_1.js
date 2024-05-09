/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/currentRecord', 'N/record', 'N/search', 'N/email'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{search} search
 */
    (currentRecord, record, search, email) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            var salesrep,managerId,htmlBody;
            try{
               
            var loadSearch = search.load({
                id: 'customsearch152'
            });

            var loadsearchArr = [];
            loadSearch.run().each(function (result) {
                var entity = result.getText({
                    name: 'entity'
                });
                var entityId = result.getValue({
                    name: 'entity'
                });
                log.debug('entiry', entity)
                var docNo = result.getValue({
                    name: 'tranid'
                });

                var amount = result.getValue({
                    name: 'total'
                });
                var date = result.getValue({
                    name: 'datecreated'
                });
                 salesrep = result.getValue({
                    name: 'salesrep'
                });
                // var cusRec = record.load({
                //     type: record.Type.CUSTOMER,
                //     id: entityId,
                //     isDynamic: true,

                // });
                // var salesrep=cusRec.getValue({
                //     fieldId:'salesrep'
                // })
                if (salesrep) {
                    var repRec = record.load({
                        type: record.Type.EMPLOYEE,
                        id: salesrep,
                        isDynamic: true,

                    });

                     managerId = repRec.getValue({
                        fieldId: 'supervisor'
                    })
                    var salesrepemailId = repRec.getValue({
                        fieldId: 'email'
                    })
                   

                    log.debug('managerId', managerId);
                    if (managerId) {
                        var fieldLookUp = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: managerId,
                            columns: ['email']
                        });
                        log.debug('email', fieldLookUp.email)
                    }


                }


                if (salesrep && salesrepemailId) {

                    if (managerId) {
                        if (fieldLookUp.email) {
                            //   sendEmail(salesrep,managerId,docNo,entity)
                            htmlBody = '<html><body><h1>Previous month order!</h1>';
                            htmlBody += '<p> Order Number: ' + docNo + '</p>';
                            htmlBody += '<p>customer: ' + entity + '</p>';
                            htmlBody += '</body></html>';

                        }
                    }
                }


                return true;
            });
            email.send({
                author: salesrep,
                recipients: managerId,
                subject: 'Order previous month notification',
                body: htmlBody
            });
       //     log.debug('email send for', docNo)
            //   log.debug('salesrep1',salesrep)
        }
        catch(e){
            log.debug('err',e)
        }
        }
    


        return { execute }

    });
