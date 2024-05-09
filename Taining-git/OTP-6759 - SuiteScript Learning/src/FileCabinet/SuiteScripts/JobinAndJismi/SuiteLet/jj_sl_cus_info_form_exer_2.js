/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/search'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget, search) => {
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
                    title: 'Customer Information Form'
                });
                var name = form.addField({
                    id: 'custpage_jj_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });

                var phone = form.addField({
                    id: 'custpage_jj_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone'
                });
                var email = form.addField({
                    id: 'custpage_jj_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                // var salesrep =form.addField({
                //     id: 'custpage_jj_salesrep',
                //     type: serverWidget.FieldType.SELECT,
                //     label: 'Sales Rep'
                // });
                var subsidiary = form.addField({
                    id: 'custpage_jj_subsidiary',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Subsidiary',
                    source: 'subsidiary'
                });
                var salesRepField = form.addField({
                    id: 'custpage_jj_salesrep',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Sales Rep',
                    source: 'salesrep'
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
                let name = scriptContext.request.parameters.custpage_jj_name;
                let email = scriptContext.request.parameters.custpage_jj_email;
                let phone = scriptContext.request.parameters.custpage_jj_phone;
                let salesR = scriptContext.request.parameters.custpage_jj_salesrep;
                let sub = scriptContext.request.parameters.custpage_jj_subsidiary;
                log.debug('salesR',salesR)

                var fieldLookUp = search.lookupFields({
                    type: search.Type.SUBSIDIARY,
                    id: sub,
                    columns: ['name']
                });
              
                // Display the entered details
                var detailsHtml = '<h2>Registration Details</h2>';
                detailsHtml += '<p><b>Name:</b> ' + name + '</p>';
                detailsHtml += '<p><b>Email:</b> ' + email + '</p>';
                detailsHtml += '<p><b>Phone Number:</b> ' + phone + '</p>';
                detailsHtml += '<p><b>Sales Rep:</b> ' + salesR + '</p>';
                detailsHtml += '<p><b>Subsidiary</b> ' + fieldLookUp.name + '</p>';

                scriptContext.response.write(detailsHtml);

                let customRecId = createCustomRecord(name, email, phone, salesR, sub);
                log.debug('customRecId',customRecId)
                // if (customRecId)
                // scriptContext.response.sendRedirect("SUITELET", "customscript_jj_sl_cus_info_form_exer_2", "customdeploy_jj_sl_cus_info_form_exer_2");
                // else
                // scriptContext.response.writePage("Sorry!! Your data is not submitted. Please try again...");
                // log.debug('Customer Created', 'Customer ID: ' + customerId);
            }
        }
        function createCustomRecord(name, email, phone, salesR, sub) {
            log.debug('name',name)
            var customRecord = record.create({
                type: record.Type.CUSTOMER, 
                isDynamic: true,
              
            })
       //     var customRecord = record.create({ type: 'record.Type.CUSTOMER', isDynamic: true });
            customRecord.setValue({
                fieldId: 'companyname',
                value: name
            });
            customRecord.setValue({
                fieldId: 'email',
                value: email
            });
            customRecord.setValue({
                fieldId: 'subsidiary',
                value: sub
            });

            customRecord.setValue({
                fieldId: 'phone',
                value: phone
            });
            customRecord.setText({
                fieldId: 'salesrep',
                text: salesR
            });
            var recordId = customRecord.save({ ignoreMandatoryFields: false, enableSourcing: true });
            log.debug("record id", recordId);
            return recordId;
           
        }


        return { onRequest }

    });
