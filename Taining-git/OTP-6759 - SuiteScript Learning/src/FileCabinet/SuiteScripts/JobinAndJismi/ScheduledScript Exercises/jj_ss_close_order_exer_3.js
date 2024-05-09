/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            log.debug('test')
            var loadSearch = search.load({
                id: 'customsearch_jj_so_4days_ago'
            });
          
            loadSearch.run().each(function(result) {
                log.debug('123')
                let salesOrderRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id:result.id,
                    isDynamic: true
                });
                const lineCount = salesOrderRecord.getLineCount({sublistId: 'item'});
                log.debug('lineCount',lineCount)
                for (let i = 0; i < lineCount; i++) {
                    
                    var itemtype = salesOrderRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemtype',
                        line: i
                    });
                    if(itemtype !== 'EndGroup'){

                    
                    salesOrderRecord.selectLine({sublistId: 'item',line: i});
                    salesOrderRecord.setCurrentSublistValue({sublistId: 'item',fieldId: 'isclosed',value: true});
                  salesOrderRecord.commitLine({sublistId: 'item'});
                    }
                }
                salesOrderRecord.save();
                log.debug('deleted0',result.id)
                return true;
            })
        
        }

        return {execute}

    });
