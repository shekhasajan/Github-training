/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search','N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
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
                    title: 'Customer Information Form'
                });
                var sublist = form.addSublist({
                    id : 'custpage_jj_sublist',
                    type : serverWidget.SublistType.INLINEEDITOR,
                    label : 'Sales order details'
                });
                sublist.addField({
                    id: 'custpage_jj_docno',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document Number'
                });
                sublist.addField({
                    id: 'custpage_jj_cus_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                });
    
                sublist.addField({
                    id: 'custpage_jj_sub',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subsidiary'
                });
                sublist.addField({
                    id: 'custpage_jj_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Date'
                });
                
                form.addSubmitButton({
                    label: 'Submit'
                });

                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    
                    filters:
                    [
                       ["type","anyof","SalesOrd"], 
                       "AND", 
                       ["mainline","is","T"]
                    ],
                    columns:
                    [
                       search.createColumn({name: "tranid", label: "Document Number"}),
                       search.createColumn({name: "entity", label: "Name"}),
                       search.createColumn({name: "subsidiary", label: "Subsidiary"}),
                       search.createColumn({name: "trandate", label: "Date"})
                    ]
                 });
                 var searchResultCount = salesorderSearchObj.runPaged().count;
                 var soArray = [];
                 log.debug("salesorderSearchObj result count",searchResultCount);
                 salesorderSearchObj.run().each(function(result){
                    log.debug('result', result)
                    var docNo= result.getValue({
                        name:"tranid"
                    })
                    var name= result.getText({
                        name:"entity"
                    })
                    // var subsidiary = result.getValue({
                    //     name:"subsidiary"
                    // })
                    var subsidiary = result.getText({
                        name:"subsidiary"
                    })
                    var date = result.getValue({
                        name:"trandate"
                    })
            
                    var sol_data={docNo:docNo,name:name, date:date, subsidiary:subsidiary}
                    soArray.push(sol_data);

                    return true;
                 });
                 for(var i=0;i<searchResultCount;i++){
                    sublist.setSublistValue({
                        id: 'custpage_jj_docno',
                        line: i,
                        value: soArray[i].docNo
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_cus_name',
                        line: i,
                        value: soArray[i].name
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_date',
                        line: i,
                        value: soArray[i].date
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_sub',
                        line: i,
                        value: soArray[i].subsidiary
                    });

                 }

                scriptContext.response.writePage(form);
            }
            

        }

        return {onRequest}

    });
