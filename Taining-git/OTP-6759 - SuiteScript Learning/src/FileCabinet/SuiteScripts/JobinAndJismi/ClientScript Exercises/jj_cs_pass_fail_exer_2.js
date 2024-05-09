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
        function setField(currentRecord){
           
            var isPassed = currentRecord.getValue({
                fieldId: 'custbody_jj_so_passed'
            });


            
                if (isPassed) {

                    currentRecord.setValue({
                        fieldId: 'custbody_jj_pass_fail',
                        value: 'Passed',
                        ignoreFieldChanged: true
                    });

                }
                else {

                    currentRecord.setValue({
                        fieldId: 'custbody_jj_pass_fail',
                        value: 'Failed',
                        ignoreFieldChanged: true
                    });

                }

            
        }

        function pageInit(scriptContext){
            var currentRecord = scriptContext.currentRecord;
            setField(currentRecord);
    

        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            var currentRecord = scriptContext.currentRecord;
            var fieldId = scriptContext.fieldId;
            if (fieldId === 'custbody_jj_so_passed') {
            setField(currentRecord);
            }
        }



        return {

            fieldChanged: fieldChanged,
            pageInit: pageInit

        };

    });
