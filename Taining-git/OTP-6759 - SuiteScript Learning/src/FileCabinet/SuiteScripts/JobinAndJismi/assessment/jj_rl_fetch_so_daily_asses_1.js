/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/search', 'N/record'],
    /**
 * @param{search} search
 */
    (search, record) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            //create search to fetch the the item level details from salesorder
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters:
                [
                   ["type","anyof","SalesOrd"], 
                   "AND", 
                   ["internalid","anyof",requestParams.soId], 
                   "AND", 
                   ["mainline","is","F"], 
                   "AND", 
                   ["taxline","is","F"]
                ],
                columns:
                [
                   search.createColumn({name: "rate", label: "Item Rate"}),
                   search.createColumn({name: "amount", label: "Amount"}),
                   search.createColumn({name: "quantity", label: "Quantity"}),
                   search.createColumn({name: "item", label: "Item"})
                ]
             });
             var searchResultCount = salesorderSearchObj.runPaged().count;
             log.debug("salesorderSearchObj result count",searchResultCount);
             var soDetails =[]
             salesorderSearchObj.run().each(function(result){
                // .run().each has a limit of 4,000 results
                var item = result.getText({
                    name: 'item'
                });
                var qty =  result.getValue({
                    name: 'quantity'
                });

               var amt =  result.getValue({
                    name: 'amount'
                });
                var rate = result.getValue({
                    name:"rate"
                })
                var soData = {Itemname: item, qty: qty, amount:amt, rate:rate};

                // vendorDetails.entity = entity;
                // vendorDetails.subsidiary = subsidiary;
                soDetails.push(soData);
               
                return true;
             });
             log.debug('items', soDetails)
             if(searchResultCount>2){
                var message = "Sales order contains more than 2 items"
                soDetails.push(message);
             }
             return (soDetails);
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
            //update the memo , employee and location in a specific purchase order
            var id = record.submitFields({
                type: record.Type.PURCHASE_ORDER,
                id: requestBody.poId,
                values: {
                    memo: requestBody.memo,
                    employee: requestBody.empId,
                    location:requestBody.locId
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields : true
                }
            });
            return(updated)
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
