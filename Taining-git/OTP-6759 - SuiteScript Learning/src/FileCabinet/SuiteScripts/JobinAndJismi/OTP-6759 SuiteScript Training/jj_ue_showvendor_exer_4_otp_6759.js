/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
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
            var vendorSearchObj = search.create({
                type: "vendor",
                filters:
                [
                   ["isinactive","is","F"]
                ],
                columns:
                [
                   search.createColumn({name: "entityid", label: "Name"}),
                   search.createColumn({name: "subsidiary", label: "Primary Subsidiary"})
                ]
             });
             var searchResultCount = vendorSearchObj.runPaged().count;
             log.debug("vendorSearchObj result count",searchResultCount);
             var vendorDetails = [];
             vendorSearchObj.run().each(function(result){
                // .run().each has a limit of 4,000 results
             //   log.debug('result', result)
                var entity = result.getValue({
                    name: 'entityid'
                });
                var subsidiary =  result.getText({
                    name: 'subsidiary'
                });
               
                var vendorData = {name: entity, sub: subsidiary};

                // vendorDetails.entity = entity;
                // vendorDetails.subsidiary = subsidiary;
vendorDetails.push(vendorData);
               
                return true;
             });
             
             log.debug('vendorDetails',vendorDetails)

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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
