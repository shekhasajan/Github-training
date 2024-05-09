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
                    title: 'Sales order which need to be fulfilled and billed'
                });
                var sublist = form.addSublist({
                    id: 'custpage_jj_sublist',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Sales order details'
                });
                sublist.addField({
                    id: 'custpage_jj_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Internal Id'
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
                sublist.addField({
                    id: 'custpage_jj_status',
                    type: serverWidget.FieldType.TEXT,
                    label: 'status'
                });
                sublist.addField({
                    id: 'custpage_jj_dept',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Department'
                });
                sublist.addField({
                    id: 'custpage_jj_class',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Class'
                });
                sublist.addField({
                    id: 'custpage_jj_total',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Transaction total'
                });
                sublist.addField({
                    id: 'custpage_jj_tax',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Tax total'
                });
                sublist.addField({
                    id: 'custpage_jj_subtotal',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sub total'
                });

             var cusField =   form.addField({
                    id: 'custpage_jj_filter_name',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Customer Name',
                    source: 'customer'
                })
               var subField = form.addField({
                    id: 'custpage_jj_filter_sub',
                    type: serverWidget.FieldType.SELECT,
                    label: 'subsidiary',
                    source: 'subsidiary'
                })

                form.addSubmitButton({
                    label: 'Submit'
                });

                var searchResult = soSearch();
                populateform(searchResult, sublist);
                form.clientScriptModulePath = 'SuiteScripts/jj_cs_attach_suitelet.js'
                

                //  var salesOrderID = scriptContext.request.parameters['customerFilter'];
                var cus = scriptContext.request.parameters.customerFilter;
                log.debug('cus', cus)
                var sub = scriptContext.request.parameters.subsidiaryFilter;
                log.debug('sub', sub)
                if (cus || sub) {
                    var filterBycus = soSearch(cus, sub);
                    log.debug('filterBycus', filterBycus)
                    populateform(filterBycus,sublist);

                    cusField.defaultValue = cus;
                    subField.defaultValue = sub;
                }


            }


            function soSearch(cus, sub) {
                var filters = [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["mainline", "is", "T"],
                    "AND",
                    ["status", "noneof", "SalesOrd:G", "SalesOrd:H", "SalesOrd:C"]

                ];
                if (sub) {
                    log.debug('entered')
                    filters.push(
                        "AND",
                        ["subsidiary", "anyof", sub]
                    );
                }
                if (cus) {
                    log.debug('entered1')
                    filters.push("AND", ["name", "anyof", cus]);
                }
                log.debug('filters', filters)
                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                    filters: filters,

                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "tranid", label: "Document Number" }),
                            search.createColumn({ name: "trandate", label: "Date" }),
                            search.createColumn({ name: "status", label: "Status" }),
                            search.createColumn({ name: "entity", label: "Name" }),
                            search.createColumn({ name: "subsidiary", label: "Subsidiary" }),
                            search.createColumn({ name: "department", label: "Department" }),
                            search.createColumn({ name: "class", label: "Class" }),
                            search.createColumn({ name: "total", label: "Amount (Transaction Total)" }),
                            search.createColumn({ name: "taxamount", label: "Amount (Tax)" })
                        ]
                });


                return salesorderSearchObj;
            }


            function populateform(searchResult, sublist) {

                var searchResultCount = searchResult.runPaged().count;
                log.debug('searchResultCount 2', searchResultCount)
                var soDetails = [];
                log.debug("salesorderSearchObj result count 2", searchResultCount);
                searchResult.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    var id = result.getValue({
                        name: 'internalid'
                    })
                    var docNo = result.getValue({
                        name: 'tranid'
                    })
                    var date = result.getValue({
                        name: 'trandate'
                    })
                    var status = result.getText({
                        name: 'status'
                    })
                    var customer = result.getText({
                        name: 'entity'
                    })
                    var subsidiary = result.getText({
                        name: 'subsidiary'
                    })
                    var dept = result.getText({
                        name: 'department'
                    })
                    var clas = result.getText({
                        name: 'class'
                    })
                    var total = result.getValue({
                        name: 'total'
                    })
                    var tax = result.getValue({
                        name: 'taxamount'
                    })


                    var sodata = { id: id, docNo: docNo, date: date, status: status, customer: customer, subsidiary: subsidiary, dept: dept, class: clas, total: total, tax: tax }
                    soDetails.push(sodata)
                    return true;
                });

                log.debug('soDetails', soDetails)
                for (var i = 0; i < searchResultCount; i++) {
                    
                    sublist.setSublistValue({
                        id: 'custpage_jj_id',
                        line: i,
                        value: soDetails[i].id
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_docno',
                        line: i,
                        value: soDetails[i].docNo
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_cus_name',
                        line: i,
                        value: soDetails[i].customer
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_sub',
                        line: i,
                        value: soDetails[i].subsidiary
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_date',
                        line: i,
                        value: soDetails[i].date
                    });

                    sublist.setSublistValue({
                        id: 'custpage_jj_status',
                        line: i,
                        value: soDetails[i].status
                    });
                    // sublist.setSublistValue({
                    //     id: 'custpage_jj_tax',
                    //     line: i,
                    //     value: soDetails[i].tax
                    // });
                    // sublist.setSublistValue({
                    //     id: 'custpage_jj_dept',
                    //     line: i,
                    //     value: soDetails[i].dept || ''
                    // });
                    // sublist.setSublistValue({
                    //     id: 'custpage_jj_class',
                    //     line: i,
                    //     value: soDetails[i].class || ''
                    // });


                    sublist.setSublistValue({
                        id: 'custpage_jj_total',
                        line: i,
                        value: soDetails[i].total
                    });

                }

                scriptContext.response.writePage(form);
              
            }
        }

        return { onRequest }

    });
