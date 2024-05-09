/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/email', 'N/runtime'],
    (record, search, serverWidget, email, runtime) => {

        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'Employee Training Form'
                });
                var name = form.addField({
                    id: 'custpage_jj_name',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Employee Name',
                    source: 'employee'
                });

                var emailField = form.addField({
                    id: 'custpage_jj_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });

                var course = form.addField({
                    id: 'custpage_jj_course',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Training Course'
                });

                var trainer = form.addField({
                    id: 'custpage_jj_trainer',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Trainer',
                    source: 'employee'
                });

                var status = form.addField({
                    id: 'custpage_jj_status',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Training status'
                });
                status.addSelectOption({
                    value: '',
                    text: ''
                });
                status.addSelectOption({
                    value: 1,
                    text: 'completed'
                });
                status.addSelectOption({
                    value: 2,
                    text: 'In Progress'
                });
                status.addSelectOption({
                    value: 3,
                    text: 'Not started'
                });

                form.addSubmitButton({
                    label: 'Submit'
                });
                scriptContext.response.writePage(form);

            } else if (scriptContext.request.method === 'POST') {
                let name = scriptContext.request.parameters.custpage_jj_name;
                let email1 = scriptContext.request.parameters.custpage_jj_email;
                let course = scriptContext.request.parameters.custpage_jj_course;
                let trainer = scriptContext.request.parameters.custpage_jj_trainer;
                let status = scriptContext.request.parameters.custpage_jj_status;

                let customRecId = createCustomRecord(name, email1, course, trainer, status);

                var customrecord_jj_employee_training_recordSearchObj = search.create({
                    type: "customrecord_jj_employee_training_record",
                    filters:
                    [
                       ["custrecord_jj_training_status","anyof","2"]
                    ],
                    columns:
                    [
                       search.createColumn({name: "internalid", label: "Internal ID"}),
                       search.createColumn({name: "created", label: "Date Created"}),
                       search.createColumn({name: "custrecord_jj_emp_name", label: "Employee Name"}),
                       search.createColumn({name: "custrecord_jj_emp_email", label: "Email"}),
                       search.createColumn({name: "custrecord_jj_trainer", label: "Trainer"}),
                       search.createColumn({name: "custrecord_jj_training_course", label: "Training Course"}),
                       search.createColumn({name: "custrecord_jj_training_status", label: "Training Status"})
                    ]
                 });
                 var searchResultCount = customrecord_jj_employee_training_recordSearchObj.runPaged().count;
                 var trainingDetails = [];
                 log.debug("customrecord_jj_employee_training_recordSearchObj result count",searchResultCount);
                 customrecord_jj_employee_training_recordSearchObj.run().each(function(result){
                    // .run().each has a limit of 4,000 results
                    var emp_id = result.getValue({
                        name:'internalid'
                    })
                    var emp_date = result.getValue({
                        name:'created'
                    })
                    var emp_empName = result.getValue({
                        name:'custrecord_jj_emp_name'
                    })
                    var emp_email = result.getValue({
                        name:'custrecord_jj_emp_email'
                    })
                    var emp_trainer = result.getValue({
                        name:'custrecord_jj_trainer'
                    })
                    var emp_course=result.getValue({
                        name:'custrecord_jj_training_course'
                    })
                    var emp_status =result.getText({
                        name:'custrecord_jj_training_status'
                    })
                    var trainingInProgress = {Internal_id:emp_id, employeename:emp_empName, trainer:emp_trainer,course:emp_course,status:emp_status}
                    trainingDetails.push(trainingInProgress);
                    return true;
                 });
log.debug('trainingDetails', trainingDetails)
var trainingData = JSON.stringify(trainingDetails)
                // Display the entered details
                var detailsHtml = '<h2>Employee Training Details</h2>';
                detailsHtml += '<p><b>Details successfully saved on record:</b> ' + customRecId + '<br>' + trainingData + '</p>';

                scriptContext.response.write(detailsHtml);
            }
        }

        function createCustomRecord(name, email1, course, trainer, status) {
            var customRecord = record.create({ type: 'customrecord_jj_employee_training_record', isDynamic: true });
            customRecord.setValue({
                fieldId: 'custrecord_jj_emp_name',
                value: name
            });
            customRecord.setValue({
                fieldId: 'custrecord_jj_emp_email',
                value: email1
            });
            customRecord.setValue({
                fieldId: 'custrecord_jj_training_course',
                value: course
            });
            customRecord.setValue({
                fieldId: 'custrecord_jj_trainer',
                value: trainer
            });
            customRecord.setValue({
                fieldId: 'custrecord_jj_training_status',
                value: status
            });

            var recordId = customRecord.save({ ignoreMandatoryFields: false });
            log.debug("record id", recordId);
            var senderId = 94;
            // Sending email notification to trainer
            if (recordId) {
                email.send({
                    author:senderId,
                    recipients: trainer,
                    subject: 'Employee Training Registration Details',
                    body: 'Employee is registered for training. Training details have been saved with record ID: ' + recordId
                });
            }
            return recordId;
        }

        return { onRequest }

    });