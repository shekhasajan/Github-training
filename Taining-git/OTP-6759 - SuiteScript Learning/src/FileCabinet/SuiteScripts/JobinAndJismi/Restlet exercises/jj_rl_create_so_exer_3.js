/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record','N/search'],
    /**
 * @param{record} record
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

            //entity:29
            //item:251
            //qty:5
            var salesOrder = record.create({
                type: record.Type.SALES_ORDER, 
                isDynamic: true,
                defaultValues: {
                    entity: requestBody.entityId
                } 
            });
         
        salesOrder.selectNewLine({ //add a line to a sublist
        sublistId: 'item'      //specify which sublist
        });
        
        salesOrder.setCurrentSublistValue({   //set item field
        sublistId: 'item',
        fieldId: 'item',
        value:requestBody.itemId //replace with item internal id 
        });
        salesOrder.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'quantity',
        value: requestBody.qty //replace with quantity
        });
        salesOrder.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'amount',
            value: requestBody.amount
            });
        
        //repeat above pattern to set the rest of the line fields
        
        salesOrder.commitLine({  //writes the line entry into the loaded record
        sublistId: 'item'
        });
        
       let id = salesOrder.save({                  //writes record back to database
        ignoreMandatoryFields: true    //set for testing in case you want to create a record without validating which can give errors
        });

        return ({
            "Name": id
          
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

        }

        return {get, put, post, delete: doDelete}

    });
