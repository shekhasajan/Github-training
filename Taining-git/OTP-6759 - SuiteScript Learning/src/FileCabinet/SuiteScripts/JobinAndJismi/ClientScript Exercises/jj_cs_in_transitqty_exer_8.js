/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record', 'N/search'],
    /**
     * @param{currentRecord} currentRecord
     * @param{record} record
     */
    function (currentRecord, record, search) {



        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {
            var currentRecord = scriptContext.currentRecord;

            var location = currentRecord.getValue({
                fieldId: "location"
            })
            console.log('location', location)
            var sublistId = scriptContext.sublistId;

            if (sublistId == 'item') {
                var itemId = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                });
                console.log('itemId', itemId)
                var itemRec = record.load({
                    type: record.Type.INVENTORY_ITEM,
                    id: itemId,
                    isDynamic: true
                })
                console.log('itemRec', itemRec)
                var lineCount = itemRec.getLineCount({
                    sublistId: 'locations'
                });

                  console.log('lineCount', lineCount)
var transitQuantity=0
                for (var i = 0; i <= lineCount; i++) {
                   
                    var transitQty = itemRec.getCurrentSublistValue({
                        sublistId: 'locations',
                        fieldId: 'quantityintransit',
                        line:i
                      
                    })
                    console.log('transitQty',transitQty)
                    transitQuantity = transitQuantity + transitQty;
                 
                 //   transitQty.push(transitData);

                }

                console.log('transitQty', transitQuantity)
                var itemId = currentRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_jj_in_transit_quantity',
                    value:transitQuantity
                });

            }
        }




        return {

            validateLine: validateLine

        };

    });
