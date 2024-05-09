/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/currentRecord', 'N/record'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 */
    (currentRecord, record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            record.submitFields({
                type: record.Type.INVOICE,
                id: params.id,
                values: {
                    duedate: "3/16/2024"
                   
                },
                options: {
                    ignoreMandatoryFields : true
                }
            });
           
            return true;
        }

        return {each}

    });
