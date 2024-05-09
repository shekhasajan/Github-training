/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/currentRecord', 'N/record', 'N/search'],
    /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{search} search
 */
    (currentRecord, record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            // var loadSearch = search.load({
            //     id: 'customsearch152'
            // });
          
          
         //   loadSearch.run().each(function(result) {
               // var soId = result.id;
        
              record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: params.id,
                    values: {
                        memo: "memo updated"
                       
                    },
                    options: {
                        ignoreMandatoryFields : true
                    }
                });
               
                return true;
          //  });
           
        }

        return {each}

    });
