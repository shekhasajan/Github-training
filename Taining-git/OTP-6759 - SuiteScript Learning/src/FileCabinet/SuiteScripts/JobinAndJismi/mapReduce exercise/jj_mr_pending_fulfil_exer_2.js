/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/email', 'N/file', 'N/record', 'N/render', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{render} render
 * @param{runtime} runtime
 */
    (email, file, record, render, runtime, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            var loadSearch = search.load({
                id: 'customsearch_jj_so_pending_approval'
            });
            log.debug('loadSearch', loadSearch)
            return loadSearch;
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */


        const map = (mapContext) => {
            try {
                log.debug('test')
                // var recObj = mapContext.value;
                var recObj = JSON.parse(mapContext.value);
                log.debug('recObj', recObj)
                log.debug('aa', recObj.id)
                log.debug('bb', recObj.values.tranid)
                var salesRep = recObj["values"]["salesrep.customerMain"].value
                log.debug('salesRep', salesRep) 
                var senderId = '1945';
                var user = runtime.getCurrentUser().id;
                log.debug('user',user)
                log.debug('user1',runtime.getCurrentUser())
if(!salesRep){
salesRep = -5;
}
                email.send({
                    author: senderId,
                    recipients: salesRep,
                    subject: 'Status updated',
                    body: 'Status changed'  
                });

                 var recId = mapContext.value['tranid'];
                 log.debug('recId',recId)
                var id = record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: recObj.id,
                    values: {
                        orderstatus: "B",

                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });


            } catch (e) {
                log.debug('err', e)
            }
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        



     

        return { getInputData, map }

    });
