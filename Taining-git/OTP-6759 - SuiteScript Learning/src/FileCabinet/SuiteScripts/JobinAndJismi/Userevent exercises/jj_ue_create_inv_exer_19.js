/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
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
            if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) {
                log.debug('enter')
                    let ifRecord = scriptContext.newRecord;
                // var status = ifRecord.getValue({
                //     fieldId:'status'
                // })
                var shipstatus = ifRecord.getValue({
                    fieldId:'shipstatus'
                })
               // log.debug('status', status)
                log.debug('shipstatus', shipstatus)

                // let oldRec = scriptContext.oldRecord;
                // var oldStatus = oldRec.getValue({
                //     fieldId:status
                // })
                // log.debug('oldStatus', oldStatus)
                var soId = ifRecord.getValue({
                    fieldId: 'createdfrom'
                });
                log.debug('soId', soId)
                var fieldLookUp = search.lookupFields({
                    type: search.Type.SALES_ORDER,
                    id: soId,
                    columns: ['location','subsidiary','entity']
                });

              
               log.debug('location',fieldLookUp.location[0].value);

                if(shipstatus == 'C'){
                    var entityId = ifRecord.getValue({
                        fieldId: 'entity'
                    });
                    log.debug('entityId', entityId)
                    var lineCount = ifRecord.getLineCount({
                        sublistId: 'item'
                    });
    var lineItems = [];
    var itemDetails ={};
                    // Iterate over each line item
                    for (var i = 0; i < lineCount; i++) {

                        // ifRecord.selectLine({
                        //     sublistId: 'item',
                        //     line: i
                        // });
                        // Get the value of the 'quantity' field for each line item
                        var quantity = ifRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            line: i
                        });
                        var itemId = ifRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: i
                        });
    
                        // Log the quantity for each line item
                        itemDetails={item:itemId, quantity:quantity}
                        lineItems.push(itemDetails)
                    }
                    log.debug('lineItems', lineItems)
                   
                var invOrder = record.create({
                    type: record.Type.INVOICE, 
                    isDynamic: true,
                    defaultValues: {
                        entity:entityId
                    } 
                });

                invOrder.setValue({
                    fieldId:'location',
value:fieldLookUp.location[0].value
                })
               for (var i = 0; i < lineCount; i++) {
                invOrder.selectNewLine({ //add a line to a sublist
            sublistId: 'item'      //specify which sublist
            });
            
            invOrder.setCurrentSublistValue({   //set item field
            sublistId: 'item',
            fieldId: 'item',
            value:lineItems[i].item //replace with item internal id 
            });
            invOrder.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
            value:lineItems[i].quantity //replace with quantity
            });
          
            
            //repeat above pattern to set the rest of the line fields
            
            invOrder.commitLine({  //writes the line entry into the loaded record
            sublistId: 'item'
            });
       }

            
           let id = invOrder.save({                  //writes record back to database
            ignoreMandatoryFields: true    //set for testing in case you want to create a record without validating which can give errors
            });
    
            log.debug('id',id)
                }
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
