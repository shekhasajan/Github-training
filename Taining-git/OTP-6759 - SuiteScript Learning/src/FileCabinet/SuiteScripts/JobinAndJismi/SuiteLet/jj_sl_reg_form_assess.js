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
                    title: 'Registration Form'
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
                var age =form.addField({
                    id: 'custpage_jj_age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age'
                });
               
                var fatherName =form.addField({
                    id: 'custpage_jj_father_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Fathers Name'
                });
                var Address =form.addField({
                    id: 'custpage_jj_address',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Address'
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
                let age = scriptContext.request.parameters.custpage_jj_age;
                let addr = scriptContext.request.parameters.custpage_jj_address;
                let fatherName = scriptContext.request.parameters.custpage_jj_father_name;


                // Display the entered details
                var detailsHtml = '<h2>Registration Details</h2>';
                detailsHtml += '<p><b>Name:</b> ' + name + '</p>';
                detailsHtml += '<p><b>Email:</b> ' + email + '</p>';
                detailsHtml += '<p><b>Phone Number:</b> ' + phone + '</p>';
                detailsHtml += '<p><b>Age:</b> ' + age + '</p>';
                detailsHtml += '<p><b>Fathers name:</b> ' + fatherName + '</p>';
                detailsHtml += '<p><b>Address</b> ' + addr + '</p>';

                scriptContext.response.write(detailsHtml);

                let customRecId = createCustomRecord(name, email, phone, age, addr, fatherName);
              //  log.debug('customRecId',customRecId)
                // if (customRecId)
                // scriptContext.response.sendRedirect("SUITELET", "customscript_jj_sl_cus_info_form_exer_2", "customdeploy_jj_sl_cus_info_form_exer_2");
                // else
                // scriptContext.response.writePage("Sorry!! Your data is not submitted. Please try again...");
                // log.debug('Customer Created', 'Customer ID: ' + customerId);
            }

            function createCustomRecord(name, email, phone, age, addr, fatherName) {
                log.debug('name',name)
                var customRecord = record.create({ type: 'customrecord_jj_register_form', isDynamic: true });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_reg_name',
                    value: name
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_reg_email',
                    value: email
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_reg_age',
                    value: age
                });
    
                customRecord.setValue({
                    fieldId: 'custrecord_jj_reg_phone',
                    value: phone
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_reg_father_name',
                    value: fatherName
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_reg_address',
                    value: addr
                });
                var recordId = customRecord.save({ ignoreMandatoryFields: false, enableSourcing: true });
                log.debug("record id", recordId);
                return recordId;
               
            }

        }

        return {onRequest}

    });
