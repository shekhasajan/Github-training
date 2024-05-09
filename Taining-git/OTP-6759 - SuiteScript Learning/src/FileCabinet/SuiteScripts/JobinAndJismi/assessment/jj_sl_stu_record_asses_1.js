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
                    title: 'Student Record Form'
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
           
                var sex = form.addField({
                    id: 'custpage_jj_sex',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Sex'
                });
                sex.addSelectOption({
                    value: '',
                    text: ''
                });
                sex.addSelectOption({
                    value: 2,
                    text: 'F'
                });
                sex.addSelectOption({
                    value: 1,
                    text: 'M'
                });
              sex.addSelectOption({
                    value: 3,
                    text: 'Others'
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

                var data = JSON.parse(scriptContext.request.body);
                log.debug('data',data)
                let name = data.custpage_jj_name;
                let age = data.custpage_jj_age;
                let addr = data.custpage_jj_address;
                let sex = data.custpage_jj_sex;
                log.debug('name',name)
                // let name = scriptContext.request.parameters.custpage_jj_name;
                // let age = scriptContext.request.parameters.custpage_jj_age;
                // let addr = scriptContext.request.parameters.custpage_jj_address;
                // let sex = scriptContext.request.parameters.custpage_jj_sex;
                // log.debug('sex',sex)
                let customRecId = createCustomRecord(name, age, addr, sex);

                // Display the entered details
                var detailsHtml = '<h2>Student record created</h2>';
                detailsHtml += '<p><b>Detailes successfully saved on record</b> ' + customRecId + '</p>';
               

                scriptContext.response.write(detailsHtml);

                
              
            }

            function createCustomRecord(name, age, addr, sex) {
                log.debug('name',name)
                var customRecord = record.create({ type: 'customrecord_jj_student_record', isDynamic: true });
               
                customRecord.setValue({
                    fieldId: 'name',
                    value: name
                });
                customRecord.setValue({
                    fieldId: 'custrecord_jj_stu_age',
                    value: age
                });
    
                customRecord.setValue({
                    fieldId: 'custrecord_jj_stu_sex',
                    value: sex
                });
            
                customRecord.setValue({
                    fieldId: 'custrecord_jj_stu_address',
                    value: addr
                });
                var recordId = customRecord.save({ ignoreMandatoryFields: false, enableSourcing: true });
                log.debug("record id", recordId);
                return recordId;
               
            }

        }

        return {onRequest}

    });
