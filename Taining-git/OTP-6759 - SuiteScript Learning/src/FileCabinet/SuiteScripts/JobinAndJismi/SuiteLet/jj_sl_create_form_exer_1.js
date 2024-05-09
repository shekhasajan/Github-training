/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record','N/ui/serverWidget'],
    /**
 * @param{record} record
 */
    (record,serverWidget) => {
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
                var age =form.addField({
                    id: 'custpage_jj_age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age'
                });
                var phone =form.addField({
                    id: 'custpage_jj_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone'
                });
                var email =form.addField({
                    id: 'custpage_jj_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
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
        }

        return {onRequest}

    });
