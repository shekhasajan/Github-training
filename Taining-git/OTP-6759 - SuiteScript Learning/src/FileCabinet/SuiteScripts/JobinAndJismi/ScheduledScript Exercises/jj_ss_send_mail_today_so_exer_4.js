/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search','N/email','N/render','N/runtime'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email,render,runtime) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try{
            var loadSearch = search.load({
                id: 'customsearch_jj_today_so_mail'
            });
            var senderId = '-5';
            loadSearch.run().each(function(result) {
                var cusId = result.getValue({
                    name:'entity'
                })
                var cusName = result.getText({
                    name:'entity'
                })
                var docNo = result.getValue({
                    name:'tranid'
                })
                log.debug('id',result.id)
                log.debug('cusId',cusId)
                var Soid =parseInt(result.id);
                // var renderer = render.create({
                    
                //         type: record.Type.SALES_ORDER,
                //         id: result.id
                    
                // });
                // var pdfFile = renderer.renderAsPdf();

                // var salesOrderPdf = render.transaction({
                    
                //     printMode: render.PrintMode.PDF
                // });

                var salesOrderId = parseInt(result.id);
                log.debug('salesOrderId',salesOrderId)
                var salesOrderPdf = render.transaction({
                   entityId: salesOrderId,
                   printMode: render.PrintMode.PDF
                });
                var htmlBody = '<html><body><h1>Open invoices!</h1>';
                htmlBody += '<p> Document No:' + docNo + '</p>';
                htmlBody += '<p> Customer:' + cusName + '</p>';
                htmlBody += '</body></html>';

                email.send({
                    author:senderId,
                    recipients: cusId,
                    subject: 'Orders created today!',
                    body: htmlBody,
                  attachments: [salesOrderPdf]` `
                  
                });
                log.debug('email',cusName)
                log.debug('doc',docNo)

              
                return true;
            })
        }catch(e){
            log.debug('err',e)
        }
        }

        return {execute}

    });
