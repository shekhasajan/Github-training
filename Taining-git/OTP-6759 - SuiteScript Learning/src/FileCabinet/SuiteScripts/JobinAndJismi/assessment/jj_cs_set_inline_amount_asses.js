/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record'],
    /**
     * @param{currentRecord} currentRecord
     * @param{record} record
     */
    function (currentRecord, record) {




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
            var sublistId = scriptContext.sublistId;
            var fieldId = scriptContext.fieldId;
            var amount;
            if (sublistId == 'item') {

                var isChecked = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_jj_amount_calculation',
                });

                console.log('isChecked', isChecked)
                var rate = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                });
                console.log('rate', rate)
                var qty = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                });
                console.log('qty', qty)
                if (isChecked) {
                    amount = (rate * qty) / 2;
                    console.log('amount', amount)
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        value: amount
                    });
                }
                else {
                    amount = rate * qty;
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        value: amount
                    });
                }
            }
            return true;

        }



        return {

            validateLine: validateLine

        };

    });
