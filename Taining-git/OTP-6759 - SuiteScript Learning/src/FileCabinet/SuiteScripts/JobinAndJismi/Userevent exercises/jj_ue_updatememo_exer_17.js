/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
/*************************************************************************************
***********
* Jobin And Jismi
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
* Description : This script is for enabling the updating the memo field when the memo checkbox is checked in Salesorder.
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
            if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) {
                let soRecord = scriptContext.newRecord;
             
                    try {
                        let isMemoChecked = soRecord.getValue({
                            fieldId: 'custbody_jj_memo_updated',
                        });
                        log.debug('isMemoChecked', isMemoChecked);
                     if (isMemoChecked == true){
                        soRecord.setValue({
                            fieldId: 'memo',
                            value: "Memo Updated"
                        })
                     }
                      
                        
                    }
                    catch (e) {
                        log.debug('error at SO creation', e)
                    }
                
            }
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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
