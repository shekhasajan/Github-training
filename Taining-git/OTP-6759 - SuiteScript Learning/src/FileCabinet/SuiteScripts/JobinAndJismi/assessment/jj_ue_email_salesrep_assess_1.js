/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search','N/email'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email) => {
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

        var searchResultCount;
        const afterSubmit = (scriptContext) => {
            if (scriptContext.type === scriptContext.UserEventType.CREATE) {

                try {
                    let soRecord = scriptContext.newRecord;

                    var customerId = soRecord.getValue({
                        fieldId: 'entity',
                    });
                    log.debug('customerId', customerId);


                    var customerRec = record.load({
                        type: record.Type.CUSTOMER,
                        id: customerId,
                        isDynamic: true,

                    })
                    let repId = customerRec.getValue({
                        fieldId: 'salesrep'
                    })
                    log.debug('repId', repId);

                    CheckSalesRep(customerId); // call function to create a search for the open orders
                    log.debug('searchResultCount aftersubmit', searchResultCount);

                    if (searchResultCount > 5) { //if there are more than 5 open orders, then email will send to sales rep of the customer
                        log.debug('send email')
                        var senderId = 94;
                        if(repId){
                        
                        email.send({
                            author: senderId,
                            recipients: repId,
                            subject: 'Order placed',
                            body: 'Sales Order is created for the customers who have more than 5 open orders'  
                        });
                    }
                    }
                    else {
                        log.debug('no email')
                    }


                } catch (e) {
                    log.debug('errror', e)
                }

            }
        }
// function to search open orders
        function CheckSalesRep(customerId) {
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["status", "anyof", "SalesOrd:D", "SalesOrd:A", "SalesOrd:F", "SalesOrd:E", "SalesOrd:B"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["customermain.internalid", "anyof", customerId]
                    ],
                columns:
                    [
                        search.createColumn({ name: "transactionnumber", label: "Transaction Number" }),
                        search.createColumn({ name: "type", label: "Type" })
                    ]
            });
            searchResultCount = salesorderSearchObj.runPaged().count;
            log.debug("salesorderSearchObj result count", searchResultCount);
            return searchResultCount;
         
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });

