/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/email', 'N/file', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, file, record, runtime, search) => {
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
                id: 'customsearch_jj_prev_month_exer_1'
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
                var cusArr = [];
                var recObj = JSON.parse(mapContext.value);
                log.debug('recObj', recObj)
                var soId = recObj.id;
                var cusName = recObj["values"]["entity"].text;
                log.debug('cusName', cusName)
                var cusId = recObj["values"]["entity"].value;
                log.debug('cusId', cusId)
                var cusEmail = recObj["values"]["email.customerMain"];
                log.debug('cusEmail', cusEmail)
                var docNo = recObj["values"].tranid;
                log.debug('docNo', docNo)
                var amount = recObj["values"].amount;
                log.debug('amount', amount)
                var salesRep = recObj["values"]["salesrep.customerMain"].value;
                var cusDetails = { cusName: cusName, cusId: cusId, docNo: docNo, amount: amount, cusEmail: cusEmail }
                // cusArr.push(cusDetails);
                if (!salesRep) {
                    salesRep = -5;
                }

                mapContext.write(salesRep, cusDetails);


                //    if(!salesRep){
                // salesRep = -5;
                //    }
                //    log.debug('salesRep',salesRep)
                //    var csvContent = "Customer Name,Email,Sales Order Document Number,Sales Amount\n";
                //    csvContent += cusName + "," + cusEmail + "," + docNo + "," + amount + "\n";




                // Send email
                //  sendEmail(salesRep , csvFile , cusId);
            }
            catch (e) {

                log.debug('err', e)
            }
        }


        const reduce = (reduceContext) => {
            try {
                var repId = reduceContext.key;
                var soDetails = reduceContext.values;
                log.debug('repId', repId)
                log.debug('soDetails', soDetails)

                var repRec = record.load({
                    type: record.Type.EMPLOYEE,
                    id: repId,
                    isDynamic: true,
                })
                var repEmail = repRec.getValue({
                    fieldId: 'email'
                })

                var length = soDetails.length;
                log.debug('length', length)
                var csvContent = "Customer Name,Email,Sales Order Document Number,Sales Amount\n";
                for (var i = 0; i < length; i++) {
                    var jsonString = soDetails[i];

                    // Parse the JSON string
                    var parsedObject;

                    try {
                        parsedObject = JSON.parse(jsonString);
                        log.debug("Parsed Object " + i + ":", parsedObject);
                        var docNo = parsedObject.docNo;
                        var cusId = parsedObject.cusId;
                        var cusName = parsedObject.cusName;
                        var amount = parsedObject.amount;
                        var cusEmail = parsedObject.cusEmail;
                        csvContent += cusName + "," + cusEmail + "," + docNo + "," + amount + "\n";

                    } catch (error) {
                        log.debug("Error parsing JSON:", error);
                    }
                }

                log.debug('csvContent', csvContent)
                // Create CSV file
                var csvFile = file.create({
                    name: 'Sales_Info.csv',
                    fileType: file.Type.CSV,
                    folder: 202,
                    contents: csvContent
                });



                var csvFileId = csvFile.save();
                log.debug('csvFileId', csvFileId)
                log.debug('CSV File Created with ID', csvFileId);

                if (repEmail) {
                    email.send({
                        author: -5,
                        recipients: repId,
                        subject: 'Sales orders prev month!',
                        body: 'test',
                        attachments: [csvFile]
                    })
                    log.debug('mail send', repId)
                }


            }
            catch (e) {
                log.debug('err', e)
            }

        }




        return { getInputData, map, reduce }

    });
