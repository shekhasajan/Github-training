/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record','N/search','N/email'],
    /**
 * @param{record} record
 */
    (record, search, email ) => {
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
            if (scriptContext.type === scriptContext.UserEventType.CREATE) {
                let soRecord = scriptContext.newRecord;
                let dateCreated = soRecord.getValue({
                    fieldId:'trandate'
                })
                log.debug('dateCreated', dateCreated)
                let customerId = soRecord.getValue({
                    fieldId: 'entity' 
                });
                log.debug('customerId', customerId)


                let customerRec = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerId,
                    isDynamic: true

                })
                let customerName = customerRec.getText({
                    fieldId: 'entityid' 
                });
                log.debug(' customerName', customerName)
                let cusOverdue = customerRec.getValue({
                    fieldId: 'overduebalance'
                })

                log.debug('cusOverdue',cusOverdue);
               

                const dateObject = new Date(dateCreated);
                const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
                log.debug(' month', month)
                const name = customerName.substr(0, 2);
                let shortName = name.concat(": ",month)
                
                log.debug('shortName',shortName)
                customerRec.setValue({
                    fieldId:'custentity_jj_short_name',
                    value:shortName
                })

                customerRec.save({                
                    ignoreMandatoryFields: true    
                    });

                if(cusOverdue > 0){
                    try{
                    log.debug('overdue cus');
                    let repId = customerRec.getValue({
                        fieldId: 'salesrep' 
                    });
                    log.debug('repId', repId)
                 
                if(repId){
                    let supervisorRec = record.load({
                        type: record.Type.EMPLOYEE,
                        id: repId
    
                    })
                  let supervisorId = supervisorRec.getValue({
                    fieldId:'supervisor'
                  })
                   
                    log.debug('supervisorId', supervisorId)
                   
                   
                    email.send({
                        author: repId,
                        recipients: supervisorId,
                        subject: 'Alert!!',
                        body: 'Sales Order is created for the customers who have overdue'  
                    });
                }
                }
                catch(e){
                    log.debug('err',e)
                }
                    
                }
            }
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
        
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
