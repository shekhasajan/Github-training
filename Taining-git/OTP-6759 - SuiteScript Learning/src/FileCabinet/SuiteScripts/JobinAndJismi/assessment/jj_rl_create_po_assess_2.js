/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            var fieldLookUp = search.lookupFields({
                type: search.Type.PURCHASE_ORDER,
                id: requestParams.poId,
                columns: ['subsidiary', 'currency', 'entity', 'tranid']
            });
            return ({
                "Name": fieldLookUp.entity,
                "Subsidiary": fieldLookUp.subsidiary,
                "Document Number": fieldLookUp.tranid,
                "Currency": fieldLookUp.currency
            });
        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {
            var id = record.submitFields({
                type: record.Type.SALES_ORDER,
                id: requestBody.soId,
                values: {
                    memo: requestBody.memo,
                    salesrep: requestBody.repId,
                    location: requestBody.locId
                },
                options: {
                    ignoreMandatoryFields : true
                }
            });
            return("updated")
        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            //entity:1268
            //item:260
            //qty:5
            //sub:5
            //amount:1000
            var objRecord = record.create({
                type: record.Type.PURCHASE_ORDER,
                isDynamic: true,
            });

            objRecord.setValue({
                fieldId:'entity',
                value: requestBody.entityId
            });
            objRecord.setValue({
                fieldId:'subsidiary',
                value: requestBody.subId
            })
        
            objRecord.selectNewLine({ 
                sublistId: 'item'     
                });
                
                objRecord.setCurrentSublistValue({   
                sublistId: 'item',
                fieldId: 'item',
                value: requestBody.itemId  
                });
                objRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: requestBody.qty
                });
                objRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    value: requestBody.amt
                    });
                
                
                
                objRecord.commitLine({  
                sublistId: 'item'
                });
                
                var recordId = objRecord.save({                
                ignoreMandatoryFields: true    
                });
           

            return ({
                "recordId": recordId
                

            });
        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {
            record.delete({
                type: record.Type.SALES_ORDER,
                id: requestParams.soId
            })
            return("deleted")
        }

        return { get, put, post, delete: doDelete }

    });
