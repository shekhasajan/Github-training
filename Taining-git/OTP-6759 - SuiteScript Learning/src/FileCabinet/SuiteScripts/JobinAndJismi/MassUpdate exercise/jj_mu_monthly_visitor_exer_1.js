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
         
            
            var id = record.submitFields({
                type: 'customrecord_jj_monthly_visotors_info',
                id: params.id,
                values: {
                    custrecord_jj_marital_status: 2,
                   
                },
                options: {
                    ignoreMandatoryFields : true
                }
            });

        }

        return {each}

    });
