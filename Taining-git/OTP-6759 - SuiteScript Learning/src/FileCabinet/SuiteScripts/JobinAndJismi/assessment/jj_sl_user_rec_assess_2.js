/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            if (scriptContext.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'User Input Form'
                });
                form.addField({
                    id: 'custpage_jj_first_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                });
                form.addField({
                    id: 'custpage_jj_last_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });



                form.addField({
                    id: 'custpage_jj_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone'
                });
                form.addField({
                    id: 'custpage_jj_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                form.addField({
                    id: 'custpage_jj_dob',
                    type: serverWidget.FieldType.DATE,
                    label: 'DOB'
                });
                var salesRepField = form.addField({
                    id: 'custpage_jj_acc_manager',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Account Manager'

                });


                var employeeSearch = search.load({
                    id: 'customsearch_jj_salesrep_search' // Change 'customsearch_salesrep_search' to the internal ID of your saved search
                });

                salesRepField.addSelectOption({
                    value: '',
                    text: ''
                });

                employeeSearch.run().each(function (result) {

                    var salesrepId = result.getValue({
                        name: 'entityid'
                    });

                    salesRepField.addSelectOption({
                        value: salesrepId,
                        text: salesrepId
                    });
                    return true;
                });

                form.addSubmitButton({
                    label: 'Submit'
                });
                scriptContext.response.writePage(form);

            }
            else if (scriptContext.request.method === 'POST') {

                try {
                    log.debug('test')
                    let fName = scriptContext.request.parameters.custpage_jj_first_name;
                    let lName = scriptContext.request.parameters.custpage_jj_last_name;

                    let phone = scriptContext.request.parameters.custpage_jj_phone;
                    let email = scriptContext.request.parameters.custpage_jj_email;
                    let dobstring = scriptContext.request.parameters.custpage_jj_dob;
                    let accManager = scriptContext.request.parameters.custpage_jj_acc_manager;
                    log.debug('fname', fName);
                    log.debug('lname', lName);
                    log.debug('accManager', accManager);
                    log.debug('dob', dobstring);
                    var dob = new Date(dobstring);

                    // Format dob to match NetSuite's expected date format (M/D/YYYY)
                    //   var formattedDob = (dob.getMonth() + 1) + '/' + dob.getDate() + '/' + dob.getFullYear();

                    // Set value on the custom record

                    log.debug('formattedDob', dob)

                    let customRecId = createCustomRecord(fName, lName, phone, email, dob, accManager);

                    var detailsHtml = '<h2User Data recorded</h2>';
                    detailsHtml += '<p><b>Details successfully saved on record:</b> ' + customRecId + '</p>';

                    scriptContext.response.write(detailsHtml);
                }
                catch (e) {
                    log.debug('err', e)
                }

            }

        }

        function createCustomRecord(fName, lName, phone, email, dob, accManager) {
            try {
                // customRecord.setText({
                //     fieldId: 'custrecord_jj_acc_manager',
                //     text: accManager
                // });
                var customRecord = record.create({ type: 'customrecord_jj_user_data', isDynamic: true });
                log.debug('accManager1', accManager)
                customRecord.setText({
                    fieldId: 'custrecord_jj_acc_manager',
                    text: accManager
                });

                if (email) {
                    log.debug('email', email)
                    let salesRep = findCusWithEmail(email);
                    log.debug('salesRep', salesRep);
                    if (salesRep) {
                        log.debug('salesreppp')
                        customRecord.setValue({
                            fieldId: 'custrecord_jj_acc_manager',
                            value: salesRep
                        });
                    }
                }

                customRecord.setValue({
                    fieldId: 'custrecord_jj_fname',
                    value: fName
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_lname',
                    value: lName
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_user_email',
                    value: email
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_user_phone',
                    value: phone
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_dob',
                    value: dob
                });


                var recordId = customRecord.save({ ignoreMandatoryFields: false });
                log.debug("record id", recordId);

                // Sending email notification to trainer

                return recordId;
            }
            catch (e) {
                log.debug('err', e)
            }
        }
        function findCusWithEmail(email) {
            log.debug('enter')
            var customerSearchObj = search.create({
                type: "customer",
                filters:
                    [
                        ["email", "is", email]
                    ],
                columns:
                    [
                        search.createColumn({ name: "salesrep", label: "Sales Rep" }),
                        search.createColumn({ name: "email", label: "Email" })
                    ]
            });
            var searchResultCount = customerSearchObj.runPaged().count;
            log.debug("customerSearchObj result count", searchResultCount);
            var salesRepIdVal;
            customerSearchObj.run().each(function (result) {
                salesRepIdVal = result.getValue({
                    name: 'salesrep'
                })
                log.debug('salesrep search', salesRepIdVal)
                // .run().each has a limit of 4,000 results
                return true;
            });
            return salesRepIdVal;
        }
        return { onRequest }

    });
