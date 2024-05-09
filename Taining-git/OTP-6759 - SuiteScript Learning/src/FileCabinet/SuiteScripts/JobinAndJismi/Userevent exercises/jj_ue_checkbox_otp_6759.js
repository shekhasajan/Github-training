/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

/*************************************************************************************
***********
*Jobin And Jismi
* 
* ${JIRA_CODE} : OTP-6759
*
* 
**************************************************************************************
********
*
* Author: Jobin and Jismi IT Services
*
* Date Created : 22-April-2024
*
* Description : This script is for enabling the checkbox in the customer record, when the salesorder is created and 
* enabling the checkbox in the vendor record, when purchase order is created.
*
* REVISION HISTORY
*
* @version 1.0 ABC-5 : 22-April-2022 : Created the initial build by JJ0054
*
*
*************************************************************************************
**********/

define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            if (scriptContext.type === scriptContext.UserEventType.CREATE) {
                let customRecord = scriptContext.newRecord;
                let recordType = scriptContext.newRecord.type;
                log.debug('recordType', recordType);
                if (recordType == "salesorder") {
                    try {
                        let customerId = customRecord.getValue({
                            fieldId: 'entity',
                        });
                        log.debug('customer', customerId);
                        var customerRec = record.load({
                            type: record.Type.CUSTOMER,
                            id: customerId

                        })
                        customerRec.setValue({
                            fieldId: 'custentity_sample_check_box',
                            value: true
                        })
                        customerRec.save();
                    }
                    catch (e) {
                        log.debug('error at SO creation', e)
                    }
                }
                if (recordType == "purchaseorder") {
                    try {
                        let vendorId = customRecord.getValue({
                            fieldId: 'entity',
                        });
                        log.debug('vendorId', vendorId);
                        var vendorRec = record.load({
                            type: record.Type.VENDOR,
                            id: vendorId

                        })
                        log.debug('vendorRec', vendorRec)
                        vendorRec.setValue({
                            fieldId: 'custentity_sample_check_box',
                            value: true
                        })
                        vendorRec.save({
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        });
                    }
                    catch (e) {
                        log.debug('error at po creation', e)
                    }
                }

            }
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
