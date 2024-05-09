/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
//             var customrecord_jj_student_detailsSearchObj = search.create({
//                 type: "customrecord_jj_student_details",
//                 filters:
//                 [
//                 ],
//                 columns:
//                 [
//                    search.createColumn({name: "custrecord_jj_student_class", label: "Class"})
//                 ]
//              });
//              var searchResultCount = customrecord_jj_student_detailsSearchObj.runPaged().count;
//              log.debug("customrecord_jj_student_detailsSearchObj result count",searchResultCount);
//              customrecord_jj_student_detailsSearchObj.run().each(function(result){
//                 // .run().each has a limit of 4,000 results
//                 var stuClass = result.getValue({
// name:'custrecord_jj_student_class'
//                 })
//                 var recId = result.id;
//                 log.debug('stuClass',stuClass)
//                 if(stuClass = 1 ||2 ||3 || 4||5||6||7||8||9)
//                 {
//                  var recObj= record.load({
//                     type: 'customrecord_jj_student_details',
//                     id: recId,
//                     isDynamic: true,

//                   })  
//                   recObj.setValue({
//                     fieldId:'custrecord_jj_student_class',
//                     value:stuClass + 1
//                   })
//                 }
//                 else{
//                     recObj.setValue({
//                         fieldId:'custrecord_jj_student_class',
//                         value:10
//                       })
//                 }
//                 return true;
//              });

// var id = record.submitFields({
//     type: 'customrecord_jj_monthly_visotors_info',
//     id: params.id,
//     values: {
//         custrecord_jj_student_class: 2,
       
//     },
//     options: {
//         ignoreMandatoryFields : true
//     }
// });
                 var recObj= record.load({
                    type: 'customrecord_jj_student_details',
                    id: params.id,
                    isDynamic: true,

                  })  
                  var stuClass = recObj.getValue({
                    fieldId: 'custrecordcustrecord_jj_student_class'
                  })
log.debug('stuClass',stuClass)
if (stuClass >= 1 && stuClass <= 9) {
    
                var newStu = parseInt(stuClass) + 1;
                log.debug('newwstuClass',newStu)
                  recObj.setValue({
                    fieldId:'custrecordcustrecord_jj_student_class',
                    value: newStu
                  })
                  log.debug('newstuClass',stuClass)
                  recObj.save();
                }
                else {
                    recObj.setValue({
                        fieldId:'custrecordcustrecord_jj_student_class',
                        value:'completed'
                      })
                      log.debug('newstuClass',stuClass)
                      recObj.save();
                }
                
                
                

        }

        return {each}

    });
